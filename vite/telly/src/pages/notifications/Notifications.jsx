import React,{ useEffect, useContext, useRef } from 'react';
import { AuthContext, useAxios, NotificationList } from './index';
import { useNavigate } from 'react-router-dom';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';



const Notifications = () =>{
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const api = useAxios();
    const queryClient = useQueryClient();
    const targetRef = useRef();
    const { ref, entry } = useIntersection({
        root: targetRef.current,
        threshold: 0.1,
    });
    const isInViewport = entry?.isIntersecting;
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey:['notifications', 'infinite'],
        getNextPageParam: (lastPage) => {
            try {
                const nextPage = lastPage?.next ? lastPage?.next.split('page=')[1] : null;
                return nextPage;
            } catch (error) {
                return null;
            };
        },
        queryFn: (pageParam)=> getNotifications(pageParam),

    });

    const readMutation = useMutation({
        mutationFn: (variables)=> markAsRead(variables),
        onSuccess: ()=> {
            queryClient.invalidateQueries(['notifications', 'infinite']);
        }
    });
    const deleteMutation = useMutation({
        mutationFn: (variables)=> deleteNotification(variables),
        onSuccess: ()=> {
            queryClient.invalidateQueries(['notifications', 'infinite']);
        }
    });


    useEffect(()=>{
        if (!user){
            navigate(`/login`);
        }
        if (isInViewport) {
            fetchNextPage();
        }
    },[isInViewport, entry])



    const getNotifications = async ({ pageParam = 1 }) =>{
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };
        try {
            const response = await api.get(
            `/inbox/notifications/api/notifications/?page=${pageParam}`,
                config
            )
            return response.data;
        } catch (error) {
            console.error("Error:",error)
        }
    };

    const markAsRead = async (id) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };
        try {
            const response = await api.get(
            `/inbox/notifications/api/notifications/${id}/`,
                config
            )
            return response.data;
        } catch (error) {
            console.error("Error:",error)

        }
    };
    const deleteNotification = async (id) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };
        try {
            const response = await api.delete(
            `/inbox/notifications/api/notifications/${id}/`,
                config
            )
            return response.data;
        } catch (error) {
            console.error("Error:",error)

        }
    };
    const _data = data?.pages.flatMap(page => page?.results);

    return (
        <main className="relative top-[105px]">
            <div className="pb-2">
                <NotificationList objects={_data} readMutation={readMutation} deleteMutation={deleteMutation}/>
            </div>
            {(hasNextPage || isFetchingNextPage) && (
                <div className="flex flex-col items-center justify-center">
                    <div ref={ref} className="h-1"></div>
                </div>
            )}
        </main>
    )
};

export default Notifications;