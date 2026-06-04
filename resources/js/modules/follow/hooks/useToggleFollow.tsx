import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import axios from 'axios';
import type { PaginatedResponse } from '@/core/types/api';
import type { MutationVars } from '@/modules/user/components/ProfileCard';
import type { User } from '@/modules/user/types';

interface QueryData {
    pages: PaginatedResponse<User>[];
    pageParams: (string | null)[];
    flattened: User[];
}

const useToggleFollow = () => {
    const queryClient = useQueryClient();

    return useMutation<
        PaginatedResponse<User>,
        AxiosError,
        MutationVars,
        { previousUsers?: QueryData }
    >({
        mutationFn: async ({ userId, isFollowing }: MutationVars) => {
            if (isFollowing) {
                return await axios.delete(`/users/${userId}/follow`);
            }
            return await axios.post(`/users/${userId}/follow`);
        },
        onMutate: async ({ userId, isFollowing }) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });
            const previousUsers = queryClient.getQueryData<QueryData>([
                'users',
            ]);
            queryClient.setQueryData<QueryData>(['users'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: page.data.map((user: User) => {
                            if (user.id !== userId) return user;
                            return {
                                ...user,
                                isFollowing: !isFollowing,
                                profile: user.profile
                                    ? {
                                          ...user.profile,
                                          followersCount: isFollowing
                                              ? user.profile.followersCount - 1
                                              : user.profile.followersCount + 1,
                                      }
                                    : user.profile,
                            };
                        }),
                    })),
                };
            });
            return { previousUsers };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(['users'], context.previousUsers);
            }
        },
    });
};

export default useToggleFollow;
