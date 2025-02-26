import { BiSolidChevronLeft,BiSolidChevronRight } from 'react-icons/bi';
import { AiOutlineEye } from 'react-icons/ai';
import React, { useState } from 'react';



const Slide = ({ slides }) =>{
    const [fullScreen, setFullScreen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(false);

    const toggleFullScreenMode = () => {
        if (document.fullscreenElement == null) {
            document.getElementById('slide-container').requestFullscreen()
            setFullScreen((prev)=>!prev)
        } else {
            document.exitFullscreen()
            setFullScreen((prev)=>!prev)
        }
    };

    const prev = () =>{
        setCurrentSlide((currentSlide)=> (currentSlide === 0 ?slides?.length -1: currentSlide - 1))
    };
    const next = () =>{
        setCurrentSlide((currentSlide)=> (currentSlide === slides?.length -1? 0: currentSlide + 1))
    };

    return (
        <div className={`
        ${fullScreen?"flex flex-col justify-center text-center max-w-lg md:max-w-[700px]":"w-52 relative"}
        `}>
            <div className="overflow-hidden relative">
                <div 
                className="flex transition-transform ease-out duration-500"
                style={{transform:`translateX(-${currentSlide * 100}%)`}}
                >
                    {slides?.map((slide)=>(
                        <img 
                        alt="cover"
                        loading="lazy"
                        className={`
                        ${fullScreen?"w-[700px] h-[700px] object-contain rounded-lg":"w-full h-full object-contain rounded-lg"}
                        `}
                        src={slide?.photo} 
                        key={slide?.id}  />
                    ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-between p-4" id="navigation-icons">
                    <button onClick={prev} className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white">
                        <BiSolidChevronLeft size={24} />
                    </button>
                    <button onClick={next} className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white">
                        <BiSolidChevronRight size={24} />
                    </button>
                </div>
                <div className="absolute bottom-4 right-0 left-0" id="position-icons">
                    <div className="flex justify-center items-center gap-2">
                        {slides?.map((slide,index)=>(
                            <div
                            key={slide?.id}
                            className={`
                            transition-all w-3 h-3 bg-white rounded-full
                            ${currentSlide===index?'p-2':'bg-opacity-50'}
                            `}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <button onClick={toggleFullScreenMode} className="p-1 rounded-full cursor-pointer shadow bg-white/80 text-gray-800 hover:bg-white">
                    <AiOutlineEye size={24} />
                </button>
            </div>
        </div>
    )
}

export default Slide;