import Post, { PostCardData } from '@/components/Post/Post';
import { patchPostsLike } from '@/hooks/Like/cache';

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
