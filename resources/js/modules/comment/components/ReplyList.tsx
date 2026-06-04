import useReply from '@/modules/comment/hooks/useReply';
import type { Comment as CommentType } from '@/modules/comment/types';
import Reply from './Reply';

const ReplyList = ({ id }: { id: number }) => {
    const { data, isLoading, isError } = useReply(id);
    const replyList = data?.flattened || [];

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

            {!isLoading && !isError && replyList.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No comments yet.
                </p>
            )}

            {!isLoading &&
                !isError &&
                replyList.map((reply: CommentType) => (
                    <Reply key={reply.id} reply={reply} />
                ))}
        </div>
    );
};
export default ReplyList;
