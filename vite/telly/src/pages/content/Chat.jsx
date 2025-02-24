import React from 'react';
import ChatBox from '../../components/ChatBox';

const Chat = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-blue-500 text-white py-4 shadow-md">
                <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Chat</h1>
                    <button
                        className="bg-white text-blue-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
                        onClick={() => alert('Settings or additional features coming soon!')}
                    >
                        Settings
                    </button>
                </div>
            </header>

            {/* Chat Box */}
            <main className="flex-grow max-w-4xl mx-auto px-4 py-6">
                <ChatBox />
            </main>

            {/* Footer */}
            <footer className="bg-blue-500 text-white py-4">
                <div className="max-w-4xl mx-auto px-4 text-center text-sm">
                    Built with ❤️ for seamless communication.
                </div>
            </footer>
        </div>
    );
};

export default Chat;
