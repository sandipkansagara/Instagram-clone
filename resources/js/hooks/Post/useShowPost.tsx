import type { PostCardData, PostUser } from '@/components/Post/types';
import { postKeys } from '@/hooks/Post/queryKeys';
import { useQuery } from '@tanstack/react-query';

export interface ShowPostData extends PostCardData {
    user: PostUser;
}

export const useShowPost = (post: ShowPostData) => {
    return useQuery({
        queryKey: postKeys.detail(post.id),
        queryFn: async () => post,
        initialData: post,
        enabled: false,
        staleTime: Infinity,
    });
};
