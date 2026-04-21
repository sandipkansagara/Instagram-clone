export interface CommentUser {
    id?: number;
    name: string;
    email?: string;
    avatar?: string | null;
    profile?: {
        avatar?: string | null;
    };
}

export interface CommentItemData {
    id: number;
    body: string;
    created_at: string;
    user: CommentUser;
}
