import Comment from '@/modules/comment/components/Comment';
import useComment from '@/modules/comment/hooks/useComment';
import type { Comment as CommentType } from '@/modules/comment/types';

const CommentList = ({ postId }: { postId: number }) => {
    const { data, isLoading, isError } = useComment(postId);
    const commentList = data?.flattened || [];

    return (
        <div className="space-y-3">
            {isLoading && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading comments...
                </p>
            )}

            {isError && (
                <p className="text-sm text-red-500 dark:text-red-400">
                    Unable to load comments right now.
                </p>
            )}

            {!isLoading && !isError && commentList.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No comments yet.
                </p>
            )}

            {!isLoading &&
                !isError &&
                commentList.map((comment: CommentType) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
        </div>
    );
};
export default CommentList;
