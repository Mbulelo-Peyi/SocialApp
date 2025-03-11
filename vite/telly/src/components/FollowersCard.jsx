import React, { useContext } from 'react';
import { CommunityButton, FollowButton, FriendShipButton, useAxios } from '../features/index';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from './index';
import { Link } from 'react-router-dom';


const FollowersCard = ({ relation, follow, type, community, community_id, user_id }) => {
    const { user } = useContext(AuthContext);
    const api = useAxios();
    const fetchInterval = 1000*60*10;
    const elevatedRoles = ['Moderator','Admin']
    const roleQuery = useQuery({
        queryKey: ['role', community_id],
        queryFn: ()=> community_id?getRole():(null),
        refetchInterval: fetchInterval,
    });

    const getRole = async ()=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/check_role/`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    return (
        <li className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Link to={`/profile/${relation?.id}`}>
                    <img
                        src={
                            relation?.profile_pic?.length>0? 
                            relation?.profile_pic?.filter((pic)=>pic.is_active)[0]?.picture:
                            relation?.image
                        }
                        alt={relation?.username}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                </Link>
                <div>
                    <p className="font-semibold">{relation?.username}</p>
                    <p className="text-sm text-gray-600">@{relation?.username}</p>
                </div>
            </div>
            <React.Fragment>
                {community ? (
                    <React.Fragment>
                        {!roleQuery.isLoading && elevatedRoles.includes(roleQuery.data?.role) &&(
                            <CommunityButton id={relation?.id} community_id={community_id} />
                        )}
                    </React.Fragment>
                ):(
                    <React.Fragment>
                        {user_id && type && (
                            <React.Fragment>
                                {user?.id === user_id && (
                                    <React.Fragment>
                                        {follow ?(
                                            <FollowButton id={relation?.id} type={type} />
                                        ):(
                                            <FriendShipButton id={relation?.id} type={type} />
                                        )}
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </React.Fragment>
        </li>
    )
}

export default FollowersCard