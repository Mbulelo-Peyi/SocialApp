import { BiSolidChevronLeft,BiSolidChevronRight } from 'react-icons/bi';
import { AiOutlineEye } from 'react-icons/ai';
import React, { useState } from 'react';
import { Image, Video } from '../features';



const Slide = ({ slides }) =>{
    const [fullScreen, setFullScreen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(false);
    const [blur, setBlur] = useState(() =>slides.some((slide) => slide.blur)); // Track blur state for each image


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
        <div id="slide-container" className={`
        ${fullScreen?"flex flex-col justify-center text-center max-w-lg md:max-w-[800px]":"w-96"}
        `}>
            <div className="overflow-hidden relative">
                <div 
                className="flex max-w-auto transition-transform ease-out duration-500"
                style={{transform:`translateX(-${currentSlide * 100}%)`}}
                >
                    {slides?.map((slide)=>(
                        <React.Fragment key={slide?.id}>
                            {slide?.mime_type?.startsWith("image") ? (
                                <Image src={slide?.media_file} fullScreen={fullScreen} blurEffect={()=>setBlur(prev=>!prev)} blurred={blur} alt={slide?.id}/>
                            ) : slide?.mime_type?.startsWith("video") ? (
                                <Video src={slide?.media_file} fullScreen={fullScreen} blurEffect={()=>setBlur(prev=>!prev)} blurred={blur} alt={slide?.id}/>
                            ):(
                                <div className="text-gray-700 text-sm truncate">{slide?.name}</div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                {!blur &&(
                    <React.Fragment>
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
                    </React.Fragment>
                )}
            </div>
            {!blur &&(
                <div>
                    <button onClick={toggleFullScreenMode} className="p-1 rounded-full cursor-pointer shadow bg-white/80 text-gray-800 hover:bg-white">
                        <AiOutlineEye size={24} />
                    </button>
                </div>
            )}
        </div>
    )
}

export default Slide;