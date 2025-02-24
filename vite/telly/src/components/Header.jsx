import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import SearchBar from './SearchBar';

const Header = () => {
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
                    {/* <button onClick={() => setSearch((prev) => !prev)}><SearchIcon /></button> */}
                    <SearchBar />
                    <Link
                        to="/profile"
                        className="text-gray-600 hover:text-blue-600 font-semibold"
                    >
                        Profile
                    </Link>
                    <Link
                        to="/community"
                        className="text-gray-600 hover:text-blue-600 font-semibold"
                    >
                        Communities
                    </Link>
                    <Link
                        to="/chat"
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
                        to="/profile"
                        className="block text-gray-600 hover:text-blue-600 font-semibold"
                        onClick={toggleMenu}
                    >
                        Profile
                    </Link>
                    <Link
                        to="/community"
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
