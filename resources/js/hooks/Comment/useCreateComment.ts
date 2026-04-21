import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { store } from '@/actions/App/Http/Controllers/CommentController';
import { commentKeys } from '@/hooks/Comment/queryKeys';
import { postKeys } from '@/hooks/Post/queryKeys';
import { isRateLimitError, parseRateLimitError } from '@/lib/validation';
import { toast } from 'react-hot-toast'; // Assuming you have toast notifications

interface CreateCommentInput {
    postId: number;
    body: string;
}

export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ postId, body }: CreateCommentInput) => {
            await axios.post(
                store.url({ post: postId }),
                { body },
                {
                    headers: { Accept: 'application/json' },
                },
            );
        },
        onSuccess: async (_data, { postId }) => {
            queryClient.setQueryData(
                postKeys.detail(postId),
                (currentPost: any) => {
                    if (!currentPost) {
                        return currentPost;
                    }

                    return {
                        ...currentPost,
                        comments_count: (currentPost.comments_count ?? 0) + 1,
                    };
                },
            );

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: commentKeys.byPost(postId),
                }),
                queryClient.invalidateQueries({ queryKey: ['feed'] }),
                queryClient.invalidateQueries({ queryKey: ['posts'] }),
            ]);
        },
        onError: (error: any) => {
            if (isRateLimitError(error)) {
                const rateLimitInfo = parseRateLimitError(error);
                toast.error(rateLimitInfo.message);
            } else {
                toast.error('Failed to add comment. Please try again.');
            }
        },
    });
};
