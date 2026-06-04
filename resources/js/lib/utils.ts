import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { UserApi, User } from '@/types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function userTransform(user: UserApi): User {

    const Profile = user.profile ? {
        id: user.profile?.id,
        avatar: user.profile?.avatar,
        bio: user.profile?.bio,
        createdAt: user.profile?.created_at,
        updatedAt: user.profile?.updated_at,
        followersCount: user.profile?.followers_count,
        followingCount: user.profile?.following_count,
        postsCount: user.profile?.posts_count,
    } : null;

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerifiedAt: user.email_verified_at,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        profile: Profile as User['profile'],
    };
}
