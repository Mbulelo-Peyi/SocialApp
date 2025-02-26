import React from 'react'

const CommunityCard = () => {
    return (
        <div className="bg-white border p-4 border-slate-200">
            <div className="flex flex-row">
                <div className="flex flex-col flex-1 pr-2">
                    <span className="text-lg mb-1">{}</span>
                    <span className="text-gray-400">{}</span>
                    <span className=" flex flex-row items-center text-gray-400 mt-2">
                        <span>{}</span>
                        <span>{}</span> 
                    </span>
                </div>
                <div>
                    <img
                    style={{borderWidth:1,backgroundColor:'#F3F3F4'}}
                    src={""}
                    alt={""}
                    className="h-28 w-28 bg-gray-300 p-4"
                    />
                </div>
            </div>
        </div>
    )
}

export default CommunityCard