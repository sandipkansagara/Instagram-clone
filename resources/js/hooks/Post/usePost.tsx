import { index } from '@/actions/App/Http/Controllers/PostController';
import { PostsData } from '@/pages/Posts/Index';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';

export const usePost = (posts: PostsData) => {
    const memoizedInitialData = useMemo(
        () => ({
            pages: [posts],
            pageParams: [null],
        }),
        [posts],
    );
    return useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: async ({ pageParam = null }) => {
            const res = await axios.get(index.url(), {
                params: { cursor: pageParam },
                headers: { Accept: 'application/json' },
            });
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            return lastPage?.meta?.next_cursor ?? undefined;
        },
        initialPageParam: null,
        //set the initial data to an empty array
        initialData: memoizedInitialData,
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });
};
