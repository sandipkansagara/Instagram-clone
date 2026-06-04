import { Post, PostApi } from '@/modules/post/types';

export type FeedItemApi = {
    id: number;
    post: PostApi;
    create_at: string;
    user_id: number;
};

export type FeedItem = {
    id: number;
    post: Post;
    createAt: string;
    userId: number;
}


