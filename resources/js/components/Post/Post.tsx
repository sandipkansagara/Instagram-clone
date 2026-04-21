import LikeButton from '@/components/LikeButton';
import { ToggleLikeVars, useToggleLike } from '@/hooks/Like/useToggleLike';
import { QueryKey } from '@tanstack/react-query';
import { Link, router } from '@inertiajs/react';
import CommentList from '../Comment/CommentList';
import posts, { show } from '@/routes/posts';

interface Media {
    id: number;
    type: string;
    url: string;
}

interface PostUser {
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
}

interface Props {
    post: PostCardData;
    user: PostUser;
    queryKey: QueryKey;
    patchQueryData: (old: unknown, vars: ToggleLikeVars) => unknown;
    commentShow?: boolean;
}

const Post = ({ post, user, queryKey, patchQueryData, commentShow = false }: Props) => {
    const profile = user.profile || {};

    const mutation = useToggleLike({
        queryKey,
        patchQueryData,
    });

    const onToggleLike = () => {
        const controller = new AbortController();
        mutation.mutate({
            postId: post.id,
            isLiked: post.isLiked ?? false,
            signal: controller.signal,
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getGridCols = (mediaCount: number) => {
        if (mediaCount === 1) return 'grid-cols-1';
        if (mediaCount === 2) return 'grid-cols-2';
        return 'grid-cols-2';
    };

    return (
        <article
            key={post.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
        >
            {/* Post Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 p-4 dark:border-gray-700">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    {profile.avatar ? (
                        <img
                            src={profile.avatar}
                            alt={user.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-indigo-500 text-sm font-semibold text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <Link
                        href={`/posts/${post.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                    >
                        {user.name}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(post.created_at)}
                    </p>
                </div>
            </div>

            {/* Post Content */}
            <div className="p-4">
                {post.caption && (
                    <p className="mb-4 text-gray-800 dark:text-gray-200">
                        {post.caption}
                    </p>
                )}

                {/* Media Grid */}
                {post.media.length > 0 && (
                    <div
                        className={`grid ${getGridCols(post.media.length)} gap-1`}
                    >
                        {post.media.map((media: Media, index: number) => (
                            <div
                                key={media.id}
                                className={`relative overflow-hidden bg-gray-100 dark:bg-gray-900 ${post.media.length === 3 && index === 0 ? 'col-span-2 row-span-2' : ''} ${post.media.length === 1 ? 'max-h-96' : 'aspect-square'}`}
                            >
                                {media.type.startsWith('image/') ? (
                                    <img
                                        src={media.url}
                                        alt="Post media"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <video
                                        src={media.url}
                                        controls
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center gap-4 border-t border-gray-100 p-4 dark:border-gray-700">
                <LikeButton
                    isLiked={post.isLiked ?? false}
                    likesCount={post.likes_count}
                    isPending={mutation.isPending}
                    onToggle={onToggleLike}
                />

                <Link
                    href={posts.show(post.id)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                    <span className="text-sm font-medium">Comments</span>
                </Link>

                <button className="ml-auto flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    </svg>
                    <span className="text-sm font-medium">Share</span>
                </button>
            </div>
            {
                commentShow && (
                    <CommentList postId={post.id} />
                )
            }
        </article>
    );
};

export default Post;
