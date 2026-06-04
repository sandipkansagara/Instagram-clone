import { patchPostsLike } from '@/modules/like/hooks/cache';
import Post from '@/modules/post/components/Post';
import type { PostCardData } from '@/components/Post/types';

interface User {
    name: string;
}

interface Profile {
    avatar?: string | null;
}

interface Props {
    posts: PostCardData[];
    user: User;
    profile: Profile;
}

const PostList = ({ posts, user, profile }: Props) => {
    const postUser = {
        name: user.name,
        profile,
    };

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <Post
                    key={post.id}
                    post={post}
                    user={postUser}
                    queryKey={['posts']}
                    patchQueryData={patchPostsLike}
                />
            ))}
        </div>
    );
};

export default PostList;
