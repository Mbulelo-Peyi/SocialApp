import React, { useState } from 'react';

const FollowersList = ({ followers }) => {
    const [search, setSearch] = useState('');

    // Filter followers based on search query
    const filteredFollowers = followers.filter(follower =>
        follower.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Followers</h3>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search followers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
            />

            {/* Followers List */}
            {filteredFollowers.length === 0 ? (
                <p className="text-gray-500">No followers found.</p>
            ) : (
                <ul className="space-y-4">
                    {filteredFollowers.map((follower) => (
                        <li key={follower.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={follower.profilePicture || '/path/to/default-avatar.jpg'}
                                    alt={follower.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold">{follower.name}</p>
                                    <p className="text-sm text-gray-600">@{follower.username}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => alert(`Toggled follow status for ${follower.name}`)} // Handle follow/unfollow logic
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
                            >
                                {follower.isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FollowersList;
