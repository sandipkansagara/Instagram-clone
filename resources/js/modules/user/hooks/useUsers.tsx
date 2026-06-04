import { index } from '@/actions/App/Http/Controllers/UserController';
import { ApiPaginatedResponse, PaginatedResponse } from '@/core/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User, UserApi } from '@/modules/user/types';
import { transformFullResponse } from '@/modules/user/utils/Transform';

export const useUsers = (initialUsers: ApiPaginatedResponse<UserApi>) => {
    const transformedUsers: PaginatedResponse<User> = transformFullResponse(initialUsers);

    return useInfiniteQuery({
        queryKey: ['users'],
        queryFn: async ({ pageParam = null }) => {
            const res = await axios.get(index.url(), {
                params: { cursor: pageParam },
                headers: { Accept: 'application/json' },
            });
            return res.data;
        },
        getNextPageParam: (lastPage) => lastPage.next_cursor,
        select: (data) => ({
            ...data,
            flattened: data.pages.flatMap((page) => page.data),
        }),
        initialPageParam: undefined,
        //set the initial data to an empty array
        initialData: {
            pages: [transformedUsers],
            pageParams: [undefined],
        },
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });
};

export default useUsers;
