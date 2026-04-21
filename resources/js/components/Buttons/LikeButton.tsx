interface Props {
    isLiked: boolean;
    likesCount?: number;
    isPending?: boolean;
    onToggle: () => void;
}

const LikeButton = ({
    isLiked,
    likesCount,
    isPending = false,
    onToggle,
}: Props) => {
    return (
        <button
            disabled={isPending}
            onClick={onToggle}
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
            aria-pressed={isLiked}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium focus:ring-2 focus:outline-none ${isLiked ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-200'}`}
        >
            <span>{isLiked ? '♥' : '♡'}</span>
            <span>{likesCount ?? 0}</span>
        </button>
    );
};

export default LikeButton;
