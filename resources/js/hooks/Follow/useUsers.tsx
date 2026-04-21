import { index } from '@/actions/App/Http/Controllers/UserController';
import { UserData } from '@/pages/User/Index';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useUsers = (users: UserData) => {
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
        initialPageParam: 0,
        //set the initial data to an empty array
        initialData: {
            pages: [users],
            pageParams: [0],
        },
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });
};

export default useUsers;
