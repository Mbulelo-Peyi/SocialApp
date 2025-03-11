import { CircleOff } from 'lucide-react';
import React from 'react';

const PostFiles = ({ file, index, handlePopFile }) => {
    return (
        <React.Fragment>
            <button type="button" onClick={()=>handlePopFile(index)} className="relative -top-2 h-fit w-auto left-8 rounded-full bg-teal-100"><CircleOff /></button>
            {file?.type.startsWith("image/") ? (
                <img
                    src={URL.createObjectURL(file)}
                    alt={`Attachment ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md mx-4"
                />
            ) : file?.type.startsWith("video/") ? (
                <video
                    src={URL.createObjectURL(file)}
                    alt={`Attachment ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md mx-4"
                    controls
                    controlsList='nodownload'
                ></video>
            ) : (
                <div className="text-gray-700 text-sm truncate">
                    {file?.name}
                </div>
            )} 
        </React.Fragment>
    )
}

export default PostFiles