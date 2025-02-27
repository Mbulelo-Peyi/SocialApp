import React, { useContext } from "react";
import { PostList, PostForm, AuthContext } from "../../components/index";
import { useInfiniteQuery } from '@tanstack/react-query';

const Home = () => {
    const { user } = useContext(AuthContext);
    const api = useAxios();
    
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['feed', 'infinite'],
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
                `/content/api/feed/?page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const posts = data?.pages.flatMap(page => page?.results);


    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold py-6 text-center">Your Feed</h1>

                {/* Post Input Form */}
                <PostForm author_content_type={"profile"} author_object_id={user?.id} />

                {/* Display Posts */}
                <PostList 
                posts={posts} 
                fetchNextPage={fetchNextPage} 
                hasNextPage={hasNextPage} 
                isFetchingNextPage={isFetchingNextPage} 
                isLoading={isLoading} 
                />
            </div>
        </div>
    );
};

export default Home;
