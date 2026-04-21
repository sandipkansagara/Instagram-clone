export interface Media {
    id: number;
    type: string;
    url: string;
}

export interface PostUser {
    name: string;
    profile?: {
        avatar?: string | null;
    };
}

export interface PostCardData {
    id: number;
    caption?: string | null;
    created_at: string;
    media: Media[];
    likes_count?: number;
    isLiked?: boolean;
    comments_count?: number;
}
