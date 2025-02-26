import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from './index';

const FriendShipButton = ({ type, id }) => {
    const queryClient = useQueryClient();
    const api = useAxios();
    const acceptMutation = useMutation({
        mutationFn: (variables)=> acceptRequest(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['friends', 'infinite']);
        },
    });
    const rejectMutation = useMutation({
        mutationFn: (variables)=> rejectRequest(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['friends', 'infinite']);
        },
    });
    const cancelMutation = useMutation({
        mutationFn: (variables)=> cancelRequest(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['friends', 'infinite']);
        },
    });
    const acceptRequest = async (id) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/user/api/profile/${id}/accept_friend_request/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const rejectRequest = async (id) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/user/api/profile/${id}/reject_friend_request/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const cancelRequest = async (id) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/user/api/profile/${id}/send_friend_request/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    return (
        <React.Fragment>
            {type==="sent_friend_requests" ? (
                <button
                value={id}
                aria-label='cancel'
                disabled={cancelMutation.isPending}
                onClick={()=>cancelMutation.mutate(id)} 
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 ${cancelMutation.isPending?"animate-bounce":"animate-none"}`}
                >
                    Pending
                </button>
            ):type==="friend_requests" ?(
                <div className="flex justify-center items-center space-x-1">
                    <button
                    value={id}
                    disabled={acceptMutation.isPending}
                    onClick={()=>acceptMutation.mutate(id)} 
                    className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 ${acceptMutation.isPending?"animate-bounce":"animate-none"}`}
                    >
                        Accept
                    </button>
                    <button
                    value={id}
                    disabled={rejectMutation.isPending}
                    onClick={()=>rejectMutation.mutate(id)} 
                    className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 ${rejectMutation.isPending?"animate-bounce":"animate-none"}`}
                    >
                        Reject
                    </button>
                </div>
            ):(
                <></>
            )}
        </React.Fragment>
    ) 
}

export default FriendShipButton