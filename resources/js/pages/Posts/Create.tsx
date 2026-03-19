import { router } from '@inertiajs/react';

export default function Create() {
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        router.post('/posts', formData);
    };

    return (
        <form
            onSubmit={submit}
            className="mx-auto mt-8 max-w-xl space-y-4 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 dark:shadow-lg"
        >
            <div>
                <label
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
                    htmlFor="caption"
                >
                    Caption
                </label>
                <textarea
                    id="caption"
                    name="caption"
                    placeholder="Write a caption..."
                    className="min-h-30 w-full rounded-md border border-gray-200 bg-white p-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400"
                />
            </div>

            <div>
                <label
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
                    htmlFor="media"
                >
                    Media
                </label>
                <input
                    id="media"
                    type="file"
                    name="media[]"
                    multiple
                    className="block w-full rounded-md border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    You can upload one or more images or videos.
                </p>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
                >
                    Create Post
                </button>
            </div>
        </form>
    );
}
