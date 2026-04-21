import { useMutation, useQueryClient } from '@tanstack/react-query';
import { store } from '@/actions/App/Http/Controllers/PostController';
import axios from 'axios';

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => {
            return axios.post(store.url(), formData);
        },
        onMutate: async (formData) => {
            queryClient.cancelQueries({ queryKey: ['posts'] });
            const previousPosts = queryClient.getQueryData(['posts']);

            queryClient.setQueryData(['posts'], (old: any) => {
                //TODO: Optimistic update for images and videos
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: any, index: number) => {
                        if (index === 0) {
                            return {
                                ...page,
                                data: [
                                    {
                                        id: Date.now(), // Temporary ID for the new post
                                        content: formData.get('content'),
                                    },
                                    ...page.data,
                                ],
                            };
                        }
                        return page;
                    }),
                };
            });
            return { previousPosts };
        },
        onError: (_err, _variables, context) => {
            queryClient.setQueryData(['posts'], context?.previousPosts);
        },
        onSuccess(data, variables, onMutateResult, context) {
            //TODO: update the post with the actual data from the server
            console.log('Post created successfully:', data);
        },
    });
};
