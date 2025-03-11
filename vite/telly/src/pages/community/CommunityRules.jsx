import React, { useEffect, useRef, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Group, } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Modal } from '../../features';
import { CommunityHeader, Rule } from '../../components';

const CommunityRules = () => {
    const { community_id } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const api = useAxios();
    const targetRef = useRef();
    const [open, setOpen] = useState(false);
    const elevatedRoles = ['Moderator','Admin']
    const { ref, entry } = useIntersection({
        root: targetRef.current,
        threshold: 0.1,
    });
    const isInViewport = entry?.isIntersecting;

    const rulesMutation = useMutation({
        mutationFn: (variables)=> addRule(variables),
        onSuccess : (data)=> {
            queryClient.invalidateQueries(['rules', 'infinite']);
            navigate(`/rule/${community_id}/${data?.id}/`);
        },
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey:['community-rules', community_id, 'infinite'],
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

    const roleQuery = useQuery({
        queryKey: ['role', community_id],
        queryFn: ()=> getRole(),
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

    const getData = async ({ pageParam = 1 }) => {
        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        };
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/community_rules/?=${pageParam}`,
                config
            );
            return response.data;
        } catch (error) {
            return error;
        }
    };

    const addRule = async (data)=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.post(
                `/user/api/community/${community_id}/add_community_rule/`,
                data,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };

    useEffect(()=>{
        if (isInViewport) {
            fetchNextPage();
        }
    },[isInViewport, entry])

    const rules = data?.pages.flatMap(page => page?.results);

    const onClose = ()=>{setOpen(prev=>!prev)};

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <CommunityHeader community_id={community_id} />
            <h3 className="text-xl font-semibold mb-4">Rules</h3>
            {!roleQuery.isLoading && elevatedRoles.includes(roleQuery.data?.role) &&(
                <button onClick={onClose}><Group /> Add Rule</button>
            )}

            {/* Rule List */}
            {!isLoading && (
                <React.Fragment>
                    {!isLoading && rules?.length === 0 ? (
                        <p className="text-gray-500">No rules found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {rules?.map((rule) => (
                                <div key={rule?.id} className="bg-white border p-4 border-slate-200">
                                    <div className="flex flex-row space-x-4">
                                        <Link to={`/rule/${rule?.community?.id}/${rule?.id}/`}>
                                            <div className="flex flex-col flex-1 pr-2">
                                                <span className="text-lg font-semibold mb-1">{rule?.text}</span>
                                            </div>
                                        </Link>
                                        
                                    </div>
                                </div>
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
            <Modal open={open} onClose={onClose}>
                <Rule create={rulesMutation} />
            </Modal>
        </div>
    )
}

export default CommunityRules