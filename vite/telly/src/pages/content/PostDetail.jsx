import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CommentSection, useAxios, Reactions, ShareButton, Slide, PostEdit } from "../../components";
import { useQuery } from '@tanstack/react-query';
import { LucidePen } from 'lucide-react';
import { Modal } from "../../features";




const PostDetail = () => {
    const { post_id } = useParams();
    const api = useAxios();
    const fetchInterval = 1000*60*10;
    const [editing, setEditing] = useState(false);

    const postQuery = useQuery({
        queryKey: ['post', post_id],
        queryFn: ()=> getPost(),
        refetchInterval: fetchInterval,
    });

    const postPermsQuery = useQuery({
        queryKey: ['post-permissions', postQuery.data?.id],
        queryFn: ()=> getPostPerms(),
        refetchInterval: fetchInterval,
    });


    const getPostPerms = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        try {
            const response = await api.get(
                `/content/api/post/${post_id}/get_post_author/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };


    const getPost = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.get(
                `/content/api/posts/${post_id}/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const onClose = ()=>{setEditing(prev=>!prev)};

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
                {/* Post Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-700">Post Details</h1>
                    
                </div>

                {/* Post Content */}
                <div className="mb-6">
                {!postPermsQuery.isLoading && postPermsQuery.data?.status ? (
                    <div className="flex">
                        {postQuery.data?.content && <p className="text-gray-700 mb-4 flex-1">{postQuery.data?.content}</p>}
                        <button onClick={onClose}><LucidePen /> edit</button>
                    </div>
                ):(
                    <React.Fragment>{postQuery.data?.content && <p className="text-gray-700 mb-4">{postQuery.data?.content}</p>}</React.Fragment>
                )}

                    {/* Post Files */}
                    {postQuery.data?.media && postQuery.data?.media.length > 0 && (
                        <div className="flex justify-center items-center">
                            <Slide slides={postQuery.data?.media} />
                        </div>
                    )}
                </div>

                {/* Reactions Section */}
                <div className="flex justify-between items-center sm:p-0">
                    {!postQuery.isLoading && postQuery.data?.id && (
                        <React.Fragment>
                            <Reactions postQuery={postQuery.data} detail={true} />
                            <ShareButton postQuery={postQuery.data} />
                        </React.Fragment>
                    )}
                </div>

                {/* Comments Section */}
                {!postQuery.isLoading && postQuery.data?.id && (
                    <CommentSection post={postQuery.data} />
                )}
                

            </div>
            <Modal open={editing} onClose={onClose}>
                {!postQuery.isLoading &&(
                    <PostEdit post={postQuery.data} onClose={onClose}/>
                )}
            </Modal>
        </div>
    );
};

export default PostDetail;
