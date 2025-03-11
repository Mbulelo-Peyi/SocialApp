import React, { useContext } from 'react';
import { AuthContext, useAxios } from "./index";
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const ChatCard = ({ chat }) => {
    const { user } = useContext(AuthContext);
    const api = useAxios();

    const lastMsgQuery = useQuery({
        queryKey: ['last-chat', chat?.id],
        queryFn: ()=> getLastMsg(),
    });

    const getLastMsg = async() =>{
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        try {
            const response = await api.get(
                `/user/api/last-chat/${chat?.id}/`,
                config
            )
            return response.data;
        } catch (error) {
            
        }
    };

    return (
        <li className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Link to={`/profile/${chat?.members?.filter((member)=>member?.id !== user?.id)[0]?.id}`}>
                    <img
                        src={
                            chat?.members?.filter((member)=>member?.id !== user?.id)[0]?.profile_pic?.length>0?
                            chat?.members?.filter((member)=>member?.id !== user?.id)[0]?.profile_pic?.filter((pic)=>pic.is_active)[0]?.picture:
                            chat?.members?.filter((member)=>member?.id !== user?.id)[0]?.image
                        }
                        alt={chat?.members?.filter((member)=>member?.id !== user?.id)[0]?.username}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                </Link>
                <Link to={`/chat/${chat?.id}`}>
                    <div>
                        <p className="font-semibold">{chat?.members?.filter((member)=>member?.id !== user?.id)[0]?.username}</p>
                        {!lastMsgQuery.isLoading && lastMsgQuery.data?.sender &&(
                            <React.Fragment>
                                {lastMsgQuery.data?.sender?.id === user?.id ?(
                                    <p className="text-sm text-blue-600">{lastMsgQuery.data?.sender?.username} : {lastMsgQuery.data?.content}</p>
                                ):(
                                    <p className="text-sm text-gray-600">{lastMsgQuery.data?.sender?.username} : {lastMsgQuery.data?.content}</p>
                                )}
                            </React.Fragment>
                        )}
                    </div>
                </Link>
            </div>

        </li>
    )
}

export default ChatCard