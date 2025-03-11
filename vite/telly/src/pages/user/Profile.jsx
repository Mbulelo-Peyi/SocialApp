import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PostList, PostForm, AuthContext, useAxios, ProfileEdit } from "../../components/index";
import { useQuery, useMutation, useInfiniteQuery, useQueryClient  } from '@tanstack/react-query';
import { Modal } from '../../features';

const Profile = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const { user_id } = useParams();
    const api = useAxios();
    const fetchInterval = 1000*60*10;
    const queryClient = useQueryClient();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
    const [editing, setEditing] = useState(false); // Edit mode state
    const my_account = user?.id === user_id;

    const userQuery = useQuery({
        queryKey: ['user', user_id],
        queryFn: ()=> getUser(),
        refetchInterval: fetchInterval,
    });
    const profilePictureQuery = useQuery({
        queryKey: ['user_profile_picture', user_id],
        queryFn: ()=> getProfilePicture(),
        refetchInterval: fetchInterval,
    });
    const friendshipQuery = useQuery({
        queryKey: ['user-friend', user_id, user?.id],
        queryFn: ()=> getFriendStatus(),
        refetchInterval: fetchInterval,
    });
    const followQuery = useQuery({
        queryKey: ['user-follower', user_id, user?.id],
        queryFn: ()=> getFollowStatus(),
        refetchInterval: fetchInterval,
    });
    const roomQuery = useQuery({
        queryKey: ['user-room', user_id, user?.id],
        queryFn: ()=> getRoom(),
        refetchInterval: fetchInterval,
    });

    const updateMutation = useMutation({
        mutationFn: (variables)=> updateUser(variables),
        onSuccess: (data)=> {
            console.log(data)
            onClose();
            queryClient.invalidateQueries(['user', user_id])
        }
    });

    const friendshipMutation = useMutation({
        mutationFn: (variables)=> befriendUser(variables),
        onSuccess: ()=> {
            queryClient.invalidateQueries(['user', user_id])
        }
    });

    const followMutation = useMutation({
        mutationFn: ()=> followUser(),
        onSuccess: ()=> {
            queryClient.invalidateQueries(['user', user_id])
        }
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['user-post', user_id, 'infinite'],
        getNextPageParam: (lastPage) => {
            try {
                const nextPage = lastPage?.next ? lastPage?.next.split('page=')[1] : null;
                return nextPage;
            } catch (error) {
                return null;
            };
        },
        queryFn: (pageParam)=> getData(pageParam),

    });

    useEffect(()=>{
        queryClient.invalidateQueries(['user', user_id])
        queryClient.invalidateQueries(['user_profile_picture', user_id])
        queryClient.invalidateQueries(['user-post', user_id, 'infinite'])
    },[user_id])

    const getData = async ({ pageParam = 1 }) => {
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        try {
            const response = await api.get(
                `/content/api/post/?author_content_type=profile&author_object_id=${user_id}&page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const posts = data?.pages.flatMap(page => page?.results);

    const getUser = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        try {
            const response = await api.get(
                `/user/api/profile/${user_id}`,
                config
            )
            return response.data;
        } catch (error) {
            console.log("Error getting profile:", error);
        }
    };

    const updateUser = async (data) =>{
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        try {
            const response = await api.put(
                `/user/api/profile/${user_id}/`,
                data,
                config
            )
            return response.data;
        } catch (error) {
            console.log("Error updating profile:", error);
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
                `user/api/profile/${user_id}/current_profile_picture/`,
                config
            )
            return response.data;
        } catch (error) {
            console.log("Error getting profile:", error);
        }
    };

    const getFriendStatus = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.get(
                `/user/api/profile/${user_id}/friendship_status/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const getRoom = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.get(
                `/user/api/profile/${user_id}/chat_room/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const getFollowStatus = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.get(
                `/user/api/profile/${user_id}/follow_status/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const followUser = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.post(
                `/user/api/profile/${user_id}/follow/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const befriendUser = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.post(
                `/user/api/profile/${user_id}/send_friend_request/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    if (userQuery.isLoading) {
        return <div>Loading...</div>;
    }

    const onClose = ()=>{setEditing(prev=>!prev)};

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
                            src={profilePictureQuery.data?.picture_url||userQuery.data?.image}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                        />
                    </div>

                    <div className="flex flex-row items-baseline space-x-2">
                        {/* Follow Button */}
                        {followQuery.data?.status ?(
                            <button 
                            disabled={followMutation.isPending}
                            onClick={()=>followMutation.mutate()}
                            className="bg-red-500 text-white px-6 py-2 rounded-full mt-4 md:mt-0">
                                Unfollow
                            </button>
                        ):(
                            <button 
                            disabled={followMutation.isPending}
                            onClick={()=>followMutation.mutate()}
                            className="bg-blue-500 text-white px-6 py-2 rounded-full mt-4 md:mt-0">
                                Follow
                            </button>
                        )}
                        
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
                                        {friendshipQuery.data?.status && !my_account ?(
                                            <Link to={`/chat/${roomQuery.data?.id}`}>
                                                <li>
                                                    <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                        Message
                                                    </button>
                                                </li>
                                            </Link>
                                        ):(
                                            <li>
                                                <button 
                                                disabled={friendshipMutation.isPending}
                                                onClick={()=>friendshipMutation.mutate()}
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                    Friend Request
                                                </button>
                                            </li>
                                        )}
                                        <Link to={`/friends/${userQuery.data?.id}`}>
                                            <li>
                                                <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                    Friends
                                                </button>
                                            </li>
                                        </Link>
                                        <Link to={`/followers/${userQuery.data?.id}`}>
                                            <li>
                                                <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                    Followers
                                                </button>
                                            </li>
                                        </Link>
                                        {user?.id === userQuery.data?.id &&(
                                            <React.Fragment>
                                                <Link to={`/settings`}>
                                                    <li>
                                                        <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                            Settings
                                                        </button>
                                                    </li>
                                                </Link>
                                                <li onClick={logoutUser}>
                                                    <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                        Log Out
                                                    </button>
                                                </li>
                                            </React.Fragment>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Details */}
                <div className="text-center md:text-left mt-6">
                    <h2 className="text-2xl font-bold">{userQuery.data?.username}</h2>
                    <p className="text-gray-600">@{userQuery.data?.username}</p>
                    <p className="text-gray-700 mt-2">{userQuery.data?.bio}</p>
                    {user?.id === userQuery.data?.id &&(
                        <button
                            onClick={onClose}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* User Posts */}
                <h3 className="text-xl font-semibold py-4 mt-8">User's Posts</h3>
                {/* Post Input Form */}
                {my_account && (
                    <PostForm author_content_type={"profile"} author_object_id={user?.id} />
                )}

                {/* Display Posts */}
                {posts?.length>0 && (
                    <PostList 
                    posts={posts} 
                    fetchNextPage={fetchNextPage} 
                    hasNextPage={hasNextPage} 
                    isFetchingNextPage={isFetchingNextPage} 
                    isLoading={isLoading} 
                    />
                )}
            </div>
            <Modal open={editing} onClose={onClose}>
                <ProfileEdit data={userQuery.data} update={updateMutation} />
            </Modal>
        </div>
    );
};

export default Profile;
