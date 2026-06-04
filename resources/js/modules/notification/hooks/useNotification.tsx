import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { index } from '@/actions/App/Http/Controllers/NotificationController';
import type { ApiPaginatedResponse } from '@/core/types/api';
import { transformFullResponse } from '@/modules/notification/utils/transform';
import type { NotificationApi } from '../types';

export const useNotification = (notificationsInitial: ApiPaginatedResponse<NotificationApi>) => {
    const flattenedNotifications = transformFullResponse(notificationsInitial);
    return useInfiniteQuery({
        queryKey: ['notifications'],
        queryFn: async ({ pageParam = null }) => {
            const res = await axios.get(index.url(), {
                params: { cursor: pageParam },
                headers: { Accept: 'application/json' },
            });
            return res.data;
        },
        getNextPageParam: (lastPage) => lastPage.meta?.nextCursor ?? undefined,
        select: (data) => ({
            ...data,
            flattened: data.pages.flatMap((page) => page.data),
        }),
        initialPageParam: undefined,
        //set the initial data to an empty array
        initialData: {
            pages: [flattenedNotifications],
            pageParams: [undefined],
        },
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });
};
