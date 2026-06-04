import { index } from '@/actions/App/Http/Controllers/UserController';
import apiClient from '@/core/api/client';
import { fetcher } from '@/core/api/fetcher';
import { transformFullResponse } from '@/modules/user/utils/Transform';
import { User } from '@/modules/user/types';
import { PaginatedResponse } from '@/core/types/api';

export const getUsers = async (
    cursor: string | null,
): Promise<PaginatedResponse<User>> => {
    return fetcher(
        apiClient.get(index.url(), {
            params: { cursor },
        }),
        transformFullResponse,
    );
};
