import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CommunityHeader, useAxios } from "../../components";

const EventPage = () => {
    const [attending, setAttending] = useState(false);
    const { event_id } = useParams();
    const { community_id } = useParams();
    const api = useAxios();
    const fetchInterval = 1000*60*10;

    const eventQuery = useQuery({
        queryKey: ['event', event_id],
        queryFn: ()=> getEvent(),
        refetchInterval: fetchInterval,
    });

    const getEvent = async ()=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.get(
                ``,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-6">
            <CommunityHeader community_id={community_id} />
            <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">{eventQuery.data?.title}</h1>
                <p className="text-gray-600 mt-2">
                    {eventQuery.data?.description}
                </p>
                <div className="mt-4">
                    <p className="text-lg font-semibold text-gray-800">📅{eventQuery.data?.timesince}</p>
                    <p className="text-lg font-semibold text-gray-800">{eventQuery.data?.venue}</p>
                </div>
                <button
                onClick={() => setAttending(!attending)}
                className={`mt-6 px-6 py-3 text-lg font-semibold rounded-full transition ${
                    attending
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                >
                {attending ? "Cancel RSVP" : "RSVP Now"}
                </button>
                {attending && (
                    <p className="mt-4 text-green-600 font-semibold">✅ You are attending this event!</p>
                )}
            </div>
        </div>
    );
};

export default EventPage;