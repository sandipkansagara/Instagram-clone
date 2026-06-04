import { Comment, CommentApi } from "@/modules/comment/types";
import { User, UserApi } from "@/modules/user/types";

export type MediaApi = {
    id: number;
    path: string;
    type: 'image' | 'video';
    post_id: number;
}

export type Media = {
    id: number;
    path: string;
    type: 'image' | 'video';
    postId: number;
}

export type PostApi = {
    id: number;
    caption: string;
    is_liked: boolean;
    created_at: string;
    updated_at: string;
    user?: UserApi;
    media: MediaApi[] | null;
    likes_count: number;
    comments_count: number;
    comments: CommentApi[] | null;
}

export type Post = {
    id: number;
    caption: string;
    isLiked: boolean;
    createdAt: string;
    updatedAt: string;
    user?: User;
    media: Media[] | null;
    likesCount: number;
    commentsCount: number;
    comments?: Comment[] | null;
}




