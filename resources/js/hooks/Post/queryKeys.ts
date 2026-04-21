export const postKeys = {
    all: ['post'] as const,
    detail: (postId: number) => [...postKeys.all, postId] as const,
};
