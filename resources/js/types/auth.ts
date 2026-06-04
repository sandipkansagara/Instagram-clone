export type ProfileApi = {
    id: number;
    user_id: number;
    username: string;
    avatar?: string | null;
    bio: string;
    created_at: string;
    updated_at: string;
    followers_count: number;
    following_count: number;
    posts_count: number;
};

export type Profile = {
    id: number;
    userId: number;
    username: string;
    avatar?: string | null;
    bio: string;
    createdAt: string;
    updatedAt?: string;
    followersCount: number;
    followingCount: number;
    postsCount: number;
};

export type UserApi = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    profile?: ProfileApi;
};

export type User = {
    id: number;
    name: string;
    email: string;
    emailVerifiedAt: string | null;
    twoFactorEnabled?: boolean;
    createdAt: string;
    updatedAt: string;
    profile?: Profile | null;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
