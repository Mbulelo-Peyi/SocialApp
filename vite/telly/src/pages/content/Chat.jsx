import React, { useState, useContext, useRef, useEffect } from "react";
import useWebSocket from "../../utils/useWebSocket";
import { AuthContext, useAxios } from "../../components/index";
import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useParams } from "react-router-dom";

const Chat = () => {
    const { room_id } = useParams();
    const { user } = useContext(AuthContext);
    const { messages, sendMessage, isConnected } = useWebSocket(room_id, user?.id);
    const [message, setMessage] = useState("");
    const api = useAxios();
    const queryClient = useQueryClient();
    const chatBoxRef = useRef(null);

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessage(""); // Clear input field after sending
            return message;
        }
    };
    
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['chat', room_id, 'infinite'],
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

    const roomQuery = useQuery({
        queryKey: ['room', room_id],
        queryFn: ()=> getChatRoom(),
    });

    const sendMessageMutation = useMutation({
        mutationFn: ()=> handleSendMessage(),
        onSuccess: ()=> {
        }
    });
    
    const getData = async ({ pageParam = 1 }) => {
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        try {
            const response = await api.get(
                `/user/api/chat/${room_id}/?page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const getChatRoom = async() =>{
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        try {
            const response = await api.get(
                `/user/api/chatrooms/${room_id}/`,
                config
            )
        } catch (error) {
            
        }
    };
    
    useEffect(() => {
        // Scroll to the bottom when a new message is received
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
        queryClient.invalidateQueries(['chat', room_id, 'infinite'])
    }, [messages]);
    
    const handleScroll = (e) => {
        // If the user scrolls to the top, fetch more messages
        if (e.target.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const chats = data?.pages.flatMap(page => page?.results);

    return (
        <div className="mx-auto mt-7 p-8 border border-gray-300 rounded-lg font-sans">
            <h2>{roomQuery.data?.name}</h2>
            <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>
            <div 
            ref={chatBoxRef}
            onScroll={handleScroll}
            className="h-80 overflow-y-auto space-y-4 mb-4"
            >
                {chats?.length === 0 ? (
                    <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
                ) : (
                    chats?.map((message) => (
                        <div key={message.id} className={`flex space-x-4 ${user?.id === message?.sender?.id ? "flex-row-reverse content-center justify-start":"items-end"}`}>
                            {/* User Avatar */}
                            <img
                                // src={message.sender.avatar}
                                src={
                                    message?.sender?.profile_pic?.length>0?
                                    message?.sender?.profile_pic?.filter((pic)=>pic.is_active)[0]?.picture:
                                    message?.sender?.image
                                }
                                alt={`${message?.sender?.username}'s avatar`}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex flex-col bg-gray-100 p-3 rounded-lg shadow-sm space-y-2">
                                {/* Message Text */}
                                {message?.content && <p className="text-gray-800">{message?.content}</p>}



                                {/* Timestamp */}
                                <p className="text-sm text-gray-500">
                                    Sent at: {message?.timesince}
                                </p>

                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="flex mt-4">
                <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded"
                />
                <button 
                disabled={sendMessageMutation.isPending} 
                onClick={()=>sendMessageMutation.mutate()} 
                className="ml-2 p-2 bg-blue-500 text-white rounded disabled:bg-blue-300">
                Send
                </button>
            </div>
        </div>
    )
}

export default Chat
