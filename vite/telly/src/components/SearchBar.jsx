import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
    const [query, setQuery] = useState('');

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        // Handle the search logic here (e.g., navigate to the search results page)
        console.log('Searching for:', query);
    };

    return (
        <div className="w-full max-w-lg">
            <div className="relative flex items-center md:w-[18rem]">
                {/* Search Icon */}
                {/* <FaSearch className="absolute left-4 text-gray-400" size={18} /> */}
                
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search for posts, users, communities..."
                    value={query}
                    onChange={handleSearchChange}
                    className="w-full  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {/* Search Button (optional, if you'd like a button as well) */}
                <button
                    onClick={handleSearch}
                    className="absolute right-1 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <FaSearch className="text-gray-400" size={18} />
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
