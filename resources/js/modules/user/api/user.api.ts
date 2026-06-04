import { index } from '@/actions/App/Http/Controllers/UserController';
import apiClient from '@/core/api/client';
import { fetcher } from '@/core/api/fetcher';
import type { PaginatedResponse } from '@/core/types/api';
import type { User } from '@/modules/user/types';
import { transformFullResponse } from '@/modules/user/utils/Transform';

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
