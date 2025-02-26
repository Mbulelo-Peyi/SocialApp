import React, { useEffect, useRef } from 'react';
import { PostCard, useAxios } from './index';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

const PostList = () => {
    const fetchInterval = 1000*60*10;
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
        <div>
            {posts?.length && !isLoading > 0 ? (
                <React.Fragment>
                    <React.Fragment>
                        {posts?.map((post)=>(
                            <PostCard
                                key={post?.id}
                                post={post}
                            />
                        ))}
                    </React.Fragment>
                    {(hasNextPage || isFetchingNextPage) && (
                        <div className="flex flex-col items-center justify-center">
                            <div ref={ref} className="h-1"></div>
                        </div>
                    )}
                </React.Fragment>
            ) : (
                <p className="text-gray-500 text-center">No posts yet. Be the first to share!</p>
            )}
        </div>
    )
}

export default PostList;