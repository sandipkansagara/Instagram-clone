import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { index } from '@/actions/App/Http/Controllers/CommentController';
import type { CommentItemData } from '@/components/Comment/types';
import { commentKeys } from '@/hooks/Comment/queryKeys';

const useComment = (postId: number) => {
    return useQuery<CommentItemData[]>({
        queryKey: commentKeys.byPost(postId),
        queryFn: async () => {
            const response = await axios.get(index.url({ post: postId }), {
                headers: { Accept: 'application/json' },
            });

            return response.data;
        },
    });
};

export default useComment;
