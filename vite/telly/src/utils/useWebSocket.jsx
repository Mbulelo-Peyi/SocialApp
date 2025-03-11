import { useState, useEffect, useRef } from "react";

const useWebSocket = (roomId, username) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!roomId || !username) return;

        const socketUrl = `ws://127.0.0.1:8000/ws/chat/${roomId}/`;
        const socket = new WebSocket(socketUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket Connected");
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        socket.onclose = (event) => {
            console.log("WebSocket Disconnected", event);
            setIsConnected(false);
            
            // Try reconnecting after a delay if the connection is closed unexpectedly
            if (!event.wasClean) {
                setTimeout(() => {
                    console.log("Attempting to reconnect...");
                    socketRef.current = new WebSocket(socketUrl); // Reconnect WebSocket
                }, 1000); // Delay for 1 second before reconnecting
            }
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [roomId, username]);

    const sendMessage = (message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ message, username }));
        } else {
            console.warn("WebSocket is not open. Message not sent.");
        }
    };

    return { messages, sendMessage, isConnected };
};

export default useWebSocket;
