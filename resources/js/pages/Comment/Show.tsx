import ErrorBoundary from '@/components/ErrorBoundary';
import AppLayout from '@/layouts/app-layout';
import Comment from '@/modules/comment/components/Comment';
import type { CommentApi } from '@/modules/comment/types';
import { mapComment } from '@/modules/comment/utils/transform';

type Props = {
    comment: CommentApi;
};

const Show = ({ comment: commentInitial }: Props) => {
    console.log(commentInitial);
    const comment = mapComment(commentInitial);
    return (
        <AppLayout>
            <div className="mx-auto max-w-2xl px-4 py-6">
                <ErrorBoundary>
                    <Comment comment={comment} replyShow={true} />
                </ErrorBoundary>
            </div>
        </AppLayout>
    );
};

export default Show;
