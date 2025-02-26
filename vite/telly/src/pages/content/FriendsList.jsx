import React, { useState, useRef, useEffect } from 'react';
import { useAxios, FollowersCard } from '../../components/index';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const FriendsList = () => {
    const [type, setType] = useState("my_friends");
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();
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
                `/user/api/profile/${type}/?page=${pageParam}`,
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

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Friends</h3>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search friends..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
            />
            <div className="flex justify-center items-center py-4 w-full space-x-4">
                <button
                onClick={()=>friendsMutation.mutate("my_friends")} 
                className={`w-1/4 text-center ${type==="my_friends"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={friendsMutation.isPending}>
                    <span className={`text-lg font-semibold leading-none ${type==="my_friends"?"text-blue-700":"text-gray-700"}`}>friends</span>
                    <hr className={`w-full h-1 py-1 ${type==="my_friends"?"bg-blue-700":"bg-gray-700 "}`}/>
                </button>
                <button 
                onClick={()=>friendsMutation.mutate("friend_requests")} 
                className={`w-1/4 text-center ${type==="friend_requests"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={friendsMutation.isPending}>
                    <span className={`text-lg font-semibold leading-none ${type==="friend_requests"?"text-blue-700":"text-gray-700 "}`}>requests</span>
                    <hr className={`w-full h-1 py-1 ${type==="friend_requests"?"bg-blue-700":"bg-gray-700 "}`}/>
                </button>
                <button 
                onClick={()=>friendsMutation.mutate("sent_friend_requests")} 
                className={`w-1/4 text-center ${type==="sent_friend_requests"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={friendsMutation.isPending}>
                    <span className={`text-lg font-semibold leading-none ${type==="sent_friend_requests"?"text-blue-700":"text-gray-700 "}`}>pending</span>
                    <hr className={`w-full h-1 py-1 ${type==="sent_friend_requests"?"bg-blue-700":"bg-gray-700 "}`}/>
                </button>
            </div>
            {/* Followers List */}
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && friends?.length === 0 ? (
                        <p className="text-gray-500 text-center">{type==="my_friends"?"No friends found.":"No request found."}</p>
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