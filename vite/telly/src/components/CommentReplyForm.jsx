import React, { useState, useContext } from 'react';
import { useAxios, AuthContext } from './index';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CommentReplyForm = ({ comment }) => {
    const { user } = useContext(AuthContext);
    const [commentReplyText, setCommentReplyText] = useState("");
    const api = useAxios();
    const queryClient = useQueryClient();
    const commentReplyMutation = useMutation({
        mutationFn: (variables)=> postCommentReply(variables),
        onSuccess : ()=> {
            setCommentReplyText("");
            queryClient.invalidateQueries(['comments', comment?.post?.id, 'infinite']);
        },
    });

    // Add a comment-reply to the comment
    const handleCommentReplySubmit = (e) => {
        e.preventDefault();
        if (commentReplyText.trim() === "") return;
        const formData = new FormData();
        formData.append("comment", comment?.id);
        formData.append("user", user?.id);
        formData.append("content", commentReplyText);
        commentReplyMutation.mutate(formData);
    };

    const postCommentReply = async (formData) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/content/api/comment-reply/`,
                formData,
                config
            )
            return response.data;
        } catch (error) {
            console.error(error)
            return error;
        }
    };

    return (
        <form onSubmit={handleCommentReplySubmit} className="mt-2">
            <input
                type="text"
                placeholder="Write a comment..."
                value={commentReplyText}
                onChange={(e) => setCommentReplyText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
            disabled={commentReplyMutation.isPending}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
                Comment Reply
            </button>
        </form>
    )
}

export default CommentReplyForm