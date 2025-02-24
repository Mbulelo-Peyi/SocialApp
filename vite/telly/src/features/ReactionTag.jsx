import React from 'react'

const ReactionTag = () => {
    const [showReactions, setShowReactions] = useState(false);
    const [reaction, setReaction] = useState(null);
    const api = useAxios();
    const queryClient = useQueryClient();
    const fetchInterval = 1000*60*10;
    return (
        <button className="text-blue-500 hover:text-blue-700">
            👍 100 Like
        </button>
    )
}

export default ReactionTag