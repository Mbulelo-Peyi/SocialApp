import React, { useState, useRef, useEffect } from 'react';
import { CommunityHeader, useAxios } from '../../components/index';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LucideBadgeX, Search } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const EventList = () => {
    const [type, setType] = useState("events");
    const [lookup, setLookup] = useState(false);
    const { community_id } = useParams();
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();
    const api = useAxios();
    const targetRef = useRef();
    const { ref, entry } = useIntersection({
        root: targetRef.current,
        threshold: 0.1,
    });
    const isInViewport = entry?.isIntersecting;
    
    const eventsMutation = useMutation({
        mutationFn: (variables)=> eventsFunc(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['events', 'infinite']);
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
        queryKey:['events', 'infinite'],
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
                lookup?`/user/api/community/${community_id}/event_events/?search_query=${search}&page=${pageParam}`:
                `/user/api/community/${community_id}/event_events/?page=${pageParam}`,
                config
            );
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
        eventsMutation.mutate(type);
    };
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <CommunityHeader community_id={community_id} />
            <h3 className="text-xl font-semibold mb-4">Events</h3>

            {/* Search Bar */}
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
                                <div className="bg-white border p-4 border-slate-200">
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
            
        </div>
    )
}

export default EventList