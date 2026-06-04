import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import axios from 'axios';
import toast from 'react-hot-toast';
import { store } from '@/actions/App/Http/Controllers/PostController';
import type { PaginatedResponse } from '@/core/types/api';
import { isRateLimitError, parseRateLimitError } from '@/lib/validation';
import type { Post } from '@/modules/post/types';
import { postKeys } from '../queryKeys';

export type QueryData = {
        pages: PaginatedResponse<Post>[] | undefined;
        pageParams: (string | null)[] | undefined;

};
interface CreatePostContext {
    previousPosts?: QueryData;
    tempId: number;
}


const createTempPost = (tempId: number, caption: string ): Post => ({
    id: tempId,
    caption,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 0, // Will be replaced on success
    media: [],
    likesCount: 0,
    commentsCount: 0
});

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation<{ data: Post }, AxiosError, FormData, CreatePostContext>(
        {
            mutationFn: (formData: FormData) => {
                return axios.post(store.url(), formData);
            },
            onMutate: async (formData) => {
                queryClient.cancelQueries({ queryKey: postKeys.all });
                const previousPosts = queryClient.getQueryData<QueryData>(postKeys.all);

                const tempId = Date.now();
                const tempPost = createTempPost(
                    tempId,
                    (formData.get('caption') as string),
                );

                queryClient.setQueryData<QueryData>(postKeys.all, (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages?.map((page, index) => {
                            if (index === 0) {
                                return {
                                    ...page,
                                    data: [tempPost, ...page.data],
                                };
                            }
                            return page;
                        }),
                    };
                });
                return { previousPosts, tempId };
            },
            onError: (error: AxiosError, _variables, context) => {
                queryClient.setQueryData(postKeys.all, context?.previousPosts);

                if (isRateLimitError(error)) {
                    const rateLimitInfo = parseRateLimitError(error);
                    toast.error(rateLimitInfo.message);
                } else {
                    toast.error('Failed to create post. Please try again.');
                }
            },
            onSuccess(data, _variables, context) {
                toast.success('Post created successfully!');

                queryClient.setQueryData<QueryData>(postKeys.all, (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages?.map((page) => {
                            return {
                                ...page,
                                data: page.data.map((post) => {
                                    if (post.id === context?.tempId) {
                                        return { ...post, post: data.data };
                                    }
                                    return post;
                                }),
                            };
                        }),
                    };
                });
            },
        },
    );
};
