import React from 'react';
import { LucideEye } from 'lucide-react';
const Image = ({ src, blurred, alt, fullScreen, blurEffect }) => {
    return (
        <React.Fragment>
            <img 
            loading="lazy"
            className={`
            ${fullScreen?"w-full h-full object-contain rounded-lg":"w-full h-full object-contain rounded-lg"}${blurred ? "blur-md" : ""}`}
            src={src}
            alt={`cover${alt}`}
            />
            {blurred &&(
                <div className="absolute cursor-pointer inset-0 bg-transparent/5 flex items-center justify-center text-white font-semibold text-lg">
                    Image is blurred
                    <button onClick={blurEffect} className="mx-2"><LucideEye /></button>
                </div>
            )}
        </React.Fragment>
    );
};

export default Image;
