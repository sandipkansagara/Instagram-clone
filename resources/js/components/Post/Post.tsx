import type { QueryKey } from '@tanstack/react-query';
import AlertError from '@/components/alert-error';
import CommentForm from '@/components/Comment/CommentForm';
import CommentList from '@/components/Comment/CommentList';
import LikeButton from '@/components/Buttons/LikeButton';
import type { ToggleLikeVars } from '@/hooks/Like/useToggleLike';
import { useToggleLike } from '@/hooks/Like/useToggleLike';
import CommentLink from '../Links/CommentLink';
import ShareButton from '../Buttons/ShareButton';
import MediaList from './MediaList';
import { PostCardData, PostUser } from './types';
import PostHeader from './PostHeader';
import { show } from '@/actions/App/Http/Controllers/PostController';
import ErrorBoundary from '../ErrorBoundary';

const getLikeErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'Unable to update like status. Please try again.';
};

interface Props {
    post: PostCardData;
    user: PostUser;
    queryKey: QueryKey;
    patchQueryData?: (old: unknown, vars: ToggleLikeVars) => unknown;
    commentShow?: boolean;
}

const Post = ({
    post,
    user,
    queryKey,
    patchQueryData,
    commentShow = false,
}: Props) => {
    const profile = user.profile || {};

    const {
        mutate: toggleLike,
        error,
        isError,
        isPending,
    } = useToggleLike({
        queryKey,
        patchQueryData: patchQueryData ?? ((old) => old),
    });

    const onToggleLike = () => {
        const controller = new AbortController();

        toggleLike({
            postId: post.id,
            isLiked: post.isLiked ?? false,
            signal: controller.signal,
        });
    };

    console.log(post)

    const toggleLikeErrorMessage = isError ? getLikeErrorMessage(error) : null;

    return (
        <article
            key={post.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
        >
            {/* Post Header */}
            <PostHeader post={post} user={user} />

            {/* Post Content */}
            <div className="p-4">
                {post.caption && (
                    <p className="mb-4 text-gray-800 dark:text-gray-200">
                        {post.caption}
                    </p>
                )}

                {/* Media Grid */}
                {post.media?.length > 0 && <MediaList mediaList={post.media} />}
            </div>

            {/* Post Actions */}
            <div className="flex items-center gap-4 border-t border-gray-100 p-4 dark:border-gray-700">
                <LikeButton
                    isLiked={post.isLiked ?? false}
                    likesCount={post.likes_count}
                    isPending={isPending}
                    onToggle={onToggleLike}
                />
                {!commentShow && (
                    <CommentLink
                        href={show.url(post.id)}
                        commentsCount={post.comments_count ?? 0}
                    />
                )}
                <ShareButton />
            </div>
            {toggleLikeErrorMessage && (
                <div className="border-t border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-700 dark:bg-red-950 dark:text-red-100">
                    <AlertError
                        errors={[toggleLikeErrorMessage]}
                        title="Like update failed"
                    />
                </div>
            )}

            {commentShow && (
                <div className="space-y-4 border-t border-gray-100 p-4 dark:border-gray-700">
                    <CommentForm postId={post.id} />
                    <ErrorBoundary>
                        <CommentList postId={post.id} />
                    </ErrorBoundary>
                </div>
            )}
        </article>
    );
};

export default Post;
