import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from "./index";
import { Share } from 'lucide-react';

const ShareButton = ({ postQuery }) => {
    const api = useAxios();
    const queryClient = useQueryClient();
    const fetchInterval = 1000*60*10;

    const shareCountQuery = useQuery({
        queryKey: ['share-count', postQuery?.id],
        queryFn: ()=> getShareCount(),
        refetchInterval: fetchInterval,
    });

    const shareMutation = useMutation({
        mutationFn: (variables)=> handleShare(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['share-count', postQuery?.id]);
        },
    })

    // check to see for theres a share count
    const getShareCount = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response =  await api.get(
                `/content/api/posts/${postQuery?.id}/share_count/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    // Handle shares
    const handleShare = async() => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                `/content/api/posts/${postQuery?.id}/share_post/`,
                config
            )
            return response.data;
        } catch (error) {
            
        }
    };

    return (
        <div className="flex space-x-2">
            <button
            disabled={shareMutation.isPending}
            className="bg-gray-200 px-4 rounded-lg hover:bg-gray-300 transition"
            onClick={() => shareMutation.mutate()}
            >
                <Share />
            </button>
            <div className="mt-2 flex space-x-2">
                <span
                    className="bg-gray-100 px-2 py-1 rounded-full text-sm"
                >
                    {shareCountQuery.data?.share_count}
                </span>
            </div>
        </div>
    )
}

export default ShareButton