import { PaginatedResponse } from "@/core/types/api";
import { FeedItem } from "@/modules/feed/types";
import { Post } from "@/modules/post/types";

type ToggleLikeVars = {
    postId: number;
    isLiked: boolean;
};

const nextLikeState = (
    likesCount: number | undefined,
    isLiked: boolean,
) => ({
    likes_count: isLiked
        ? Math.max((likesCount ?? 0) - 1, 0)
        : (likesCount ?? 0) + 1,
    isLiked: !isLiked,
});

type Old<T> = {
    pages: PaginatedResponse<T>[];
};

export const patchFeedLike = (
    old: Old<FeedItem> | undefined,
    { postId, isLiked }: ToggleLikeVars,
) => {
    if (!old) {
        return old;
    }

    return {
        ...old,
        pages: old.pages.map((page: PaginatedResponse<FeedItem>) => ({
            ...page,
            data: page.data.map((item: FeedItem) => {
                if (item.post.id !== postId) {
                    return item;
                }

                return {
                    ...item,
                    post: {
                        ...item.post,
                        ...nextLikeState(item.post.likesCount, isLiked),
                    },
                };
            }),
        })),
    };
};

export const patchPostsLike = (
    old: Old<Post> | undefined,
    { postId, isLiked }: ToggleLikeVars,
) => {
    if (!old) {
        return old;
    }

    return {
        ...old,
        pages: old.pages.map((page: PaginatedResponse<Post>) => ({
            ...page,
            data: page.data.map((post: Post) => {
                if (post.id !== postId) {
                    return post;
                }

                return {
                    ...post,
                    ...nextLikeState(post.likesCount, isLiked),
                };
            }),
        })),
    };
};

export const patchSinglePostLike = (
    old: Post | null | undefined,
    { postId, isLiked }: ToggleLikeVars,
) => {
    if (!old || old.id !== postId) {
        return old;
    }

    return {
        ...old,
        ...nextLikeState(old.likesCount, isLiked),
    };
};
