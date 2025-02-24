import React, { useState, useContext } from 'react';
import { useAxios, AuthContext } from './index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClipboardPen } from 'lucide-react';

const CommentReplyOptions = ({ commentReply }) => {
    const { user } = useContext(AuthContext);
    const [commentReplyText, setCommentReplyText] = useState(commentReply?.content);
    const [edit, setEdit] = useState(false);
    const api = useAxios();
    const queryClient = useQueryClient();

    const commentUpdateReplyMutation = useMutation({
        mutationFn: (variables)=> updateCommentReply(variables),
        onSuccess : ()=> {
            setEdit(prev=>!prev)
            queryClient.invalidateQueries(['comments', commentReply?.comment?.post?.id, 'infinite']);
        },
    });

    const commentReplyDeleteMutation = useMutation({
        mutationFn: ()=> deleteCommentReply(),
        onSuccess : ()=> {
            setEdit(prev=>!prev)
            queryClient.removeQueries(['comment-reply-likes', commentReply?.id]);
            queryClient.removeQueries(['comment-reply-dislikes', commentReply?.id]);
            queryClient.removeQueries(['comments', commentReply?.comment?.post?.id, 'infinite']);
        },
    });


    // Add a comment-reply to the comment
    const handleCommentReplyUpdate = (e) => {
        e.preventDefault();
        if (commentReplyText.trim() === "") return;
        const formData = new FormData();
        formData.append("comment", commentReply?.comment?.id);
        formData.append("user", user?.id);
        formData.append("content", commentReplyText);
        commentUpdateReplyMutation.mutate(formData);
    };

    const updateCommentReply = async (formData) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.put(
                `/content/api/comment-reply/${commentReply?.id}/`,
                formData,
                config
            )
            return response.data;
        } catch (error) {
            console.error(error)
            return error;
        }
    };
    
    const deleteCommentReply = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.delete(
                `/content/api/comment-reply/${commentReply?.id}/`,
                config
            )
            return response.data;
        } catch (error) {
            console.error(error)
            return error;
        }
    };

    return (
        <React.Fragment>
            {user?.id === commentReply?.user?.id ? (
                <div className="flex justify-between items-center">
                    {edit ? (
                        <form onSubmit={handleCommentReplyUpdate} className="mt-2">
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentReplyText}
                                onChange={(e) => setCommentReplyText(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex justify-between items-center">
                                <button
                                disabled={commentUpdateReplyMutation.isPending}
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                >
                                    Reply Update
                                </button>
                                <button
                                disabled={commentReplyDeleteMutation.isPending}
                                type="button"
                                onClick={()=>commentReplyDeleteMutation.mutate()}
                                className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    Delete Reply
                                </button>
                            </div>
                        </form>
                    ):(
                        <p>{commentReply?.content}</p>
                    )}
                    <ClipboardPen size={16} onClick={()=>setEdit(prev=>!prev)} />
                </div>
            ):(
                <p>{commentReply?.content}</p>
            )}
        </React.Fragment>
    )
}

export default CommentReplyOptions