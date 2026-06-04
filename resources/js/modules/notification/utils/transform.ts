import type { ApiPaginatedResponse, PaginatedResponse } from '@/core/types/api';
import type { Notification, NotificationApi } from '@/modules/notification/types';

export const mapNotification = (
    notificationApi: NotificationApi,
): Notification => {
    return {
        id: notificationApi.id,
        message: notificationApi.message,
        url: notificationApi.url,
        actorName: notificationApi.actor_name,
        createdAt: notificationApi.created_at,
    };
};

export const transformFullResponse = (
    response: ApiPaginatedResponse<NotificationApi>,
): PaginatedResponse<Notification> => {
    return {
        data: response.data.map(mapNotification),
        meta: {
            nextCursor: response.meta.next_cursor,
        },
        message: response.message,
    };
};
