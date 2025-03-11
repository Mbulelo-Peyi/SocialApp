import React from 'react';
import { PostList, PostForm, useAxios, CommunityHeader } from "../../components/index";
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

const Community = () => {
    const api = useAxios();
    const { community_id } = useParams();
    const fetchInterval = 1000*60*10;
    const navigate = useNavigate();

    const communityQuery = useQuery({
        queryKey: ['community', community_id],
        queryFn: ()=> getCommunity(),
        refetchInterval: fetchInterval,
    });

    const roleQuery = useQuery({
        queryKey: ['community-role', community_id],
        queryFn: ()=> getRole(),
        refetchInterval: fetchInterval,
    });
        
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['community-feed', community_id, 'infinite'],
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
    
    
    const getData = async ({ pageParam = 1 }) => {
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        try {
            const response = await api.get(
                `/content/api/post/?author_content_type=community&author_object_id=${community_id}&page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const getCommunity = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const getRole = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/check_role/`,
                config
            )
            return response.data;
        } catch (error) {
            return error
        }
    };
    
    const posts = data?.pages.flatMap(page => page?.results);


    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Community Header */}
            <CommunityHeader community_id={community_id} />

            {/* Join Button */}
            <div className="flex justify-center mt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Join Community
                </button>
            </div>

            <div className="flex justify-center items-center py-4 w-full space-x-4">
                <button
                onClick={()=>navigate(`/community-members/${community_id}/`)} 
                className={`w-1/4 text-center`} 
                >
                    <span className={`text-lg font-semibold leading-none`}>members</span>
                    <hr className={`w-full h-1 py-1`}/>
                </button>
                <button 
                onClick={()=>navigate(`/rules/${community_id}/`)} 
                className={`w-1/4 text-center`} 
                >
                    <span className={`text-lg font-semibold leading-none`}>rules</span>
                    <hr className={`w-full h-1 py-1`}/>
                </button>
                <button 
                onClick={()=>navigate(`/events/${community_id}/`)} 
                className={`w-1/4 text-center`} 
                >
                    <span className={`text-lg font-semibold leading-none`}>events</span>
                    <hr className={`w-full h-1 py-1`}/>
                </button>
            </div>

            {!roleQuery.isLoading && roleQuery.data?.role==="Moderator" || roleQuery.data?.role==="Admin" &&(
                <PostForm author_content_type={"community"} author_object_id={communityQuery.data?.id} />
            )}
            
            {/* Display Posts */}
            <PostList 
            posts={posts} 
            fetchNextPage={fetchNextPage} 
            hasNextPage={hasNextPage} 
            isFetchingNextPage={isFetchingNextPage} 
            isLoading={isLoading} 
            />

        </div>
    );
};

export default Community;
