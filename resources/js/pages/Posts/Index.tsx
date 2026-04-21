import AppLayout from '@/layouts/app-layout';
import PostList from '@/components/Post/PostList';
import { Link, usePage } from '@inertiajs/react';
import Create from './Create';
import { usePost } from '@/hooks/Post/usePost';
import InfiniteScroll from '@/components/InfiniteScroll';

interface User {
    id: number;
    name: string;
}

interface Media {
    id: number;
    type: string;
    url: string;
}

export interface Post {
    id: number;
    user_id: number;
    caption: string;
    created_at: string;
    media: Media[] | [];
    likes_count: number;
    isLiked: boolean;
    comments_count: number;
}

export interface PostsData {
    data: Post[];
    meta: {
        next_cursor: string | null;
    };
}

interface Profile {
    id: number;
    user_id: number;
    bio?: string | null;
    avatar?: string | null;
    followers_count: number;
    following_count: number;
    posts_count: number;
}

const Index = () => {
    const {
        posts,
        auth: { user, profile },
    } = usePage<{ posts: PostsData; auth: { user: User; profile: Profile } }>()
        .props;

    const {
        data: postsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = usePost(posts);
    const postsList = postsData?.pages.flatMap((page) => page.data) ?? [];

    return (
        <AppLayout>
            <div className="py- mx-auto max-w-2xl space-y-8 px-4">
                <Create />

                <div className="space-y-6">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        My Posts
                    </h1>

                    {postsList.length === 0 ? (
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
                                    posts={postsList}
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
