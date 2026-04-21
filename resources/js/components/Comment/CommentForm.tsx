import { useCreateComment } from '@/hooks/useCreateComment';

const CommentForm = ({ postId }: { postId: number }) => {
    const { mutate: createComment, isPending } = useCreateComment();



    return (
        <form
            action={
                (formData: FormData) => createComment({ formData, postId })
            }
            className="mt-4"
        >
            <div className="flex gap-2">
                <input
                    name="body"
                    placeholder="Write a comment..."
                    className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                    {isPending ? 'Posting...' : 'Comment'}
                </button>
            </div>
        </form>
    );
};

export default CommentForm;
