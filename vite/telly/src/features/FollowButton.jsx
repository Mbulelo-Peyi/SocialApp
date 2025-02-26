import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from './index';

const FollowButton = ({ type, id }) => {
    const queryClient = useQueryClient();
    const api = useAxios();
    const unfollowMutation = useMutation({
        mutationFn: (variables)=> unfollow(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['followers', 'infinite']);
        },
    });
    const unfollow = async (id) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/user/api/profile/${id}/follow/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    return (
        <React.Fragment>
            {type==="followers" ? (
                <span className="px-4 py-2 bg-blue-300 text-white rounded-lg">
                    Following
                </span>
            ):(
                <button
                value={id}
                disabled={unfollowMutation.isPending}
                onClick={()=>unfollowMutation.mutate(id)} // Handle follow/unfollow logic
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 ${unfollowMutation.isPending?"animate-bounce":"animate-none"}`}
                >
                    Unfollow
                </button>
            )}
        </React.Fragment>
    )
}

export default FollowButton