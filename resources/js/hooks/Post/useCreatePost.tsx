import { useMutation, useQueryClient } from '@tanstack/react-query';
import { store } from '@/actions/App/Http/Controllers/PostController';
import axios from 'axios';
import { isRateLimitError, parseRateLimitError } from '@/lib/validation';
import toast from 'react-hot-toast';

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => {
            return axios.post(store.url(), formData);
        },
        onMutate: async (formData) => {
            queryClient.cancelQueries({ queryKey: ['posts'] });
            const previousPosts = queryClient.getQueryData(['posts']);

            const tempId = Date.now();
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
                                        id: tempId, // Temporary ID for the new post
                                        caption: formData.get('caption'),
                                        created_at: new Date().toISOString(),
                                        user: {}, // Add basic user info if available
                                        media: [], // Placeholder for media
                                        likes_count: 0,
                                        comments_count: 0,
                                    },
                                    ...page.data,
                                ],
                            };
                        }
                        return page;
                    }),
                };
            });
            return { previousPosts, tempId };
        },
        onError: (error: any, _variables, context) => {
            queryClient.setQueryData(['posts'], context?.previousPosts);

            if (isRateLimitError(error)) {
                const rateLimitInfo = parseRateLimitError(error);
                toast.error(rateLimitInfo.message);
            } else {
                toast.error('Failed to create post. Please try again.');
            }
        },
        onSuccess(data, variables, context) {
            toast.success('Post created successfully!');

            // Update the cache with the actual post data from the server
            queryClient.setQueryData(['posts'], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: any) => {
                        return {
                            ...page,
                            data: page.data.map((post: any) => {
                                if (post.id === context?.tempId) {
                                    return data.data; // Replace with actual post data from server
                                }
                                return post;
                            }),
                        };
                    }),
                };
            });
        },
    });
};
