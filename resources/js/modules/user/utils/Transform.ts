import { ApiPaginatedResponse, PaginatedResponse } from '@/core/types/api';

import { User, UserApi, Profile, ProfileApi } from '@/modules/user/types';

export const mapUser = (userApi: UserApi): User => {
    return {
        id: userApi.id,
        name: userApi.name,
        isFollowing: userApi.is_following,
        profile: userApi.profile ? mapProfile(userApi.profile) : undefined,
    };
};

export const mapProfile = (profileApi: ProfileApi): Profile => {
    return {
        id: profileApi.id,
        userId: profileApi.user_id,
        username: profileApi.username,
        avatar: profileApi.avatar ? profileApi.avatar : undefined,
        bio: profileApi.bio,
        followingCount: profileApi.following_count,
        followersCount: profileApi.followers_count,
        postsCount: profileApi.posts_count,
        createdAt: profileApi.created_at,
    };
};

export const transformFullResponse = (
    response: ApiPaginatedResponse<UserApi>,
): PaginatedResponse<User> => {
    return {
        data: response.data.map(mapUser),
        meta: {
            nextCursor: response.meta.next_cursor,
        },
        message: response.message,
    };
};
