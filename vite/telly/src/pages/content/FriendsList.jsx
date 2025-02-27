import React, { useState, useRef, useEffect } from 'react';
import { useAxios, FollowersCard } from '../../components/index';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LucideBadgeX, Search } from 'lucide-react';
import { useParams } from 'react-router-dom';

const FriendsList = () => {
    const [type, setType] = useState("friends");
    const [search, setSearch] = useState("");
    const [lookup, setLookup] = useState(false);
    const queryClient = useQueryClient();
    const { user_id } = useParams();
    const api = useAxios();
    const targetRef = useRef();
    const { ref, entry } = useIntersection({
        root: targetRef.current,
        threshold: 0.1,
    });
    const isInViewport = entry?.isIntersecting;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['friends', 'infinite'],
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

    const friendsMutation = useMutation({
        mutationFn: (variables)=> friendsFunc(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['friends', 'infinite']);
        },
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
                lookup?`/user/api/friends/?query_params=${type}&query_params_id=${user_id}&page=${pageParam}&search_query=${search}`:
                `/user/api/friends/?query_params=${type}&query_params_id=${user_id}&page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const friends = data?.pages.flatMap(page => page?.results);

    const friendsFunc = (value) =>{
        setType(value);
        return friends;
    };

    const handleSearch = (e) =>{
        e.preventDefault();
        if (search.trim() === "") return;
        setLookup(true);
        friendsMutation.mutate(type);
    };

    const clearSearch = () =>{
        setLookup(false);
        setSearch("");
        friendsMutation.mutate("friends");
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Friends</h3>

            {/* Search Bar */}
            {lookup ?(
                <LucideBadgeX onClick={clearSearch} />
            ):(
                <form className="flex justify-center items-center" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search friends..."
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                        className="mb-4 p-2 border rounded w-10/12 flex-1"
                    />
                    <button className="bg-blue-200 text-center" type="submit"><Search className="text-blue-600" /></button>
                </form>
            )}
            <div className="flex justify-center items-center py-4 w-full space-x-4">
                <button
                onClick={()=>friendsMutation.mutate("friends")} 
                className={`w-1/4 text-center ${type==="friends"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={friendsMutation.isPending}>
                    <span className={`text-lg font-semibold leading-none ${type==="friends"?"text-blue-700":"text-gray-700"}`}>friends</span>
                    <hr className={`w-full h-1 py-1 ${type==="friends"?"bg-blue-700":"bg-gray-700 "}`}/>
                </button>
                <button 
                onClick={()=>friendsMutation.mutate("requests")} 
                className={`w-1/4 text-center ${type==="requests"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={friendsMutation.isPending}>
                    <span className={`text-lg font-semibold leading-none ${type==="requests"?"text-blue-700":"text-gray-700 "}`}>requests</span>
                    <hr className={`w-full h-1 py-1 ${type==="requests"?"bg-blue-700":"bg-gray-700 "}`}/>
                </button>
                <button 
                onClick={()=>friendsMutation.mutate("pending")} 
                className={`w-1/4 text-center ${type==="pending"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={friendsMutation.isPending}>
                    <span className={`text-lg font-semibold leading-none ${type==="pending"?"text-blue-700":"text-gray-700 "}`}>pending</span>
                    <hr className={`w-full h-1 py-1 ${type==="pending"?"bg-blue-700":"bg-gray-700 "}`}/>
                </button>
            </div>
            {/* Friends List */}
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && friends?.length === 0 ? (
                        <p className="text-gray-500 text-center">{type==="friends"?"No friends found.":"No request found."}</p>
                    ) : (
                        <ul className="space-y-4">
                            {friends?.map((relation) => (
                                <FollowersCard key={relation?.id} relation={relation}/>
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

export default FriendsList