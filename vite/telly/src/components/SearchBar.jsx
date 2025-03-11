import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate,useSearchParams } from 'react-router-dom';

const SearchBar = () => {
    const [searchParams, setSearchParams] = useSearchParams({
        query:"", 
        filter:"friends", 
    });
    const navigate = useNavigate();
    const query = searchParams.get("query");
    const filter = searchParams.get("filter");

    const handleSearchChange = (e) => {
        setSearchParams((prev)=>{
        prev.set("query", e.target.value);
        return prev;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (filter !== null) {
            navigate(
                `/search_query?query=${query}&filter=${filter}`
            )
        } else if (filter === null) {
            navigate(`/search_query?query=${query}`)
        };
    }

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
                    placeholder="Search for events, users, communities..."
                    value={query}
                    onChange={handleSearchChange}
                    className="w-full  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {/* Search Button (optional, if you'd like a button as well) */}
                <button
                    onClick={handleSubmit}
                    className="absolute right-1 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <FaSearch className="text-gray-400" size={18} />
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
