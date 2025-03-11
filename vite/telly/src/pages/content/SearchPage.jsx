import React, { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAxios } from '../../features';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CommunityCard, FollowersCard, EventCard } from '../../components';



const SearchPage = () =>{
    const api = useAxios();
    const queryClient = useQueryClient();
    const targetRef = useRef();
    const { ref, entry } = useIntersection({
        root: targetRef.current,
        threshold: 0.1,
    });
    const isInViewport = entry?.isIntersecting;
    const [searchParams, setSearchParams] = useSearchParams({
        query:"", 
        filter:"friends", 
    });
    const query = searchParams.get("query");
    const filter = searchParams.get("filter");
    const community = false;

    const handleSelect = (e) =>{
        setSearchParams((prev)=>{
          prev.set("filter",e.target.value);
          return prev;
        });
        filterMutation.mutate();
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['general-search', 'infinite'],
        getNextPageParam: (lastPage) => {
            try {
                const nextPage = lastPage?.next ? lastPage?.next.split('page=')[1] : null;
                return nextPage;
            } catch (error) {
                return null;
            };
        },
        queryFn: (pageParam)=> getSearchResults(pageParam),

    });

    const filterMutation = useMutation({
        mutationFn: ()=> (filter),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['general-search', 'infinite']);
        },
    });


    useEffect(()=>{
        if (isInViewport) {
            fetchNextPage();
        }
    },[isInViewport, entry])

    const getSearchResults = ({ pageParam = 1 }) =>{
        return getQuery(
            filter === "friends" ? `/user/api/profile/?search_query=${query}&page=${pageParam}`:
            filter === "events" ? `/user/api/events/?search_query=${query}&page=${pageParam}`:
            `/user/api/community/?search_query=${query}&page=${pageParam}`
        );
    };

    const getQuery = async (url) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.get(
                url,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };


    const results = data?.pages.flatMap(page => page?.results);
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Friends</h3>
            <div className="flex justify-center items-center py-4 w-full space-x-4">
                <button
                value={"friends"}
                onClick={handleSelect} 
                className={`w-1/4 text-center ${filter==="friends"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={filterMutation.isPending}>
                    <span className={`text-lg font-semibold leading-none ${filter==="friends"?"text-blue-700":"text-gray-700"}`}>friends</span>
                    <hr className={`w-full h-1 py-1 ${filter==="friends"?"bg-blue-700":"bg-gray-700 "}`}/>
                </button>
                <button 
                value={"events"}
                onClick={handleSelect} 
                className={`w-1/4 text-center ${filter==="events"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={filterMutation.isPending}>
                    <span className={`text-lg font-semibold leading-none ${filter==="events"?"text-blue-700":"text-gray-700 "}`}>events</span>
                    <hr className={`w-full h-1 py-1 ${filter==="events"?"bg-blue-700":"bg-gray-700 "}`}/>
                </button>
                <button 
                value={"communities"}
                onClick={handleSelect} 
                className={`w-1/4 text-center ${filter==="communities"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                disabled={filterMutation.isPending}>
                    <span className={`text-lg font-semibold leading-none ${filter==="communities"?"text-blue-700":"text-gray-700 "}`}>communities</span>
                    <hr className={`w-full h-1 py-1 ${filter==="communities"?"bg-blue-700":"bg-gray-700 "}`}/>
                </button>
            </div>
            {/* Search List */}
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && results?.length === 0 ? (
                        <p className="text-gray-500 text-center">No results found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {results?.map((relation) => (
                                <React.Fragment key={relation?.id}>
                                    {filter === "friends" ?(
                                        <FollowersCard relation={relation} community={community}/>
                                    ):filter === "events" ?(
                                        <EventCard event={relation} />
                                    ):(
                                        <CommunityCard community={relation} />
                                    )}
                                </React.Fragment>
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
};

export default SearchPage;