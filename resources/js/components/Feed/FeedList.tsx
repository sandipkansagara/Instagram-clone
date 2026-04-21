import ErrorBoundary from '@/components/ErrorBoundary';
import { patchFeedLike } from '@/hooks/Like/cache';
import { FeedItem } from '@/pages/Feed/Index';
import Post from '../Post/Post';

const FeedList = ({ feed }: { feed: FeedItem[] }) => {
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
