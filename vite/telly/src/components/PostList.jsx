import React, { useEffect, useRef } from 'react';
import { PostCard } from './index';
import { useIntersection } from '@mantine/hooks';

const PostList = ({ posts, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading }) => {
    const targetRef = useRef();
    const { ref, entry } = useIntersection({
        root: targetRef.current,
        threshold: 0.1,
    });
    const isInViewport = entry?.isIntersecting;


    useEffect(()=>{
        if (isInViewport) {
            fetchNextPage();
        }
    },[isInViewport, entry])


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