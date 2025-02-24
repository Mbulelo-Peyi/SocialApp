import React from 'react';
import { CommentReply, CommentOptions, CommentButtons } from './index';

const CommentCard = ({ comment }) => {
    
    return (
        <li
            className="bg-gray-100 p-4 rounded-lg mb-2 text-gray-700 flex flex-col"
        >
            <CommentOptions comment={comment} />
            <CommentButtons comment={comment} />
            <CommentReply comment={comment} />
        </li>
    )
}

export default CommentCard