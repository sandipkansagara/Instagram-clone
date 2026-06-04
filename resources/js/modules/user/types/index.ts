export type ProfileApi = {
    id: number;
    user_id: number;
    username: string;
    avatar?: string;
    bio: string;
    following_count: number;
    followers_count: number;
    posts_count: number;
    created_at: string;
}

export type Profile = {
    id: number;
    userId: number;
    username: string;
    avatar?: string;
    bio: string;
    followingCount: number;
    followersCount: number;
    postsCount: number;
    createdAt: string;
}

export type UserApi = {
    id: number;
    name: string;
    is_following: boolean;
    profile?: ProfileApi;
};

export type User = {
    id: number;
    name: string;
    isFollowing: boolean;
    profile?: Profile;
};
