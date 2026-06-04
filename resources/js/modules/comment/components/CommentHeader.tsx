import { Link } from '@inertiajs/react';
import { show } from '@/actions/App/Http/Controllers/CommentController';
import type { Comment } from '@/modules/comment/types';
import type { Profile, User } from '@/modules/user/types';

interface Props {
    comment: Comment;
    user: User;
}

const CommentHeader = ({ comment, user }: Props) => {
    const profile = user.profile || {} as Profile;

    return (
        <div className="flex items-center gap-3 border-b border-gray-100 p-4 dark:border-gray-700">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                {profile.avatar ? (
                    <img
                        src={profile.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-indigo-500 text-sm font-semibold text-white">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <div className="flex-1">
                <Link
                    href={show.url(comment.id)}
                    className="text-sm font-semibold text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                >
                    {user.name}
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {comment.createdAt}
                </p>
            </div>
        </div>
    );
};

export default CommentHeader;
