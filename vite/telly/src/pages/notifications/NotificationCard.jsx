import React from 'react';

const NotificationCard = ({ notification }) => {
    return (
        <React.Fragment>
            <div className="bg-white border p-4 border-slate-200">
                <div className="flex flex-row">
                    <div className={`flex flex-col flex-1 pr-2 ${notification?.unread?"bg-green-400":"bg-blue-100"}`}>
                        <span className={`${notification?.unread?"text-slate-950":"text-gray-400 "}`}>{notification?.verb}</span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default NotificationCard;
