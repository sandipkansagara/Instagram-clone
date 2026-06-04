import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePost } from '@/modules/post/hooks/useCreatePost';
import { createPostSchema, type CreatePostData } from '@/lib/schemas';
import InputError from '@/components/input-error';
import { useRef } from 'react';

export default function PostForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<CreatePostData>({
        resolver: zodResolver(createPostSchema),
    });

    const { mutate: createPost, isPending } = useCreatePost();
    const mediaFiles = watch('media') || [];

    const onSubmit = (data: CreatePostData) => {
        const formData = new FormData();
        if (data.caption) {
            formData.append('caption', data.caption);
        }
        data.media?.forEach((file) => {
            formData.append('media[]', file);
        });
        createPost(formData);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setValue('media', files);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
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
                    {...register('caption')}
                    id="caption"
                    placeholder="Write a caption..."
                    className={`min-h-30 w-full rounded-md border border-gray-200 bg-white p-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 ${
                        errors.caption ? 'border-red-500' : ''
                    }`}
                    aria-invalid={!!errors.caption}
                    aria-describedby={
                        errors.caption ? 'caption-error' : undefined
                    }
                />
                {errors.caption && (
                    <InputError
                        id="caption-error"
                        message={errors.caption.message}
                    />
                )}
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
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className={`block w-full rounded-md border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 ${
                        errors.media ? 'border-red-500' : ''
                    }`}
                    aria-invalid={!!errors.media}
                    aria-describedby={errors.media ? 'media-error' : undefined}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    You can upload one or more images/videos. Selected:{' '}
                    {mediaFiles.length} file(s)
                </p>
                {errors.media && (
                    <InputError
                        id="media-error"
                        message={errors.media.message}
                    />
                )}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
                >
                    {isPending ? 'Creating...' : 'Create Post'}
                </button>
            </div>
        </form>
    );
}
