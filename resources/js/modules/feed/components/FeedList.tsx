import ErrorBoundary from '@/components/ErrorBoundary';
import type { FeedItem } from '@/modules/feed/types';
import { patchFeedLike } from '@/modules/like/hooks/cache';
import Post from '@/modules/post/components/Post';

type Props = {
    feed: FeedItem[];
};

const FeedList = ({ feed }: Props) => {
    return (
        <div className="space-y-6 p-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Feed
            </h1>

            {feed.map((item: FeedItem) => {
                const post = item.post;

                return (
                    <ErrorBoundary key={item.id}>
                        <Post
                            post={post}
                            user={post.user}
                            queryKey={['feed']}
                            patchQueryData={patchFeedLike}
                        />
                    </ErrorBoundary>
                );
            })}
        </div>
    );
};

export default FeedList;
