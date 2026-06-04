export const commentKeys = {
    all: ['posts', 'comments'] as const,
    byPost: (postId: number) => ['posts', postId, 'comments'] as const,
};
