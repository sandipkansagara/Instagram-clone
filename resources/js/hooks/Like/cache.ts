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

export const patchFeedLike = (old: any, { postId, isLiked }: ToggleLikeVars) => {
    if (!old) {
        return old;
    }

    return {
        ...old,
        pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((item: any) => {
                if (item.post.id !== postId) {
                    return item;
                }

                return {
                    ...item,
                    post: {
                        ...item.post,
                        ...nextLikeState(item.post.likes_count, isLiked),
                    },
                };
            }),
        })),
    };
};

export const patchPostsLike = (old: any, { postId, isLiked }: ToggleLikeVars) => {
    if (!old) {
        return old;
    }

    return {
        ...old,
        pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: any) => {
                if (post.id !== postId) {
                    return post;
                }

                return {
                    ...post,
                    ...nextLikeState(post.likes_count, isLiked),
                };
            }),
        })),
    };
};

export const patchSinglePostLike = (
    old: any,
    { postId, isLiked }: ToggleLikeVars,
) => {
    if (!old || old.id !== postId) {
        return old;
    }

    return {
        ...old,
        ...nextLikeState(old.likes_count, isLiked),
    };
};
