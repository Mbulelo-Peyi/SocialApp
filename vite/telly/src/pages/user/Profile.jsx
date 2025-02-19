import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
;import { AuthContext, useAxios } from './index';
import { useQuery, useMutation, useQueryClient  } from '@tanstack/react-query';

const Profile = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const api = useAxios();
    const fetchInterval = 1000*60*10;
    const queryClient = useQueryClient();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
    const [editing, setEditing] = useState(false); // Edit mode state

    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: ()=> getUser(),
        refetchInterval: fetchInterval,
    });
    const profilePictureQuery = useQuery({
        queryKey: ['user_profile_picture'],
        queryFn: ()=> getProfilePicture(),
        refetchInterval: fetchInterval,
    });

    const getUser = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        try {
            const response = await api.get(
                `user/api/profile/${user.id}`,
                config
            )
            return response.data;
        } catch (error) {
            console.log("Error getting profile:", error);
        }
    };
    
    const getProfilePicture = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        try {
            const response = await api.get(
                `user/api/profile/${user.id}/current_profile_picture/`,
                config
            )
            return response.data;
        } catch (error) {
            console.log("Error getting profile:", error);
        }
    };

    if (userQuery.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Cover Photo */}
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-500">
                <img
                    src={userQuery.data?.image}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-40 w-full p-4">
                    <h1 className="text-white text-2xl font-bold">{userQuery.data?.username}'s Profile</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-4">
                {/* Profile Section */}
                <div className="flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:space-x-8">
                    {/* Profile Picture */}
                    <div className="relative w-32 h-32">
                        <img
                            src={profilePictureQuery.data?.picture_url}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                        />
                    </div>

                    <div className="flex flex-row">
                        {/* Follow Button */}
                        <button className="bg-blue-500 text-white px-6 py-2 rounded-full mt-4 md:mt-0">
                            Follow
                        </button>

                        {/* Hamburger Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                                className="bg-gray-800 text-white p-2 rounded-md focus:outline-none"
                            >
                                ☰
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                    <ul className="space-y-2">
                                        <li>
                                            <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Gallery
                                            </button>
                                        </li>
                                        <li>
                                            <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Settings
                                            </button>
                                        </li>
                                        <li>
                                            <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Log Out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Details */}
                <div className="text-center md:text-left mt-6">
                    <h2 className="text-2xl font-bold">{user?.username}</h2>
                    <p className="text-gray-600">@{user?.handle}</p>
                    <p className="text-gray-700 mt-2">{user?.bio || 'No bio available.'}</p>
                    <button
                        onClick={() => setEditing(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* User Posts */}
                <h3 className="text-xl font-semibold py-4 mt-8">User's Posts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user?.posts?.map((post, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                        >
                            <h4 className="font-bold text-lg">{post.title}</h4>
                            <p className="text-gray-600 mt-2">{post.content}</p>
                            <button className="text-blue-500 mt-2 hover:underline">
                                Read more
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
