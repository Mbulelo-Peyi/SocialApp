import React from 'react';
import { PostList, PostForm, useAxios, CommunityHeader } from "../../components/index";
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const Community = () => {
    const api = useAxios();
    const { community_id } = useParams();
    const fetchInterval = 1000*60*10;

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
            {/* <div className="relative">
                <img
                    src={communityQuery.data?.cover_image}
                    alt="Community Cover"
                    className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-4 left-4 text-white">
                    <h2 className="text-3xl font-bold">{communityQuery.data?.name}</h2>
                    <p>{communityQuery.data?.description}</p>
                    <p className="mt-2">Members: {communityQuery.data?.members_count}</p>
                </div>
            </div> */}
            <CommunityHeader community_id={community_id} />

            {/* Join Button */}
            <div className="flex justify-center mt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Join Community
                </button>
            </div>

            <div className="flex justify-center items-center py-4 w-full space-x-4">
                <button
                onClick={()=>console.log("my_friends")} 
                className={`w-1/4 text-center`} 
                >
                    <span className={`text-lg font-semibold leading-none`}>members</span>
                    <hr className={`w-full h-1 py-1`}/>
                </button>
                <button 
                onClick={()=>console.log("friend_requests")} 
                className={`w-1/4 text-center`} 
                >
                    <span className={`text-lg font-semibold leading-none`}>rules</span>
                    <hr className={`w-full h-1 py-1`}/>
                </button>
                <button 
                onClick={()=>console.log("sent_friend_requests")} 
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
            {/* New Post Section */}
            {/* <div className="max-w-4xl mx-auto px-4 py-4">
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-4 border border-gray-300 rounded-lg"
                />
                <button
                    onClick={handlePostSubmit}
                    className="bg-green-600 text-white px-4 py-2 mt-4 rounded-lg hover:bg-green-700"
                >
                    Post
                </button>
            </div> */}

            {/* Posts List */}
            {/* <div className="max-w-4xl mx-auto px-4">
                <h3 className="text-xl font-semibold py-2">Community Posts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white p-4 rounded-lg shadow-lg">
                            <h4 className="font-bold text-lg">{post.title}</h4>
                            <p className="text-gray-600 mt-2">{post.content}</p>

                            Post Actions
                            <div className="flex items-center space-x-4 mt-4">
                                <button className="text-blue-500 hover:text-blue-700">
                                    👍 {post.likes} Like
                                </button>
                                <button className="text-gray-600 hover:text-gray-800">
                                    💬 {post.comments} Comments
                                </button>
                                <button className="text-green-500 hover:text-green-700">
                                    🔗 Share
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    );
};

export default Community;
