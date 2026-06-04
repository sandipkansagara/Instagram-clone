import { useInfiniteQuery } from '@tanstack/react-query';
import type { PaginatedResponse } from '@/core/types/api';
import { commentKeys } from '@/modules/comment/hooks/queryKeys';
import type { Comment} from '@/modules/comment/types';
import { getComments } from '../api/comment.api';

const useReply = (commentId: number) => {
    return useInfiniteQuery<
        PaginatedResponse<Comment>,
        Error,
        {
            flattened: Comment[];
            pages: PaginatedResponse<Comment>[];
            pageParams: (string | undefined)[];
        },
        readonly unknown[],
        string | undefined
    >({
        queryKey: commentKeys.byPost(commentId),
        queryFn: async ({ pageParam = undefined }) =>
            getComments(commentId, pageParam),
        getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
        select: (data) => ({
            ...data,
            flattened: data.pages.flatMap((page) => page.data),
        }),
        initialPageParam: undefined,
    });
};

export default useReply;
