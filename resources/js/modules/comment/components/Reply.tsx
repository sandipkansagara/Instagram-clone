import { Comment as CommentType } from '@/modules/comment/types';
import CommentHeader from './CommentHeader';
import ReplyLink from '@/components/links/ReplyLink';
import { show } from '@/actions/App/Http/Controllers/CommentController';
import ErrorBoundary from '@/components/ErrorBoundary';
import ReplyForm from './ReplyForm';
import ReplyList from './ReplyList';

interface Props {
    reply: CommentType;
    replyShow?: boolean;
}

const Reply = ({ reply, replyShow }: Props) => {

    return (
        <article
            key={reply.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
        >
            {/* Comment Header */}
            <CommentHeader comment={reply} user={reply.user} />
            {/* Comment Content */}
            <div className="p-4">
                {reply.body && (
                    <p className="mb-4 text-gray-800 dark:text-gray-200">
                        {reply.body}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-4 border-t border-gray-100 p-4 dark:border-gray-700">
                {!replyShow && <ReplyLink href={show.url(reply.id)} />}
            </div>
            {replyShow && (
                <div className="space-y-4 border-t border-gray-100 p-4 dark:border-gray-700">
                    <ReplyForm id={reply.id} />
                    <ErrorBoundary>
                        <ReplyList id={reply.id} />
                    </ErrorBoundary>
                </div>
            )}
        </article>
    );
};

export default Reply;
