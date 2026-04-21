import { index } from '@/actions/App/Http/Controllers/NotificationController';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Notification {
    id: number | string;
    message: string | null;
    url: string | null;
    actor_name: string | null;
    created_at: string;
}

interface NotificationsData {
    data: Notification[];

    meta: {
        next_cursor: string | null;
    };
}

export const useNotification = (notifications: NotificationsData) => {
    return useInfiniteQuery({
        queryKey: ['notifications'],
        queryFn: async ({ pageParam = null }) => {
            const res = await axios.get(index.url(), {
                params: { cursor: pageParam },
                headers: { Accept: 'application/json' },
            });
            return res.data;
        },
        getNextPageParam: (lastPage) =>  lastPage.meta.next_cursor,
        initialPageParam: null,
        //set the initial data to an empty array
        initialData: {
            pages: [notifications],
            pageParams: [null],
        },
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });
};
