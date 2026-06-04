import { follow } from '@/routes';
import posts from '@/routes/posts';
import { UserApi, User } from '@/types';
import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { profile } from 'console';
import { create } from 'domain';
import { twMerge } from 'tailwind-merge';

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
