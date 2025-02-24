import React, { useContext, useState } from 'react';
import { useAxios, AuthContext } from './index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClipboardPen } from 'lucide-react';

const CommentOptions = ({ comment }) => {
    const { user } = useContext(AuthContext);
    const [edit, setEdit] = useState(false);
    const [commentText, setCommentText] = useState(comment?.content);
    const api = useAxios();
    const queryClient = useQueryClient();

    const commentUpdateMutation = useMutation({
        mutationFn: (variables)=> updateComment(variables),
        onSuccess : ()=> {
            setEdit(prev=>!prev)
            queryClient.invalidateQueries(['comments', comment?.post?.id, 'infinite']);
        },
    });

    const commentDeleteMutation = useMutation({
        mutationFn: ()=> deleteComment(),
        onSuccess : ()=> {
            setEdit(prev=>!prev)
            queryClient.removeQueries(['comment-likes', comment?.id]);
            queryClient.removeQueries(['comment-dislikes', comment?.id]);
            queryClient.removeQueries(['comment-replys', comment?.id, 'infinite']);
            queryClient.removeQueries(['comments', comment?.post?.id, 'infinite']);
        },
    });

    // update a comment to the post
    const handleCommentUpdate = (e) => {
        e.preventDefault();
        if (commentText.trim() === "") return;
        const formData = new FormData();
        formData.append("post", comment?.post?.id);
        formData.append("user", user?.id);
        formData.append("content", commentText);
        commentUpdateMutation.mutate(formData);
    };

    const updateComment = async (formData) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.put(
                `/content/api/comment/${comment?.id}/`,
                formData,
                config
            )
            return response.data;
        } catch (error) {
            console.error(error)
            return error;
        }
    };

    const deleteComment = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.delete(
                `/content/api/comment/${comment?.id}/`,
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
            {user?.id === comment?.user?.id ? (
                <div className="flex justify-between items-center">
                    {edit ? (
                        <form onSubmit={handleCommentUpdate} className="mt-2">
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div>
                                <button
                                disabled={commentUpdateMutation.isPending}
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                >
                                    Comment Update
                                </button>
                                <button
                                disabled={commentDeleteMutation.isPending}
                                type="button"
                                onClick={()=>commentDeleteMutation.mutate()}
                                className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    Delete Comment
                                </button>
                            </div>
                        </form>
                    ):(
                        <p>{comment?.content}</p>
                    )}
                    <ClipboardPen size={16} onClick={()=>setEdit(prev=>!prev)} />
                </div>
            ):(
                <p>{comment?.content}</p>
            )}
        </React.Fragment>
    )
}

export default CommentOptions