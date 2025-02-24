import { LucideEye, ChevronsRight } from 'lucide-react';
import React, { useState } from 'react';

const VideoTag = ({ src, blurred, last, altText = "Video not available", className = "", ...props }) => {
    const [blur, setBlur] = useState(blurred);
    return (
        <div className={`relative ${blur ? "overflow-hidden" : ""}`}>
            <video
                className={`w-full h-auto rounded-lg ${blur ? "blur-md" : ""} ${className}`}
                src={src}
                controls={!blur}
                controlsList='nodownload'
                {...props}
            >
                {altText}
            </video>
            {blur && !last && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-lg">
                    Video is blurred
                    <LucideEye onClick={()=>setBlur(prev=>!prev)} className="mx-2" />
                </div>
            )}
            {last && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-lg">
                    view all ....
                    <ChevronsRight className="mx-2" />
                </div>
            )}
        </div>
    );
};

export default VideoTag;
