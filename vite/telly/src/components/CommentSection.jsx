import React, { useEffect, useRef } from 'react';
import { CommentCard, CommentForm, useAxios } from './index';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery, } from '@tanstack/react-query';

const CommentSection = ({ post }) => {
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
        queryKey:['comments', post?.id, 'infinite'],
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
                `/content/api/comments/?post_id=${post?.id}&page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const comments = data?.pages.flatMap(page => page?.results);
    return (
        <div>
            {/* Comments Section */}
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-700 mb-2">Comments</h2>
                {comments?.length > 0 && !isLoading ? (
                    <ul>
                        {comments?.map((comment) => (
                            <CommentCard key={comment?.id} comment={comment} />
                        ))}
                        {(hasNextPage || isFetchingNextPage) && (
                        <div className="flex flex-col items-center justify-center">
                            <div ref={ref} className="h-1"></div>
                        </div>
                    )}
                    </ul>
                ) : (
                    <React.Fragment>
                        {!isLoading ? (
                            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                        ):(
                            <p className="text-gray-500">Loading...</p>
                        )}
                    </React.Fragment>
                )}
            </div>

            {/* Add a Comment */}
            <CommentForm post={post} />
        </div>
    )
}

export default CommentSection