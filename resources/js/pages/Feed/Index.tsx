import { useEcho } from '@laravel/echo-react';
import FeedList from '@/components/Feed/FeedList';
import ErrorBoundary, { ErrorFallback } from '@/components/ErrorBoundary';
import { useFeed } from '@/hooks/useFeed';
import { useUpdateLike } from '@/hooks/useUpdateLike';
import AppLayout from '@/layouts/app-layout';

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

export interface Post {
    id: number;
    user: User;
    caption?: string | null;
    media: Media[];
    likes_count?: number;
    isLiked?: boolean;
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
    const { data, error, isError, refetch } = useFeed(feed);
    const updateLike = useUpdateLike();

    useEcho('post-feed', 'PostLikedToggled', (e: any) => {
        updateLike(e.post);
    });

    if (isError) {
        return (
            <AppLayout>
                <div className="p-4">
                    <ErrorFallback error={error ?? null} resetError={refetch} />
                </div>
            </AppLayout>
        );
    }

    const flattenedFeed = data?.pages.flatMap((page) => page.data) ?? [];

    return (
        <AppLayout>
            <ErrorBoundary>
                <FeedList feed={flattenedFeed} />
            </ErrorBoundary>
        </AppLayout>
    );
};

export default Index;
