import Post from '@/modules/post/components/Post';
import { useShowPost } from '@/modules/post/hooks/useShowPost';
import { patchSinglePostLike } from '@/modules/like/hooks/cache';
import { postKeys } from '@/modules/post/queryKeys';
import AppLayout from '@/layouts/app-layout';
import { Post as PostType } from '@/modules/post/types';

interface ShowProps {
    post: PostType;
}

const Show = ({ post }: ShowProps) => {
    const { data: currentPost } = useShowPost(post);

    if (!currentPost) {
        return null;
    }

    return (
        <AppLayout>
            <div className="mx-auto max-w-2xl px-4 py-6">
                <Post
                    post={currentPost}
                    user={currentPost.user}
                    queryKey={postKeys.detail(currentPost.id)}
                    patchQueryData={patchSinglePostLike}
                    commentShow={true}
                />
            </div>
        </AppLayout>
    );
};

export default Show;
