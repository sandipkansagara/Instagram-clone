import { useMutation, useQueryClient } from '@tanstack/react-query';
import { store } from '@/actions/App/Http/Controllers/CommentController';
import axios from 'axios';

export const useCreateComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            formData,
            postId,
        }: {
            formData: FormData;
            postId: number;
        }) => {
            return axios.post(store.url(postId), formData);
        },
        onMutate: async ({ formData, postId }) => {
            queryClient.cancelQueries({ queryKey: ['feed'] });
            const previousFeed = queryClient.getQueryData(['feed']);
            const body = formData.get('body')?.toString() ?? '';

            queryClient.setQueryData(['feed'], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        data: page.data.map((item: any) => {
                            if (item.post.id !== postId) return item;
                            const existingComments = Array.isArray(
                                item.post.comments,
                            )
                                ? item.post.comments
                                : [];

                            return {
                                ...item,
                                post: {
                                    ...item.post,
                                    comments: [
                                        ...existingComments,
                                        {
                                            id: Math.random(),
                                            body,
                                                user: {
                                                    name: 'You',
                                                },
                                            created_at:
                                                new Date().toISOString(),
                                        },
                                    ],
                                },
                            };
                        }),
                    })),
                };
            });
            return { previousFeed };
        },
        onError: (error, variables, context) => {
            queryClient.setQueryData(['feed'], context?.previousFeed);
        },
        onSettled: () => {
            //queryClient.invalidateQueries({ queryKey: ['feed'] });
        },
    });
};
