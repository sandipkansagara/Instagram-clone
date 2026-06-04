import { User, UserApi } from "@/modules/user/types";

export type CommentApi = {
    id: number;
    parent_id: number | null;
    body: string;
    created_at: string;
    updated_at: string;
    user: UserApi;
    post_id: number;
    replies: CommentApi[] | null;
}

export type Comment = {
    id: number;
    parentId: number | null;
    body: string;
    createdAt: string;
    updatedAt: string;
    user: User;
    postId: number;
    replies: Comment[] | null;
}
