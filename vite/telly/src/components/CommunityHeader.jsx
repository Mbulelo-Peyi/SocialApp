import React from 'react';
import { useAxios } from "./index";
import { useQuery } from '@tanstack/react-query';

const CommunityHeader = ({ community_id }) => {
    const api = useAxios();
    const fetchInterval = 1000*60*10;

    const communityQuery = useQuery({
        queryKey: ['community', community_id],
        queryFn: ()=> getCommunity(),
        refetchInterval: fetchInterval,
    });

    const getCommunity = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    return (
        <div className="relative">
            <img
                src={communityQuery.data?.cover_image}
                alt="Community Cover"
                className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-3xl font-bold">{communityQuery.data?.name}</h2>
                <p>{communityQuery.data?.description}</p>
                <p className="mt-2">Members: {communityQuery.data?.members_count}</p>
            </div>
        </div>
    )
}

export default CommunityHeader