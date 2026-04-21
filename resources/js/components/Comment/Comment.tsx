import type { CommentItemData } from '@/components/Comment/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Comment = ({ comment }: { comment: CommentItemData }) => {
    const avatar = comment.user.profile?.avatar ?? comment.user.avatar ?? null;
    const fallback = comment.user.name.charAt(0).toUpperCase();

    return (
        <div className="flex gap-3">
            <Avatar size="sm">
                <AvatarImage
                    src={avatar ?? undefined}
                    alt={comment.user.name}
                />
                <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {comment.user?.name ?? 'Unknown'}
                </div>
                <div className="text-sm break-words text-gray-700 dark:text-gray-300">
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
