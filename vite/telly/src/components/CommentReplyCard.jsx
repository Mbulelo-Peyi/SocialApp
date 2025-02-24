import React from 'react';
import { CommentReplyOptions, CommentReplyButtons } from './index';


const CommentReplyCard = ({ commentReply }) => {
    

    return (
        <li
            className="bg-gray-100 p-4 rounded-lg mb-2 text-gray-700 flex flex-col"
        >
            <CommentReplyOptions commentReply={commentReply} />
            <CommentReplyButtons commentReply={commentReply} />
        </li>
    )
}

export default CommentReplyCard