import { useQueryClient } from '@tanstack/react-query';

export const useUpdateLike = () => {
    const queryClient = useQueryClient();

    return (post: any) => {
        queryClient.setQueryData(['feed'], (old: any) => {
            if (!old) return old;
            return {
                ...old,
                pages: old.pages.map((page: any) => ({
                    ...page,
                    data: page.data.map((item: any) => {
                        if (item.post.id !== post.id) return item;
                        return {
                            ...item,
                            post: {
                                ...item.post,
                                likes_count: post.likes_count,
                            },
                        };
                    }),
                })),
            };
        });
    };
};
