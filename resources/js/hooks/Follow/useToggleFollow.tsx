import { MutationVars } from '@/components/User/ProfileCard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const useToggleFollow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, isFollowing }: MutationVars) => {
            if (isFollowing) {
                return axios.delete(`/users/${userId}/follow`);
            }
            return axios.post(`/users/${userId}/follow`);
        },
        onMutate: async ({ userId, isFollowing }) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });
            const previousUsers = queryClient.getQueryData(['users']);
            queryClient.setQueryData(['users'], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        data: page.data.map((user: any) => {
                            if (user.id !== userId) return user;
                            return {
                                ...user,
                                isFollowing: !isFollowing,
                                profile: {
                                    ...user.profile,
                                    followers_count: isFollowing
                                        ? user.profile.followers_count - 1
                                        : user.profile.followers_count + 1,
                                },
                            };
                        }),
                    })),
                };
            });
            return { previousUsers };
        },
        onError: (err, variables, context) => {
            //queryClient.setQueryData(['users'], context?.previousUsers);
            //toast.error('Something went wrong');
        },
        onSettled: () => {
            //queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export default useToggleFollow;
