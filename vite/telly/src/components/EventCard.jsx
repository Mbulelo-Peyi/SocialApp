import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    return (
        <div key={event?.id} className="bg-white border p-4 border-slate-200">
            <div className="flex flex-row space-x-4">
                <Link to={`/event/${event?.community?.id}/${event?.id}/`}>
                    <div>
                        <img
                        style={{borderWidth:1,backgroundColor:'#F3F3F4'}}
                        src={event?.community?.logo}
                        alt={event?.title}
                        className="h-28 w-28 bg-gray-300 p-2"
                        />
                    </div>
                </Link>
                <div className="flex flex-col flex-1 pr-2">
                    <span className="text-lg font-semibold mb-1">{event?.title}</span>
                    <span className="text-gray-700">{event?.timesince}</span>
                </div>
                
            </div>
        </div>
    )
}

export default EventCard;