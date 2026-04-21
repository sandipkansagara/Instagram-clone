import { store, destroy } from '@/actions/App/Http/Controllers/LikeController';
import { mutationVars } from '@/pages/Feed/Index';
import { MutationFunctionContext, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useUpdateFeed = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            { postId, isLiked, signal }: mutationVars
        ) => {
            const config = {
                headers: { Accept: 'application/json' },
                signal, // Pass the signal to axios here
            };
            if (isLiked) {
                await axios.delete(destroy.url(postId), config);
            } else {
                await axios.post(store.url(postId), {}, config);
            }
        },
        onMutate: async ({ postId, isLiked }) => {
            await queryClient.cancelQueries({ queryKey: ['feed'] });
            const previousFeed = queryClient.getQueryData(['feed']);

            queryClient.setQueryData(['feed'], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        data: page.data.map((item: any) => {
                            if (item.post.id !== postId) return item;
                            return {
                                ...item,
                                post: {
                                    ...item.post,
                                    likes_count: !isLiked
                                        ? (item.post.likes_count ?? 0) + 1
                                        : (item.post.likes_count ?? 0) - 1,
                                    isLiked: !isLiked,
                                },
                            };
                        }),
                    })),
                };
            });

            return { previousFeed };
        },
        onError: (_err, _variables, context) => {
            queryClient.setQueryData(['feed'], context?.previousFeed);
        },
        onSettled: () => {
            //queryClient.invalidateQueries({ queryKey: ['feed'] });
        },
    });
};
