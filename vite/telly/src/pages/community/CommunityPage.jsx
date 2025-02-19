import React, { useState, useEffect } from 'react';

const Community = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [community, setCommunity] = useState({
        name: 'Community Name',
        description: 'Community description goes here...',
        coverPhoto: '/path/to/community-cover.jpg',
        memberCount: 1250,
    });

    // Fetch community posts (simulated here)
    useEffect(() => {
        // Replace with API call
        setPosts([
            { id: 1, title: 'Post 1', content: 'Post content...', likes: 20, comments: 5 },
            { id: 2, title: 'Post 2', content: 'Another post content...', likes: 45, comments: 10 },
            { id: 3, title: 'Post 3', content: 'Content for the third post...', likes: 5, comments: 0 },
        ]);
    }, []);

    const handlePostSubmit = () => {
        if (newPost.trim()) {
            const newPostData = {
                id: Date.now(),
                title: 'New Post',
                content: newPost,
                likes: 0,
                comments: 0,
            };
            setPosts([newPostData, ...posts]);
            setNewPost('');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Community Header */}
            <div className="relative">
                <img
                    src={community?.coverPhoto}
                    alt="Community Cover"
                    className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-4 left-4 text-white">
                    <h2 className="text-3xl font-bold">{community.name}</h2>
                    <p>{community.description}</p>
                    <p className="mt-2">Members: {community.memberCount}</p>
                </div>
            </div>

            {/* Follow Button */}
            <div className="flex justify-center mt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Follow Community
                </button>
            </div>

            {/* New Post Section */}
            <div className="max-w-4xl mx-auto px-4 py-4">
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-4 border border-gray-300 rounded-lg"
                />
                <button
                    onClick={handlePostSubmit}
                    className="bg-green-600 text-white px-4 py-2 mt-4 rounded-lg hover:bg-green-700"
                >
                    Post
                </button>
            </div>

            {/* Posts List */}
            <div className="max-w-4xl mx-auto px-4">
                <h3 className="text-xl font-semibold py-2">Community Posts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white p-4 rounded-lg shadow-lg">
                            <h4 className="font-bold text-lg">{post.title}</h4>
                            <p className="text-gray-600 mt-2">{post.content}</p>

                            {/* Post Actions */}
                            <div className="flex items-center space-x-4 mt-4">
                                <button className="text-blue-500 hover:text-blue-700">
                                    👍 {post.likes} Like
                                </button>
                                <button className="text-gray-600 hover:text-gray-800">
                                    💬 {post.comments} Comments
                                </button>
                                <button className="text-green-500 hover:text-green-700">
                                    🔗 Share
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Community;
