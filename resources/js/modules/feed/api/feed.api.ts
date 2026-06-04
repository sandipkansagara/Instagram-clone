import { fetcher, fetcherPaginated } from "@/core/api/fetcher";
import apiClient from "@/core/api/client";
import { index} from "@/actions/App/Http/Controllers/FeedController";
import { PaginatedResponse } from "@/core/types/api";
import { FeedItem } from "@/modules/feed/types";
import { transformFullResponse } from "@/modules/feed/utils/transform";

export const getFeed = async (pageParam: { cursor?: string; max_id?: number } | undefined): Promise<PaginatedResponse<FeedItem>> => {
    console.log('Fetching feed with params:', pageParam);
    return fetcherPaginated(
        apiClient.get(index.url(), {
            params: {
                cursor: pageParam?.cursor,
                //max_id: pageParam?.max_id,
            },
        }),
        transformFullResponse,
    );
};

