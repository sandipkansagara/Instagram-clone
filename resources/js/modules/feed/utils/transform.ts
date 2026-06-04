import type { ApiPaginatedResponse, PaginatedResponse } from '@/core/types/api';
import type { FeedItem, FeedItemApi } from '@/modules/feed/types';
import { mapPost } from '@/modules/post/utils/transform';

export const mapFeedItem = (feedItemApi: FeedItemApi): FeedItem => {
    return {
        id: feedItemApi.id,
        post: mapPost(feedItemApi.post),
        createAt: feedItemApi.create_at,
        userId: feedItemApi.user_id,
    };
};

export const transformFullResponse = (
    response: ApiPaginatedResponse<FeedItemApi>,
): PaginatedResponse<FeedItem> => {
    return {
        data: response.data.map(mapFeedItem),
        meta: {
            nextCursor: response.meta.next_cursor,
        },
        message: response.message,
        maxId: response.max_id,
    };
};
