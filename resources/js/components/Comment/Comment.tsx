type Comment = {
    id: number;
    body: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
        avatar: string;
    };
};

const Comment = ({ comment }: { comment: Comment }) => {
    return (
        <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {comment.user?.name ?? 'Unknown'}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    {comment.body}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.created_at).toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default Comment;
