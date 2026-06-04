import { useQueryClient } from '@tanstack/react-query';
import {  FeedItem } from '@/modules/feed/types';
import { PaginatedResponse } from '@/core/types/api';
import { Post } from '@/modules/post/types';
import { feedKeys } from '../queryKeys';

type QueryData = {
    pages: PaginatedResponse<FeedItem>[] | undefined;
    pageParams: (string | null)[] | undefined;
};

export const useUpdateLikeLive = () => {
    const queryClient = useQueryClient();

    return (post: Post): void => {
        queryClient.setQueryData<QueryData>(feedKeys.all, (old) => {
            if (!old) return old;
            return {
                ...old,
                pages: old.pages?.map((page: PaginatedResponse<FeedItem>) => ({
                    ...page,
                    data: page.data.map((item: FeedItem) => {
                        if (item.post.id !== post.id) return item;
                        return {
                            ...item,
                            post: {
                                ...item.post,
                                likesCount: post.likesCount,
                            },
                        };
                    }),
                })),
            };
        });
    };
};
