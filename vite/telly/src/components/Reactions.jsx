import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from "./index";


// const reactionsList = ["👍", "❤️", "😂", "😮", "😢", "👏"];
const reactionsList = [
    {
        icon: "👍",
        name: "like",
    },
    {
        icon: "❤️",
        name: "love",
    },
    {
        icon: "😂",
        name: "haha",
    },
    {
        icon: "😢",
        name: "sad",
    },
    {
        icon: "😮",
        name: "angry",
    }
];

const Reactions = ({ postQuery, detail }) => {
    const [showReactions, setShowReactions] = useState(false);
    const [reaction, setReaction] = useState(null);
    const api = useAxios();
    const queryClient = useQueryClient();
    const fetchInterval = 1000*60*10;


    const reactionQuery = useQuery({
        queryKey: ['reaction', postQuery?.id],
        queryFn: ()=> getReaction(),
        refetchInterval: fetchInterval,
    });

    const reactionCountQuery = useQuery({
        queryKey: ['reaction-count', postQuery?.id],
        queryFn: ()=> getReactionCount(),
        refetchInterval: fetchInterval,
    });

    const reactionMutation = useMutation({
        mutationFn: (variables)=> handleReaction(variables),
        onSuccess : ()=> {
            setShowReactions(prev=>!prev)
            if (detail){
                queryClient.invalidateQueries(['post', postQuery?.id]);
                queryClient.invalidateQueries(['reaction', postQuery?.id]);
            }
            queryClient.invalidateQueries(['reaction-count', postQuery?.id]);
        },
    })

    // check to see for theres a reaction
    const getReaction = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response =  await api.get(
                `/content/api/posts/${postQuery?.id}/check_reaction/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    // check to see for theres a reaction count
    const getReactionCount = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response =  await api.get(
                `/content/api/posts/${postQuery?.id}/reaction_count/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    // Handle reactions
    const handleReaction = async(reaction) => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await api.post(
                reactionQuery.data?.reaction_type === reaction?.name?
                `/content/api/posts/${postQuery?.id}/delete_reaction/`
                :`/content/api/posts/${postQuery?.id}/reaction/`,
                {
                    reaction_type:reaction?.name
                },
                config
            )
            const reactions = reactionsList.filter(obj=> obj.name === response.data?.reaction_type)
            setReaction(reactions?.length>0?reactions[0]:reactionsList[0])
            return response.data;
        } catch (error) {
            
        }
    };

    useEffect(()=>{
        const reactions = reactionsList.filter(obj=> obj.name === reactionQuery.data?.reaction_type)
        setReaction(reactions?.length>0?reactions[0].icon:reactionsList[0].icon)
    },[reactionQuery.data])

    return (
        <div className="">
            <div className="flex space-x-2">
                <button
                    onClick={() => setShowReactions(!showReactions)}
                    className="bg-blue-200 text-white px-4 rounded-lg hover:bg-blue-300 transition"
                >
                    {reaction?.icon ? reaction?.icon : reaction}
                </button>
                {/* Display Reaction Counts */}
                <div className="mt-2 flex space-x-2">
                    <span
                        className="bg-gray-100 px-2 py-1 rounded-full text-sm"
                    >
                        {reactionCountQuery.data?.reaction_count}
                    </span>
                </div>
            </div>
            {showReactions && (
                <div className="flex space-x-2 mt-2">
                    {reactionsList.map((reaction, index) => (
                        <button
                            key={index}
                            disabled={reactionMutation.isPending}
                            onClick={() => reactionMutation.mutate(reaction)}
                            className="text-xl bg-gray-200 rounded-full px-3 py-1 hover:bg-gray-300 transition"
                        >
                            {reaction.icon}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Reactions