import { useQuery } from '@tanstack/react-query';
import { postKeys } from '@/modules/post/queryKeys';
import type { Post } from '@/modules/post/types';


export const useShowPost = (post: Post) => {
    return useQuery({
        queryKey: postKeys.detail(post.id),
        queryFn: async () => post,
        initialData: post,
        enabled: false,
        staleTime: Infinity,
    });
};
