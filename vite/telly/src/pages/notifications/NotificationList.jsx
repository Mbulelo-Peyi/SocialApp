import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { NotificationCard, Modal } from './index';

const NotificationList = ({ objects, readMutation, deleteMutation }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [notificationId, setNotificationId] = useState(null);
    const Options = ()=>{
        setShowOptions((prev)=>!prev)
      }
    return (
        <React.Fragment>
            {objects?.map((notification)=>(
                <div key={notification?.id} className="flex">
                    <NotificationCard notification={notification}/>
                    <button 
                    className="px-4" 
                    onClick={
                        ()=>{
                            setNotificationId(notification?.id);
                            Options();
                        }
                    }>
                        <MoreVertical size={20} />
                    </button>
                </div>
            ))}
            <Modal isVisible={showOptions} onClose={Options}>
                <div className="flex flex-col items-center justify-center">
                    <button 
                    className="text-pretty text-slate-950 capitalize" 
                    onClick={()=>{
                        readMutation.mutate(notificationId);
                        Options();
                        }}>
                            mark as read
                        </button>
                    <button 
                    className="text-pretty text-slate-950 capitalize"
                    onClick={()=>{
                        deleteMutation.mutate(notificationId);
                        Options();
                        }}>
                            delete
                        </button>
                </div>
            </Modal>
        </React.Fragment>
    )
}

export default NotificationList
