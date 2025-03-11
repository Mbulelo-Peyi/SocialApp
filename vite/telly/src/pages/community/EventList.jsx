import React, { useState, useRef, useEffect } from 'react';
import { CommunityHeader, EventAdd, useAxios } from '../../components/index';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Group, LucideBadgeX, Search } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Modal } from '../../features';

const EventList = () => {
    const [type, setType] = useState("events");
    const [lookup, setLookup] = useState(false);
    const { community_id } = useParams();
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const api = useAxios();
    const fetchInterval = 1000*60*10;
    const targetRef = useRef();
    const elevatedRoles = ['Moderator','Admin']
    const { ref, entry } = useIntersection({
        root: targetRef.current,
        threshold: 0.1,
    });
    const isInViewport = entry?.isIntersecting;
    
    const eventsMutation = useMutation({
        mutationFn: (variables)=> addEvent(variables),
        onSuccess : (data)=> {
            queryClient.invalidateQueries(['events', 'infinite']);
            navigate(`/event/${community_id}/${data?.id}/`);
        },
    });
    
    const eventsSearchMutation = useMutation({
        mutationFn: (variables)=> eventsFunc(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['events', 'infinite']);
        },
    });
        
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['events', community_id, 'infinite'],
        getNextPageParam: (lastPage) => {
            try {
                const nextPage = lastPage?.next ? lastPage?.next.split('page=')[1] : null;
                return nextPage;
            } catch (error) {
                return null;
            };
        },
        queryFn: (pageParam)=> getData(pageParam),

    });

    const roleQuery = useQuery({
        queryKey: ['role', community_id],
        queryFn: ()=> getRole(),
        refetchInterval: fetchInterval,
    });

    const getRole = async ()=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/check_role/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    
    useEffect(()=>{
        if (isInViewport) {
            fetchNextPage();
        }
    },[isInViewport, entry])
    
    const getData = async ({ pageParam = 1 }) => {
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        try {
            const response = await api.get(
                lookup?`/user/api/events/?community_id=${community_id}&search_query=${search}&page=${pageParam}`:
                `/user/api/events/?community_id=${community_id}&page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const addEvent = async (data)=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.post(
                `/user/api/community/${community_id}/create_event/`,
                data,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    
    const events = data?.pages.flatMap(page => page?.results);

    const eventsFunc = (value) =>{
        setType(value)
        return events;
    };
    
    const handleSearch = (e) =>{
        e.preventDefault();
        if (search.trim() === "") return;
        setLookup(true);
        eventsSearchMutation.mutate(type);
    };

    const clearSearch = () =>{
        setLookup(false);
        setSearch("");
        eventsSearchMutation.mutate(type);;
    };

    const onClose = ()=>{setOpen(prev=>!prev)};

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <CommunityHeader community_id={community_id} />
            <h3 className="text-xl font-semibold mb-4">Events</h3>
            {!roleQuery.isLoading && elevatedRoles.includes(roleQuery.data?.role) &&(
                <button onClick={onClose}><Group /> Add Event</button>
            )}
            {/* Search Bar datetime-local*/}
            {lookup ?(
                <LucideBadgeX onClick={clearSearch} />
            ):(
                <form className="flex justify-center items-center" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search event..."
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                        className="mb-4 p-2 border rounded w-10/12 flex-1"
                    />
                    <button className="bg-blue-200 text-center" type="submit"><Search className="text-blue-600" /></button>
                </form>
            )}

            {/* Events List */}
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && events?.length === 0 ? (
                        <p className="text-gray-500">No events found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {events?.map((event) => (
                                <div key={event?.id} className="bg-white border p-4 border-slate-200">
                                    <div className="flex flex-row space-x-4">
                                        <Link to={`/event/${event?.community?.id}/${event?.id}/`}>
                                            <div>
                                                <img
                                                style={{borderWidth:1,backgroundColor:'#F3F3F4'}}
                                                src={event?.community?.logo}
                                                alt={event?.title}
                                                className="h-28 w-28 bg-gray-300 p-2"
                                                />
                                            </div>
                                        </Link>
                                        <div className="flex flex-col flex-1 pr-2">
                                            <span className="text-lg font-semibold mb-1">{event?.title}</span>
                                            <span className="text-gray-700">{event?.timesince}</span>
                                        </div>
                                        
                                    </div>
                                </div>
                            ))}
                            {(hasNextPage || isFetchingNextPage) && (
                                <div className="flex flex-col items-center justify-center">
                                    <div ref={ref} className="h-1"></div>
                                </div>
                            )}
                        </ul>
                    )}
                </React.Fragment>
            )}
            <Modal open={open} onClose={onClose}>
                <EventAdd create={eventsMutation} />
            </Modal>
        </div>
    )
}

export default EventList