import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CommunityHeader, Rule, useAxios } from "../../components";
import { LucidePen } from "lucide-react";
import { Modal } from "../../features";

const CommunityRule = () => {
    const [open, setOpen] = useState(false);
    const { rule_id } = useParams();
    const { community_id } = useParams();
    const navigate = useNavigate();
    const api = useAxios();
    const queryClient = useQueryClient();
    const fetchInterval = 1000*60*10;
    const elevatedRoles = ['Moderator','Admin']

    const ruleQuery = useQuery({
        queryKey: ['rule', rule_id],
        queryFn: ()=> getRule(),
        refetchInterval: fetchInterval,
    });
    
    const ruleUpdateMutation = useMutation({
        mutationFn: (variables)=> updateRule(variables),
        onSuccess : ()=> {
            queryClient.invalidateQueries(['rule', rule_id]);
            queryClient.invalidateQueries(['rules', community_id, 'infinite']);
        },
    });
    
    const ruleDeleteMutation = useMutation({
        mutationFn: ()=> deleteRule(),
        onSuccess : ()=> {
            queryClient.removeQueries(['rule', rule_id]);
            queryClient.invalidateQueries(['rules', community_id, 'infinite']);
            navigate(`/rules/${community_id}/`);
        },
    });
    
    const getRule = async ()=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.get(
                `/user/api/community/${community_id}/community_rule/?rule_id=${rule_id}`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    
    const updateRule = async (data)=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.post(
                `/user/api/community/${community_id}/update_community_rule/?rule_id=${rule_id}`,
                data,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    
    const deleteRule = async ()=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await api.post(
                `/user/api/community/${community_id}/delete_community_rule/?rule_id=${rule_id}`,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        }
    };
    
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
    
    const onClose = ()=>{setOpen(prev=>!prev)};

    return (
        <React.Fragment>
            <CommunityHeader community_id={community_id} />
            {!roleQuery.isLoading && elevatedRoles.includes(roleQuery.data?.role) &&(
                <button onClick={onClose}><LucidePen /> Actions</button>
            )}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 px-6">
                <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">{ruleQuery.data?.title}</h1>
                    <p className="text-gray-600 mt-2">
                        {ruleQuery.data?.text}
                    </p>
                </div>
            </div>
            <Modal open={open} onClose={onClose}>
                <Rule data={ruleQuery.data} update={ruleUpdateMutation} remove={ruleDeleteMutation} />
            </Modal>
        </React.Fragment>
    )
}

export default CommunityRule