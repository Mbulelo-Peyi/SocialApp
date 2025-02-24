import React, { useState, useRef } from 'react';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [file, setFile] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [reaction, setReaction] = useState(false);
    const typingTimeoutRef = useRef(null);

    const currentUser = {
        id: 1,
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/40', // Replace with user-specific avatar URL
    };

    // Handle sending a message
    const handleSend = () => {
        if (input.trim() || file) {
            const newMessage = {
                id: messages.length + 1,
                text: input,
                timestamp: new Date().toLocaleTimeString(),
                reactions: {},
                sender: currentUser,
                file: file ? URL.createObjectURL(file) : null,
            };
            setMessages([...messages, newMessage]);
            setInput('');
            setFile(null);
        }
    };

    // Handle typing indicator
    const handleTyping = (e) => {
        setInput(e.target.value);

        if (!isTyping) {
            setIsTyping(true);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 1000); // Reset typing indicator after 1 second of inactivity
    };

    // Handle editing a message
    const handleEdit = (id) => {
        const messageToEdit = messages.find((msg) => msg.id === id);
        setInput(messageToEdit.text);
        setMessages(messages.filter((msg) => msg.id !== id));
    };

    // Handle deleting a message
    const handleDelete = (id) => {
        setMessages(messages.filter((msg) => msg.id !== id));
    };

    // Handle reactions
    const handleReaction = (id, reaction) => {
        const updatedMessages = messages.map((msg) =>
            msg.id === id
                ? {
                      ...msg,
                      reactions: {
                          ...msg.reactions,
                          [reaction]: (msg.reactions[reaction] || 0) + 1,
                      },
                  }
                : msg
        );
        setMessages(updatedMessages);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            {/* Messages Display */}
            <div className="h-80 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className="flex items-start space-x-4">
                            {/* User Avatar */}
                            <img
                                src={message.sender.avatar}
                                alt={`${message.sender.name}'s avatar`}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex flex-col bg-gray-100 p-3 rounded-lg shadow-sm space-y-2">
                                {/* Message Text */}
                                {message.text && <p className="text-gray-800">{message.text}</p>}

                                {/* File Attachment */}
                                {message.file && (
                                    <a
                                        href={message.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        View Attachment
                                    </a>
                                )}

                                {/* Timestamp */}
                                <p className="text-sm text-gray-500">
                                    Sent at: {message.timestamp}
                                </p>

                                {/* Reactions */}
                                <button onClick={()=>setReaction(prev=>!prev)}>'👍'</button>
                                {reaction && (
                                    <div className="flex space-x-2 text-sm">
                                        {['👍', '❤️', '😂', '😮', '😢', '👎'].map((reaction) => (
                                            <button
                                                key={reaction}
                                                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                                                onClick={() => handleReaction(message.id, reaction)}
                                            >
                                                <span>{reaction}</span>
                                                <span>{message.reactions[reaction] || 0}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex space-x-4 text-sm text-gray-400">
                                    <button
                                        className="hover:text-blue-500"
                                        onClick={() => handleEdit(message.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="hover:text-red-500"
                                        onClick={() => handleDelete(message.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Typing Indicator */}
            {isTyping && <p className="text-gray-500 text-sm mb-2">You are typing...</p>}

            {/* Input Box */}
            <div className="flex items-center space-x-2">
                {/* File Input */}
                <label className="bg-gray-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300">
                    Attach File
                    <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </label>

                {/* Text Input */}
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={input}
                    onChange={handleTyping}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
