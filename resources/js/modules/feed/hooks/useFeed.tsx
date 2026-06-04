import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiPaginatedResponse, PaginatedResponse } from '@/core/types/api';
import { getFeed } from '@/modules/feed/api/feed.api';
import { feedKeys } from '@/modules/feed/queryKeys';
import { transformFullResponse } from '@/modules/feed/utils/transform';
import type { FeedItem, FeedItemApi } from '../types';

type PageParam = { cursor?: string; max_id?: number } | undefined;


export const useFeed = (feedInitial: ApiPaginatedResponse<FeedItemApi>) => {
    const flattenedFeed = transformFullResponse(feedInitial);
    return useInfiniteQuery<
        PaginatedResponse<FeedItem>,
        Error,
        {
            flattened: FeedItem[];
            pages: PaginatedResponse<FeedItem>[];
            pageParams: PageParam[];
            maxId?: number;
        },
        readonly unknown[],
        PageParam
    >({
        queryKey: feedKeys.all,
        queryFn: async ({
            pageParam,
        }: {
            pageParam: PageParam;
        }) => getFeed(pageParam),
        getNextPageParam: (lastPage) => {
            if (!lastPage.meta.nextCursor && !lastPage.maxId) {
                return undefined;
            }

            return {
                cursor: lastPage.meta.nextCursor ?? undefined,
                //max_id: lastPage.maxId,
            };
        },
        select: (data) => ({
            ...data,
            flattened: data.pages.flatMap((page) => page.data),
        }),
        initialPageParam: undefined as PageParam,
        //set the initial data to an empty array
        initialData: {
            pages: [flattenedFeed],
            pageParams: [
                undefined as PageParam,
            ],
        },
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });
};
