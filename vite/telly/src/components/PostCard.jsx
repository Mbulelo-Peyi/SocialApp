const reactionsList = ["👍", "❤️", "😂", "😮", "😢", "👏"];
import { useState } from 'react';
const PostCard = ({ post, setPosts, posts }) => {
    const [commentText, setCommentText] = useState("");
    const [showReactions, setShowReactions] = useState(false);

    // Add a comment to the post
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim() === "") return;

        const updatedPosts = posts.map((p) =>
            p?.id === post?.id
                ? { ...p, comments: [...p.comments, commentText] }
                : p
        );

        setPosts(updatedPosts);
        setCommentText("");
    };

    // Handle reactions
    const handleReaction = (reaction) => {
        const updatedPosts = posts.map((p) => {
            if (p?.id === post?.id) {
                const newReactions = { ...p?.reactions };
                newReactions[reaction] = (newReactions[reaction] || 0) + 1;
                return { ...p, reactions: newReactions };
            }
            return p;
        });

        setPosts(updatedPosts);
        setShowReactions(false);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            {/* Post Text */}
            {post?.text && <p className="text-gray-700 mb-4">{post?.text}</p>}

            {/* Post Files */}
            {post?.files && post?.files?.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {Array.from(post?.files).map((file, index) => (
                        <div key={index} className="border border-gray-300 rounded-lg p-2">
                            {file?.type?.startsWith("image/") ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Attachment ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md"
                                />
                            ) : (
                                <div className="text-gray-700 text-sm truncate">{file?.name}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Reactions */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setShowReactions(!showReactions)}
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                    React
                </button>
                {showReactions && (
                    <div className="absolute flex space-x-2 mt-2 bg-white shadow-lg p-2 rounded-lg">
                        {reactionsList.map((reaction, index) => (
                            <button
                                key={index}
                                onClick={() => handleReaction(reaction)}
                                className="text-xl"
                            >
                                {reaction}
                            </button>
                        ))}
                    </div>
                )}
                <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                    Share
                </button>
            </div>

            {/* Reaction Count */}
            {/* {Object?.keys(post?.reactions).length > 0 && (
                <div className="mt-2">
                    {Object.entries(post?.reactions).map(([reaction, count], index) => (
                        <span
                            key={index}
                            className="mr-2 bg-gray-100 px-2 py-1 rounded-full text-sm"
                        >
                            {reaction} {count}
                        </span>
                    ))}
                </div>
            )} */}

            {/* Comments */}
            <div className="mt-4">
                <h3 className="font-bold text-gray-700 mb-2">Comments</h3>
                {post?.comments?.length > 0 ? (
                    <ul>
                        {post.comments.map((comment, index) => (
                            <li key={index} className="text-gray-700 mb-1">
                                {comment}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No comments yet.</p>
                )}
                <form onSubmit={handleCommentSubmit} className="mt-2">
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Add Comment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostCard;
