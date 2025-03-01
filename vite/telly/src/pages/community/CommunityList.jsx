import React, { useState, useRef, useEffect } from 'react';
import { useAxios, CommunityCard } from '../../components/index';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LucideBadgeX, Search } from 'lucide-react';

const CommunityList = () => {
    const [type, setType] = useState("communities");
    const [lookup, setLookup] = useState(false);
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
        queryKey:['communities', 'infinite'],
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
        const searchEndpoint = type==="joined"?`/user/api/community/joined_communities/?search_query=${search}&page=${pageParam}`:
        `/user/api/community/?search_query=${search}&page=${pageParam}`;
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        try {
            const response = await api.get(
                lookup?searchEndpoint:
                type==="joined"? `/user/api/community/joined_communities/?page=${pageParam}`:
                `/user/api/community/?page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const communities = data?.pages.flatMap(page => page?.results);

    const communitiesFunc = (value) =>{
        setType(value)
        return communities;
    };

    const handleSearch = (e) =>{
        e.preventDefault();
        if (search.trim() === "") return;
        setLookup(true);
        communitiesMutation.mutate(type);
    };

    const clearSearch = () =>{
        setLookup(false);
        setSearch("");
        communitiesMutation.mutate(type);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Communities</h3>

            {/* Search Bar */}
            {lookup ?(
                <LucideBadgeX onClick={clearSearch} />
            ):(
                <form className="flex justify-center items-center" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search community..."
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                        className="mb-4 p-2 border rounded w-10/12 flex-1"
                    />
                    <button className="bg-blue-2000" type="submit"><Search className="text-blue-600" size={16} /></button>
                </form>
            )}
            {!lookup &&(
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
                        <span className={`text-lg font-semibold leading-none ${type==="joined"?"text-blue-700":"text-gray-700"} `}>joined</span>
                        <hr className={`w-full h-1 py-1 ${type==="joined"?"bg-blue-700":"bg-gray-700 "}`}/>
                    </button>
                </div>
            )}
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