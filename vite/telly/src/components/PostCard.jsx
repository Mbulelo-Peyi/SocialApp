const reactionsList = ["👍", "❤️", "😂", "😮", "😢", "👏"];
import React, { useState } from 'react';
import { VideoTag, ImageTag, PostComment } from '../features/index';
import { Reactions, ShareButton } from './index';

const PostCard = ({ post }) => {
    

    

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            {/* Post Text */}
            {post?.content && <p className="text-gray-700 mb-4">{post?.content}</p>}

            {/* Post Files */}
            {post?.media && post?.media?.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {Array.from(post?.media?.slice(0, 4)).map((file, index) => (
                        <div key={file?.id} className="border border-gray-300 rounded-lg p-2">
                            {index === 3 ?(
                                <React.Fragment>
                                    {file?.mime_type?.startsWith("image") ? (
                                        <ImageTag src={file?.media_file} last={true} blurred={file?.blur} alt={`Attachment ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                                    ) : file?.mime_type?.startsWith("video") ? (
                                        <VideoTag src={file?.media_file} last={true} blurred={file?.blur}/>
                                    ):(
                                        <div className="text-gray-700 text-sm truncate">{file?.name}</div>
                                    )}
                                </React.Fragment>
                            ):(
                                <React.Fragment>
                                    {file?.mime_type?.startsWith("image") ? (
                                        <ImageTag src={file?.media_file} blurred={file?.blur} alt={`Attachment ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                                    ) : file?.mime_type?.startsWith("video") ? (
                                        <VideoTag src={file?.media_file} blurred={file?.blur}/>
                                    ):(
                                        <div className="text-gray-700 text-sm truncate">{file?.media_file}</div>
                                    )}
                                </React.Fragment>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <div className="flex">
                <div className="bg-white md:p-4 rounded-lg shadow-lg w-full">
                    {/* Post Actions */}
                    <div className="flex justify-between items-center space-x-4 mt-4">
                        <Reactions postQuery={post} />
                        <PostComment post={post} />
                        <ShareButton postQuery={post} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
