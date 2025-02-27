import React from 'react';
import { Link } from 'react-router-dom';

const CommunityCard = ({ community }) => {
    return (
        <div className="bg-white border p-4 border-slate-200">
            <div className="flex flex-row space-x-4">
                <Link to={`/community/${community?.id}/`}>
                    <div>
                        <img
                        style={{borderWidth:1,backgroundColor:'#F3F3F4'}}
                        src={community?.logo}
                        alt={community?.name}
                        className="h-28 w-28 bg-gray-300"
                        />
                    </div>
                </Link>
                <div className="flex flex-col flex-1 pr-2">
                    <span className="text-lg font-semibold mb-1">{community?.name}</span>
                    <span className="text-gray-700">{community?.members_count>1?"Members":"Member"}: {community?.members_count}</span>
                    {!community?.is_private &&(
                        <span className="text-gray-700 mt-2">
                            Join
                        </span>
                    )}
                </div>
                
            </div>
        </div>
    )
}

export default CommunityCard