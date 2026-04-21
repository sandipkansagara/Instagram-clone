import { index } from '@/actions/App/Http/Controllers/FeedController';
import { Feed } from '@/pages/Feed/Index';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useFeed = (feed: Feed) => {
    return useInfiniteQuery({
        queryKey: ['feed'],
        queryFn: async ({ pageParam = null }) => {
            const res = await axios.get(index.url(), {
                params: { cursor: pageParam },
                headers: { Accept: 'application/json' },
            });
            return res.data;
        },
        getNextPageParam: (lastPage) => lastPage.next_cursor,
        initialPageParam: 0,
        //set the initial data to an empty array
        initialData: {
            pages: [feed],
            pageParams: [0],
        },
        staleTime: 1000 * 60,
    });
};
