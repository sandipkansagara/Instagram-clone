import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiPaginatedResponse, PaginatedResponse } from '@/core/types/api';
import type { Post, PostApi } from '@/modules/post/types';
import { getPosts } from '../api/post.api';
import { transformFullResponse } from '../utils/transform';

export const usePosts = (initialPosts: ApiPaginatedResponse<PostApi>) => {
    const transformedPosts = transformFullResponse(initialPosts);

    return useInfiniteQuery<
        PaginatedResponse<Post>,
        Error,
        {
            flattened: Post[];
            pages: PaginatedResponse<Post>[];
            pageParams: (string | undefined)[];
        },
        readonly unknown[],
        string | undefined
    >({
        queryKey: ['posts'],
        queryFn: ({ pageParam }) => getPosts(pageParam),
        getNextPageParam: (lastPage) => {
            return lastPage?.meta?.nextCursor ?? undefined;
        },
        select: (data) => ({
            ...data,
            flattened: data.pages.flatMap((page) => page.data),
        }),
        initialPageParam: undefined,
        initialData: {
            pages: [transformedPosts],
            pageParams: [undefined],
        },
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });
};
