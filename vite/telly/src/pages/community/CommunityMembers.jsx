import React, { useEffect, useRef } from 'react';
import { FollowersCard, useAxios, CommunityHeader } from "../../components/index";
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const CommunityMembers = () => {
    const api = useAxios();
    const { community_id } = useParams();
    const targetRef = useRef();
    const { ref, entry } = useIntersection({
        root: targetRef.current,
        threshold: 0.1,
    });
    const isInViewport = entry?.isIntersecting;
    const community = true

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['community-members', community_id, 'infinite'],
        getNextPageParam: (lastPage) => {
            try {
                const nextPage = lastPage?.next ? lastPage?.next.split('page=')[1] : null;
                return nextPage;
            } catch (error) {
                return null;
            };
        },
        queryFn: (pageParam)=> getData(pageParam),

    });

    useEffect(()=>{
        if (isInViewport) {
            fetchNextPage();
        }
    },[isInViewport, entry])

    const getData = async ({ pageParam = 1 }) => {
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/community_members/?page=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const members = data?.pages.flatMap(page => page?.results);

    return (
        <div className="bg-gray-100 min-h-screen">
            <CommunityHeader community_id={community_id} />
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && members?.length === 0 ? (
                        <p className="text-gray-500">No members found.</p>
                    ) : (
                        <ul className="space-y-4 py-5 px-3 bg-slate-200">
                            {members?.map((relation) => (
                                <FollowersCard key={relation?.id} relation={relation} community={community} />
                            ))}
                            {(hasNextPage || isFetchingNextPage) && (
                                <div className="flex flex-col items-center justify-center">
                                    <div ref={ref} className="h-1"></div>
                                </div>
                            )}
                        </ul>
                    )}
                </React.Fragment>
            )}
        </div>
    )
}

export default CommunityMembers