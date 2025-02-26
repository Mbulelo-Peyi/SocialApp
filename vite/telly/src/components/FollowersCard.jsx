import React from 'react';
import { FollowButton, FriendShipButton } from '../features/index';


const FollowersCard = ({ relation, follow, type}) => {
    return (
        <li className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <img
                    src={
                        relation?.profile_pic?.length>0? 
                        relation?.profile_pic?.filter((pic)=>pic.is_active)[0]?.picture:
                        relation?.image
                    }
                    alt={relation?.username}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <p className="font-semibold">{relation?.username}</p>
                    <p className="text-sm text-gray-600">@{relation?.username}</p>
                </div>
            </div>
            {follow ?(
                <FollowButton id={relation?.id} type={type} />
            ):(
                <FriendShipButton id={relation?.id} type={type} />
            )}
        </li>
    )
}

export default FollowersCard