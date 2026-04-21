import useComment from '@/hooks/Comment/useComment';
import Comment from './Comment';
import { i } from 'node_modules/vite/dist/node/chunks/moduleRunnerTransport';

interface Comment {
    id: number;
    body: string;
    created_at: string;
    user: {
        name: string;
        profile?: {
            avatar?: string | null;
        };
    };
}

interface CommentList{
    comments: Comment[];
}

const CommentList = ({ postId }: { postId: number }) => {
    const { data: commentData, isLoading } = useComment(postId);
    return (
        <div>
            {isLoading && <p>Loading...</p>}
            {commentData.length === 0 ? <p>No comments yet.</p> : commentData?.map((comment: Comment) => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </div>
    );
};
export default CommentList;
