import type { CommentItemData } from '@/components/comment/types';
import Comment from '../../modules/comment/components/Comment';
import useComment from '@/hooks/Comment/useComment';

const CommentList = ({ postId }: { postId: number }) => {
    const { data: commentList = [], isLoading, isError } = useComment(postId);

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
                commentList.map((comment: CommentItemData) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
        </div>
    );
};
export default CommentList;
