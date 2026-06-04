import { useEcho } from '@laravel/echo-react';
import ErrorBoundary, { ErrorFallback } from '@/components/ErrorBoundary';
import InfiniteScroll from '@/components/InfiniteScroll';
import type { ApiPaginatedResponse} from '@/core/types/api';
import AppLayout from '@/layouts/app-layout';
import FeedList from '@/modules/feed/components/FeedList';
import { useFeed } from '@/modules/feed/hooks/useFeed';
import { useUpdateLikeLive } from '@/modules/feed/hooks/useUpdateLike';
import type { FeedItemApi } from '@/modules/feed/types';
import type { Post } from '@/modules/post/types';

const Index = ({
    feed: feedInitial,
}: {
    feed: ApiPaginatedResponse<FeedItemApi>;
}) => {
    const {
        data: { flattened: feed },
        error,
        isError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        refetch,
    } = useFeed(feedInitial);
    const updateLike = useUpdateLikeLive();

    useEcho<{ post: Post }>('post-feed', 'PostLikedToggled', (payload) => {
        updateLike(payload.post);
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

    return (
        <AppLayout>
            <ErrorBoundary>
                <InfiniteScroll hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage}>
                    <FeedList feed={feed} />
                </InfiniteScroll>
            </ErrorBoundary>
        </AppLayout>
    );
};

export default Index;
