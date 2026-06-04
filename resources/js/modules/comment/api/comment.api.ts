import { index } from '@/actions/App/Http/Controllers/CommentController';
import apiClient from '@/core/api/client';
import { fetcherPaginated } from '@/core/api/fetcher';
import { PaginatedResponse } from '@/core/types/api';
import { Comment } from '@/modules/comment/types/index';
import { transformFullResponse } from '@/modules/comment/utils/transform';

export const getComments = async (
    postId: number,
    cursor?: string,
): Promise<PaginatedResponse<Comment>> => {
    return fetcherPaginated(
        apiClient.get(index.url({ post: postId }), {
            params: {
                cursor,
            },
        }),
        transformFullResponse,
    );
};

