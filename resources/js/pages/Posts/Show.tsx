import Post from '@/components/Post/Post';
import { ShowPostData, useShowPost } from '@/hooks/Post/useShowPost';
import { patchSinglePostLike } from '@/hooks/Like/cache';
import { postKeys } from '@/hooks/Post/queryKeys';
import AppLayout from '@/layouts/app-layout';

interface ShowProps {
    post: ShowPostData;
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
