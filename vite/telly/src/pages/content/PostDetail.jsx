import React from "react";
import { useQuery } from '@tanstack/react-query';
import { useParams } from "react-router-dom";
import { CommentSection, useAxios, Reactions, ShareButton } from "../../components";
import { ImageTag, VideoTag } from "../../features";




const PostDetail = () => {
    const { post_id } = useParams();
    const api = useAxios();
    const fetchInterval = 1000*60*10;

    const postQuery = useQuery({
        queryKey: ['post', post_id],
        queryFn: ()=> getPost(),
        refetchInterval: fetchInterval,
    });

    


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

    

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
                {/* Post Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-700">Post Details</h1>
                    
                </div>

                {/* Post Content */}
                <div className="mb-6">
                    {postQuery.data?.content && <p className="text-gray-700 text-lg mb-4">{postQuery.data?.content}</p>}

                    {/* Post Files */}
                    {postQuery.data?.media && postQuery.data?.media.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                            {Array.from(postQuery.data?.media).map((file, index) => (
                                <div
                                    key={file?.id}
                                    className="border border-gray-300 rounded-lg p-2"
                                >
                                    {file?.mime_type?.startsWith("image") ? (
                                        <ImageTag src={file?.media_file} last={true} blurred={file?.blur} alt={`Attachment ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                                    ) : file?.mime_type?.startsWith("video") ? (
                                        <VideoTag src={file?.media_file} last={true} blurred={file?.blur}/>
                                    ):(
                                        <div className="text-gray-700 text-sm truncate">{file?.name}</div>
                                    )}
                                </div>
                            ))}
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
        </div>
    );
};

export default PostDetail;
