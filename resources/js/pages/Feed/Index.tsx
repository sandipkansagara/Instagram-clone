import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { useFeed } from '@/hooks/useFeed';
import { useUpdateFeed } from '@/hooks/useUpdateFeed';
import { useEcho } from '@laravel/echo-react';
import { useUpdateLike } from '@/hooks/useUpdateLike';
import { useCreateComment } from '@/hooks/useCreateComment';
import CommentForm from '@/components/Comment/CommentForm';
import CommentList from '@/components/Comment/CommentList';
import FeedList from '@/components/Feed/FeedList';

interface User {
    id?: number;
    name: string;
    profile?: {
        avatar?: string | null;
    };
}

export interface Media {
    id: number;
    type: string;
    url: string;
}

export interface Comment {
    id: number;
    body: string;
    created_at: string;
    user: User;
}

export interface Post {
    id: number;
    user: User;
    caption?: string | null;
    media: Media[];
    likes_count?: number;
    isLiked?: boolean;
    comments: Comment[];
    comments_count?: number;
    created_at: string;
}

export interface mutationVars {
    postId: number;
    isLiked: boolean;
    signal: AbortSignal;
}

export interface FeedItem {
    id: number;
    created_at: string;
    post: Post;
}

export interface Feed {
    data: FeedItem[];
    next_cursor?: string | null;
}

const Index = ({ feed }: { feed: Feed }) => {
    // local optimistic state for immediate UI updates
    const [, setItems] = useState<FeedItem[]>(() => feed.data);

    const { data } = useFeed(feed);
    const updateLike = useUpdateLike();

    //NOTE:: We can use debounce to avoid multiple requests

    const { mutate: createComment } = useCreateComment();

    useEcho('post-feed', 'PostLikedToggled', (e: any) => {
        updateLike(e.post);
    });

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
                    const comments = Array.isArray((it.post as Post).comments)
                        ? (it.post as Post).comments.slice()
                        : [];
                    comments.push({
                        id: tmpId as unknown as number,
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

                            let currentComments = Array.isArray(
                                (it.post as any).comments,
                            )
                                ? (it.post as any).comments.slice()
                                : [];

                            if (created) {
                                currentComments = currentComments.map(
                                    (c: any) =>
                                        String(c.id) === String(tmpId)
                                            ? created
                                            : c,
                                );
                            } else if (Array.isArray(comments)) {
                                currentComments = comments;
                            }

                            return {
                                ...it,
                                post: { ...it.post, comments: currentComments },
                            } as FeedItem;
                        }),
                    );
                },
                onError: () => {
                    // remove tmp comment on error
                    setItems((prev) =>
                        prev.map((it) => {
                            if (it.post.id !== postId) return it;
                            const currentComments =
                                (it.post as Post).comments?.filter(
                                    (c: any) => String(c.id) !== String(tmpId),
                                ) ?? [];
                            return {
                                ...it,
                                post: { ...it.post, comments: currentComments },
                            } as FeedItem;
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

    const flattenedFeed = data.pages.flatMap((page) => page.data);

    return (
        <AppLayout>
            <FeedList feed={flattenedFeed} />
        </AppLayout>
    );
};

export default Index;
