import { fetcher, fetcherPaginated } from '@/core/api/fetcher';
import { Post } from '../types';
import apiClient from '@/core/api/client';
import {
    index,
    show,
    store,
} from '@/actions/App/Http/Controllers/PostController';
import { PaginatedResponse } from '@/core/types/api';
import { transformFullResponse } from '@/modules/post/utils/transform';

export const getPosts = async (
    cursor?: string,
): Promise<PaginatedResponse<Post>> => {
    return fetcherPaginated(
        apiClient.get(index.url(), {
            params: {
                cursor,
            },
        }),
        transformFullResponse,
    );
};

export const getPost = async (id: number): Promise<Post> => {
    return fetcher<Post>(apiClient.get(show.url(id)));
};

export const createPost = async (data: FormData): Promise<Post> => {
    return fetcher<Post>(apiClient.post(store.url(), data));
};
