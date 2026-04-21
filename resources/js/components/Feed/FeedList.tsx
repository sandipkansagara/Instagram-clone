import { patchFeedLike } from '@/hooks/Like/cache';
import { FeedItem } from '@/pages/Feed/Index';
import Post from '../Post/Post';
import { Link } from '@inertiajs/react';
import { show } from '@/routes/posts';

const FeedList = ({ feed }: { feed: FeedItem[] }) => {
    return (
        <div className="space-y-6 p-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Feed
            </h1>

            {feed.map((item: FeedItem) => {
                const post = item.post;

                return (
                    <Post
                        key={item.id}
                        post={post}
                        user={post.user}
                        queryKey={['feed']}
                        patchQueryData={patchFeedLike}
                    />
                );
            })}
        </div>
    );
};

export default FeedList;
