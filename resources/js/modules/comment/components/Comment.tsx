import { Comment as CommentType } from '@/modules/comment/types';
import CommentHeader from './CommentHeader';
import ReplyLink from '@/components/links/ReplyLink';
import ErrorBoundary from '@/components/ErrorBoundary';
import ReplyForm from './ReplyForm';
import ReplyList from './ReplyList';
import { show } from '@/actions/App/Http/Controllers/CommentController';

interface Props {
    comment: CommentType;
    replyShow?: boolean;
}

const Comment = ({ comment, replyShow }: Props) => {
    const avatar = comment.user.profile?.avatar ?? null;
    const fallback = comment.user.name.charAt(0).toUpperCase();

    return (
        <article
            key={comment.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
        >
            {/* Comment Header */}
            <CommentHeader comment={comment} user={comment.user} />
            {/* Comment Content */}
            <div className="p-4">
                {comment.body && (
                    <p className="mb-4 text-gray-800 dark:text-gray-200">
                        {comment.body}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-4 border-t border-gray-100 p-4 dark:border-gray-700">
                {!replyShow && <ReplyLink href={show.url(comment.id)} />}
            </div>
            {replyShow && (
                <div className="space-y-4 border-t border-gray-100 p-4 dark:border-gray-700">
                    <ReplyForm id={comment.id} />
                    <ErrorBoundary>
                        <ReplyList id={comment.id} />
                    </ErrorBoundary>
                </div>
            )}
        </article>
    );
};

export default Comment;
