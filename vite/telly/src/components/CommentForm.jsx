import React, { useState } from 'react';
import { useAxios } from './index';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CommentForm = ({ post }) => {
    const [commentText, setCommentText] = useState("");
    const api = useAxios();
    const queryClient = useQueryClient();
    const commentMutation = useMutation({
        mutationFn: (variables)=> postComment(variables),
        onSuccess : ()=> {
            setCommentText("");
            queryClient.invalidateQueries(['comments', post?.id, 'infinite']);
        },
    });

    // Add a comment to the post
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim() === "") return;
        const formData = new FormData();
        formData.append("post_id", post?.id);
        formData.append("content", commentText);
        commentMutation.mutate(formData);
    };

    const postComment = async (formData) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/content/api/comment/`,
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
        <form onSubmit={handleCommentSubmit} className="mt-4">
            <textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
            ></textarea>
            <button
            disabled={commentMutation.isPending}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
                Add Comment
            </button>
        </form>
    )
}

export default CommentForm