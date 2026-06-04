import AppLayout from '@/layouts/app-layout';
import PostList from '@/modules/post/components/PostList';
import { usePage } from '@inertiajs/react';
import Create from './Create';
import { usePosts } from '@/modules/post/hooks/usePosts';
import InfiniteScroll from '@/components/InfiniteScroll';
import { User, Profile } from '@/modules/user/types';
import { ApiPaginatedResponse } from '@/core/types/api';
import {PostApi } from '@/modules/post/types';

interface Props {
    posts: ApiPaginatedResponse<PostApi>;
}

const Index = ({ posts:initialPosts } : Props) => {
    const {
        auth: { user, profile },
    } = usePage<{auth: { user: User; profile: Profile } }>()
        .props;

    const {
        data: { flattened: posts},
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = usePosts(initialPosts);

    console.log(hasNextPage)

    return (
        <AppLayout>
            <div className="py- mx-auto max-w-2xl space-y-8 px-4">
                <Create />

                <div className="space-y-6">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        My Posts
                    </h1>

                    {posts.length === 0 ? (
                        <div className="rounded-lg bg-white p-8 text-center shadow-sm dark:bg-gray-800">
                            <p className="text-gray-500 dark:text-gray-400">
                                No posts yet. Create your first post above!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <InfiniteScroll
                                hasNextPage={hasNextPage}
                                isFetchingNextPage={isFetchingNextPage}
                                fetchNextPage={fetchNextPage}
                            >
                                <PostList
                                    posts={posts}
                                    user={user}
                                    profile={profile}
                                />
                            </InfiniteScroll>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
