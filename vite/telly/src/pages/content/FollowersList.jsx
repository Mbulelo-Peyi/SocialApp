import React, { useRef, useState, useEffect } from 'react';
import { useAxios, FollowersCard } from '../../components/index';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LucideBadgeX, Search } from 'lucide-react';
import { useParams } from 'react-router-dom';

const FollowersList = () => {
    const [type, setType] = useState("followers");
    const [search, setSearch] = useState('');
    const [lookup, setLookup] = useState(false);
    const { user_id } = useParams();
    const queryClient = useQueryClient();
    const api = useAxios();
    const targetRef = useRef();
    const { ref, entry } = useIntersection({
        root: targetRef.current,
        threshold: 0.1,
    });
    const isInViewport = entry?.isIntersecting;
    const follow = true
    
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['followers', 'infinite'],
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

    
    const followersMutation = useMutation({
        mutationFn: (variables)=> followersFunc(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['followers', 'infinite']);
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
                lookup?`/user/api/followers/?query_params_id=${user_id}&query_params=${type}&search_query=${search}&page=${pageParam}`:
                `/user/api/followers/?query_params_id=${user_id}&query_params=${type}&page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const followers = data?.pages.flatMap(page => page?.results);

    const followersFunc = (value) =>{
        setType(value)
        return followers
    };

    const handleSearch = (e) =>{
        e.preventDefault();
        if (search.trim() === "") return;
        setLookup(true);
        console.log(lookup,search.trim())
        followersMutation.mutate(type);
    };
    const clearSearch = () =>{
        setLookup(false);
        setSearch("");
        followersMutation.mutate("followers");
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Followers</h3>

            {/* Search Bar */}
            <form className="flex justify-center items-baseline" onSubmit={handleSearch}>
                <input
                    type="search"
                    placeholder="Search followers..."
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    className="mb-4 p-2 border rounded w-10/12 flex-1"
                />
                <button className="bg-blue-200 text-center" type="submit"><Search className="text-blue-600" /></button>
            </form>
            {lookup ?(
                <LucideBadgeX onClick={clearSearch} />
            ):(
                <div className="flex justify-center items-center py-4 w-full space-x-0">
                    <button
                    onClick={()=>followersMutation.mutate("followers")} 
                    className={`w-1/2 text-center ${type==="followers"?"bg-blue-200":"bg-gray-300 text-gray-700"}`} 
                    disabled={followersMutation.isPending}>
                        <span className={`text-lg font-semibold leading-none ${type==="followers"?"text-blue-700":"text-gray-700"} `}>followers</span>
                        <hr className={`w-full h-1 py-1 ${type==="followers"?"bg-blue-700":"bg-gray-700 "}`}/>
                    </button>
                    <button 
                    onClick={()=>followersMutation.mutate("following")} 
                    className={`w-1/2 text-center ${type==="following"?"bg-blue-200":"bg-gray-300 text-gray-700 "}`} 
                    disabled={followersMutation.isPending}>
                        <span className={`text-lg font-semibold leading-none ${type==="following"?"text-blue-700":"text-gray-700"} `}>following</span>
                        <hr className={`w-full h-1 py-1 ${type==="following"?"bg-blue-700":"bg-gray-700 "}`}/>
                    </button>
                </div>
            )}
            {/* Followers List */}
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && followers?.length === 0 ? (
                        <p className="text-gray-500">No followers found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {followers?.map((relation) => (
                                <FollowersCard key={relation?.id} relation={relation} follow={follow} type={type} />
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
    );
};

export default FollowersList;
