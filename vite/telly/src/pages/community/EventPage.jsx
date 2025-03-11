import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CommunityHeader, EventAdd, useAxios } from "../../components";
import { LucidePen } from "lucide-react";
import { Modal } from "../../features";

const EventPage = () => {
    const [attending, setAttending] = useState(false);
    const [open, setOpen] = useState(false);
    const { event_id } = useParams();
    const { community_id } = useParams();
    const navigate = useNavigate();
    const api = useAxios();
    const queryClient = useQueryClient();
    const fetchInterval = 1000*60*10;
    const elevatedRoles = ['Moderator','Admin']

    const eventQuery = useQuery({
        queryKey: ['event', event_id],
        queryFn: ()=> getEvent(),
        refetchInterval: fetchInterval,
    });

    const eventUpdateMutation = useMutation({
        mutationFn: (variables)=> updateEvent(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['event', event_id]);
            queryClient.invalidateQueries(['events', community_id, 'infinite']);
        },
    });

    const eventDeleteMutation = useMutation({
        mutationFn: ()=> deleteEvent(),
        onSuccess : ()=> {
            queryClient.removeQueries(['event', event_id]);
            queryClient.invalidateQueries(['events', community_id, 'infinite']);
            navigate(`/events/${community_id}/`);
        },
    });

    const getEvent = async ()=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/community_event/?event_id=${event_id}`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const updateEvent = async (data)=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.post(
                `/user/api/community/${community_id}/update_event/?event_id=${event_id}`,
                data,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const deleteEvent = async ()=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.post(
                `/user/api/community/${community_id}/delete_event/?event_id=${event_id}`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const roleQuery = useQuery({
        queryKey: ['role', community_id],
        queryFn: ()=> getRole(),
        refetchInterval: fetchInterval,
    });
    
    const getRole = async ()=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/check_role/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    const onClose = ()=>{setOpen(prev=>!prev)};
    return (
        <React.Fragment>
            <CommunityHeader community_id={community_id} />
            {!roleQuery.isLoading && elevatedRoles.includes(roleQuery.data?.role) &&(
                <button onClick={onClose}><LucidePen /> Actions</button>
            )}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 px-6">
                <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">{eventQuery.data?.title}</h1>
                    <p className="text-gray-600 mt-2">
                        {eventQuery.data?.description}
                    </p>
                    <div className="mt-4">
                        <p className="text-lg font-semibold text-gray-800">📅 {eventQuery.data?.timesince}</p>
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
            <Modal open={open} onClose={onClose}>
                <EventAdd data={eventQuery.data} update={eventUpdateMutation} remove={eventDeleteMutation} />
            </Modal>
        </React.Fragment>
    );
};

export default EventPage;