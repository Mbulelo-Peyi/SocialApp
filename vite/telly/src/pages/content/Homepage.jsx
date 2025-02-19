import React, { useState } from "react";
import PostCard from "../../components/PostCard";

const Home = () => {
    // State to manage posts
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState("");
    const [postFiles, setPostFiles] = useState([]);

    // Handle text input change
    const handleTextChange = (e) => {
        setPostText(e.target.value);
    };

    // Handle file input change
    const handleFileChange = (e) => {
        setPostFiles([...e.target.files]);
    };

    // Handle post submission
    const handlePostSubmit = (e) => {
        e.preventDefault();

        if (!postText && postFiles.length === 0) {
            alert("Please enter text or upload files to create a post.");
            return;
        }

        const newPost = {
            id: Date.now(),
            text: postText,
            files: postFiles,
        };

        setPosts([newPost, ...posts]);
        setPostText("");
        setPostFiles([]);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold py-6 text-center">Your Feed</h1>

                {/* Post Input Form */}
                <form onSubmit={handlePostSubmit} className="bg-white shadow-md rounded-lg p-4 mb-6">
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="What's on your mind?"
                        value={postText}
                        onChange={handleTextChange}
                    ></textarea>

                    <div className="mt-4">
                        <label className="block mb-2 text-gray-700 font-medium">
                            Upload files (optional):
                        </label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="block w-full text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4 hover:bg-blue-600 transition"
                    >
                        Post
                    </button>
                </form>

                {/* Display Posts */}
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard
                            key={post.id}
                            // text={post.text}
                            // files={post.files}
                            posts={posts}
                            post={post}
                            setPosts={setPosts}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No posts yet. Be the first to share!</p>
                )}
            </div>
        </div>
    );
};

export default Home;
