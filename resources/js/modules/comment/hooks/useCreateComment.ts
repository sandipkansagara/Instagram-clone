import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { store } from '@/actions/App/Http/Controllers/CommentController';
import { commentKeys } from '@/modules/comment/hooks/queryKeys';
import { postKeys } from '@/modules/post/queryKeys';
import { isRateLimitError, parseRateLimitError } from '@/lib/validation';
import { toast } from 'react-hot-toast';
import { Post } from '@/modules/post/types';

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
                (currentPost: Post | undefined) => {
                    if (!currentPost) {
                        return currentPost;
                    }

                    return {
                        ...currentPost,
                        comments_count: (currentPost.commentsCount ?? 0) + 1,
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
        onError: (error: AxiosError) => {
            if (isRateLimitError(error)) {
                const rateLimitInfo = parseRateLimitError(error);
                toast.error(rateLimitInfo.message);
            } else {
                toast.error('Failed to add comment. Please try again.');
            }
        },
    });
};
