import React, { useState, useRef, useEffect } from 'react';
import { useAxios, CommunityCard } from '../../components/index';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const CommunityList = () => {
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();
    const api = useAxios();
    const targetRef = useRef();
    const { ref, entry } = useIntersection({
        root: targetRef.current,
        threshold: 0.1,
    });
    const isInViewport = entry?.isIntersecting;

    const communitiesMutation = useMutation({
        mutationFn: (variables)=> communitiesFunc(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['communities', 'infinite']);
        },
    });
    
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
                `/user/api/community/?page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const communities = data?.pages.flatMap(page => page?.results);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Communities</h3>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search community..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
            />
            <div className="flex justify-center items-center py-4 w-full space-x-0">
                <button
                onClick={()=>communitiesMutation.mutate("communities")} 
                className={`w-1/2 text-center ${type==="communities"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={communitiesMutation.isPending}>
                    <span className={`text-lg font-semibold leading-none ${type==="communities"?"text-blue-700":"text-gray-700"} `}>communities</span>
                    <hr className={`w-full h-1 py-1 ${type==="communities"?"bg-blue-700":"bg-gray-700 "}`}/>
                </button>
                <button 
                onClick={()=>communitiesMutation.mutate("joined")} 
                className={`w-1/2 text-center ${type==="joined"?"bg-blue-200":"bg-gray-300 text-gray-700 "}`} 
                disabled={communitiesMutation.isPending}>
                    <span className={`text-lg font-semibold leading-none ${type==="joined"?"text-blue-700":"text-gray-700"} `}>joined Communities</span>
                    <hr className={`w-full h-1 py-1 ${type==="joined"?"bg-blue-700":"bg-gray-700 "}`}/>
                </button>
            </div>
            {/* Communities List */}
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && communities?.length === 0 ? (
                        <p className="text-gray-500">No communities found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {communities?.map((community) => (
                                <CommunityCard key={community?.id} community={community} />
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

export default CommunityList