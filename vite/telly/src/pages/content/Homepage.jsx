import React, { useState } from "react";
import { PostList, PostForm } from "../../components/index";

const Home = () => {
    // State to manage posts


    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold py-6 text-center">Your Feed</h1>

                {/* Post Input Form */}
                <PostForm />

                {/* Display Posts */}
                <PostList />
            </div>
        </div>
    );
};

export default Home;
