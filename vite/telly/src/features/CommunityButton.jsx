import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from './index';

const CommunityButton = ({ id, community_id }) => {
    const queryClient = useQueryClient();
    const api = useAxios();
    const removeMutation = useMutation({
        mutationFn: (variables)=> removeMember(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['community-members', community_id, 'infinite']);
        },
    });
    const removeMember = async (id) =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/user/api/community/${id}/remove_member/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    return (
        <button
        value={id}
        disabled={removeMutation.isPending}
        onClick={()=>removeMutation.mutate(id)}
        className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 ${removeMutation.isPending?"animate-bounce":"animate-none"}`}
        >
            remove
        </button>
    )
}

export default CommunityButton