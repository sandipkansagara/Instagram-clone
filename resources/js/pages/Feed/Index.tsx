import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';

interface User {
    id?: number;
    name: string;
    avatar_url?: string | null;
}

interface Media {
    id: number;
    type: string;
    url: string;
}

interface Post {
    id: number;
    user: User;
    caption?: string | null;
    media: Media[];
    likes_count?: number;
    liked?: boolean | number;
}

interface FeedItem {
    id: number;
    created_at: string;
    post: Post;
}

interface FeedProps {
    feed: {
        data: FeedItem[];
    };
}

const Index = ({ feed }: FeedProps) => {
    // local optimistic state for immediate UI updates
    const [items, setItems] = useState<FeedItem[]>(() => feed.data);

    const onLike = (postId: number) => {
        setItems((prev) =>
            prev.map((it) => {
                if (it.post.id !== postId) return it;
                const liked = !!it.post.liked;
                const likes_count =
                    (it.post.likes_count ?? 0) + (liked ? -1 : 1);
                return {
                    ...it,
                    post: { ...it.post, liked: !liked, likes_count },
                };
            }),
        );

        router.post(`/posts/${postId}/like`);
    };

    const onUnlike = (postId: number) => {
        setItems((prev) =>
            prev.map((it) => {
                if (it.post.id !== postId) return it;
                const liked = !!it.post.liked;
                const likes_count =
                    (it.post.likes_count ?? 0) + (liked ? -1 : 1);
                return {
                    ...it,
                    post: { ...it.post, liked: !liked, likes_count },
                };
            }),
        );

        router.delete(`/posts/${postId}/like`);
    };

    const handleSubmit = (
        e: React.SubmitEvent<HTMLFormElement>,
        postId: number,
    ) => {
        e.preventDefault();

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        const body = (
            form.querySelector('input[name="body"]') as HTMLInputElement
        )?.value;
        if (body) {
            // optimistic add with temporary id
            const tmpId = `tmp-${Date.now()}`;
            setItems((prev) =>
                prev.map((it) => {
                    if (it.post.id !== postId) return it;
                    const comments = Array.isArray((it.post as any).comments)
                        ? (it.post as any).comments.slice()
                        : [];
                    comments.push({
                        id: tmpId,
                        body,
                        user: { name: 'You' },
                        created_at: new Date().toISOString(),
                    });
                    return {
                        ...it,
                        post: { ...it.post, comments },
                    } as FeedItem;
                }),
            );

            router.post(`/posts/${postId}/comments`, formData, {
                onSuccess: (page) => {
                    const created = (page as any).props?.createdComment;
                    const comments = (page as any).props?.postComments;

                    setItems((prev) =>
                        prev.map((it) => {
                            if (it.post.id !== postId) return it;

                            let currentComments = Array.isArray((it.post as any).comments)
                                ? (it.post as any).comments.slice()
                                : [];

                            if (created) {
                                currentComments = currentComments.map((c: any) =>
                                    String(c.id) === String(tmpId) ? created : c,
                                );
                            } else if (Array.isArray(comments)) {
                                currentComments = comments;
                            }

                            return { ...it, post: { ...it.post, comments: currentComments } } as FeedItem;
                        }),
                    );
                },
                onError: () => {
                    // remove tmp comment on error
                    setItems((prev) =>
                        prev.map((it) => {
                            if (it.post.id !== postId) return it;
                            const currentComments = (it.post as any).comments?.filter((c: any) => String(c.id) !== String(tmpId)) ?? [];
                            return { ...it, post: { ...it.post, comments: currentComments } } as FeedItem;
                        }),
                    );
                },
            });
        } else {
            router.post(`/posts/${postId}/comments`, formData);
        }

        form.reset();
    };

    //TODO: Reply functionality for comments (nested comments)

    return (
        <AppLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Feed
                </h1>

                {items.map((item) => {
                    const post = item.post;

                    return (
                        <article
                            key={item.id}
                            className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 dark:shadow-lg"
                        >
                            <header className="flex items-center gap-3">
                                <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    {post.user.avatar_url ? (
                                        <img
                                            src={post.user.avatar_url}
                                            alt={post.user.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : null}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {post.user.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleString()}
                                    </div>
                                </div>
                            </header>

                            {post.caption ? (
                                <p className="mt-3 text-gray-900 dark:text-gray-100">
                                    {post.caption}
                                </p>
                            ) : null}

                            {post.media.length > 0 && (
                                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {post.media.map((media) => (
                                        <div
                                            key={media.id}
                                            className="overflow-hidden rounded-md"
                                        >
                                            {media.type.startsWith('image/') ? (
                                                <img
                                                    src={media.url}
                                                    alt="Post media"
                                                    className="w-full object-cover"
                                                />
                                            ) : (
                                                <video
                                                    src={media.url}
                                                    controls
                                                    className="w-full rounded-md"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            post.liked
                                                ? onUnlike(post.id)
                                                : onLike(post.id)
                                        }
                                        className={`inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium focus:ring-2 focus:outline-none ${post.liked ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-200'}`}
                                    >
                                        <span>{post.liked ? '♥' : '♡'}</span>
                                        <span>{post.likes_count ?? 0}</span>
                                    </button>
                                </div>

                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Share
                                </div>
                            </div>

                            {/* comments list */}
                            {Array.isArray((post as any).comments) &&
                                (post as any).comments.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        {(post as any).comments.map(
                                            (c: any) => (
                                                <div
                                                    key={c.id}
                                                    className="flex gap-3"
                                                >
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {c.user?.name ??
                                                                'Unknown'}
                                                        </div>
                                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                                            {c.body}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {new Date(
                                                                c.created_at,
                                                            ).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}

                            <form
                                onSubmit={(e) => handleSubmit(e, post.id)}
                                className="mt-4"
                            >
                                <div className="flex gap-2">
                                    <input
                                        name="body"
                                        placeholder="Write a comment..."
                                        className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400"
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    >
                                        Comment
                                    </button>
                                </div>
                            </form>
                        </article>
                    );
                })}
            </div>
        </AppLayout>
    );
};

export default Index;
