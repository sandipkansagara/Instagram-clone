import { index } from '@/actions/App/Http/Controllers/ReplyController';
import apiClient from '@/core/api/client';
import { fetcherPaginated } from '@/core/api/fetcher';
import type { PaginatedResponse } from '@/core/types/api';
import type { Comment } from '@/modules/comment/types/index';
import { transformFullResponse } from '@/modules/comment/utils/transform';


export const getReplies = async (
    commentId: number,
    cursor?: string,
): Promise<PaginatedResponse<Comment>> => {
    return fetcherPaginated(
        apiClient.get(index.url({ comment: commentId }), {
            params: {
                cursor,
            },
        }),
        transformFullResponse,
    );
};
