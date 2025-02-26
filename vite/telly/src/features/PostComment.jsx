import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from "./index";
import { Link, useNavigate } from 'react-router-dom';

const PostComment = ({ post }) => {
    const [commentText, setCommentText] = useState("");
    const api = useAxios();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const fetchInterval = 1000*60*10;


    const commentCountQuery = useQuery({
        queryKey: ['comment-count', post?.id],
        queryFn: ()=> getCommentCount(),
        refetchInterval: fetchInterval,
    });

    const commentMutation = useMutation({
        mutationFn: (variables)=> postComment(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['comment', post?.id]);
            queryClient.invalidateQueries(['comment-count', post?.id]);
            navigate(`/post/${post?.id}/`);
        },
    })


    // check to see for theres a comment count
    const getCommentCount = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response =  await api.get(
                `/content/api/posts/${post?.id}/comment_count/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    // Handle comments
    const handleCommentSubmit = async(e) => {
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
            
        }
    };

    return (
        <div className="flex">
            <button className="text-gray-600 hover:text-gray-800">
                <Link to={`/post/${post?.id}/`}><span>💬 {commentCountQuery.data?.comment_count}</span></Link>
            </button>
            <form onSubmit={handleCommentSubmit} className="mt-4 flex items-baseline max-sm:hidden">
                <input
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                ></input>
                <button
                disabled={commentMutation.isPending}
                type="submit"
                className="bg-blue-500 text-white px-2 py-2 my rounded-lg hover:bg-blue-600 transition"
                >
                    Comment
                </button>
            </form>
        </div>
    )
}

export default PostComment;