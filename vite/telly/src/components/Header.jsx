import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import AuthContext from '../context/AuthContext';

const Header = () => {
    const { user } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [search, setSearch] = useState(false);

    // Toggle mobile menu visibility
    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    return (
        <header className="bg-white shadow-lg">
            <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex-none text-2xl font-bold text-blue-600 hover:text-blue-800">
                    SocialApp
                </Link>
                <nav className="hidden md:flex space-x-6">
                    <SearchBar />
                    <Link
                        to={`/profile/${user?.id}`}
                        className="text-gray-600 hover:text-blue-600 font-semibold"
                    >
                        Profile
                    </Link>
                    <Link
                        to="/communities"
                        className="text-gray-600 hover:text-blue-600 font-semibold"
                    >
                        Communities
                    </Link>
                    <Link
                        to="/chats"
                        className="text-gray-600 hover:text-blue-600 font-semibold"
                    >
                        Chat
                    </Link>
                </nav>
                
                {/* Hamburger Menu Button (Mobile) */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="text-gray-600 hover:text-blue-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg py-4 space-y-4 px-4">
                    <SearchBar />
                    <Link
                        to={`/profile/${user?.id}`}
                        className="block text-gray-600 hover:text-blue-600 font-semibold"
                        onClick={toggleMenu}
                    >
                        Profile
                    </Link>
                    <Link
                        to="/communities"
                        className="block text-gray-600 hover:text-blue-600 font-semibold"
                        onClick={toggleMenu}
                    >
                        Communities
                    </Link>
                    <Link
                        to="/chat"
                        className="block text-gray-600 hover:text-blue-600 font-semibold"
                        onClick={toggleMenu}
                    >
                        Chat
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;
