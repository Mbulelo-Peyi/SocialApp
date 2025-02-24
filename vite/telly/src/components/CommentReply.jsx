import React from 'react';
import { useInfiniteQuery, } from '@tanstack/react-query';
import { CommentReplyCard, CommentReplyForm, useAxios } from './index';

const CommentReply = ({ comment }) => {
    const api = useAxios();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['comment-replys', comment?.id, 'infinite'],
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
                `/content/api/comment-replys/?comment_id=${comment?.id}&page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const commentReplys = data?.pages.flatMap(page => page?.results);

    return (
        <div className="w-10/12 shadow-md">
            <div>
            {commentReplys?.length > 0 && (
                <ul>
                    {commentReplys?.map((commentReply) => (
                        <CommentReplyCard key={commentReply?.id} commentReply={commentReply} />
                    ))}
                    {(hasNextPage || isFetchingNextPage) && (
                    <div className="flex flex-col items-center justify-center">
                        <div onClick={()=>fetchNextPage()} className="h-1">{isFetchingNextPage?"fetching...":"more"}</div>
                    </div>
                )}
                </ul>
            )}
            </div>
            <CommentReplyForm comment={comment} />
        </div>
    )
}

export default CommentReply