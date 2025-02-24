import React, { useState } from 'react';
import { LucideEye, ChevronsRight } from 'lucide-react';
const ImageTag = ({ src, blurred, last, alt = "Image not available", className = "", ...props }) => {
    const [blur, setBlur] = useState(blurred);
    return (
        <div className={`relative ${blur ? "overflow-hidden" : ""}`}>
            <img
                className={`w-full h-auto rounded-lg ${blur ? "blur-md" : ""} ${className}`}
                src={src}
                alt={alt}
                {...props}
            />
            {blur && !last && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-lg">
                    Image is blurred
                    <LucideEye onClick={()=>setBlur(prev=>!prev)} className="mx-2" />
                </div>
            )}
            {last && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-lg">
                    more
                    <ChevronsRight className="mx-2" />
                </div>
            )}
        </div>
    );
};

export default ImageTag;
