import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { useCreateComment } from '@/modules/comment/hooks/useCreateComment';
import { createCommentSchema, type CreateCommentData } from '@/lib/schemas';
import { useCreateReply } from '../hooks/useCreateReply';

const ReplyForm = ({ id }: { id: number }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CreateCommentData>({
        resolver: zodResolver(createCommentSchema),
    });
    const { mutateAsync: createReply } = useCreateReply();

    const onSubmit = async (data: CreateCommentData) => {
        await createReply({
            id,
            body: data.body,
        });

        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className="flex gap-2">
                <Input
                    {...register('body')}
                    placeholder="Write your reply..."
                    className="flex-1"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.body}
                    aria-describedby={errors.body ? 'comment-error' : undefined}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Posting...' : 'Reply'}
                </Button>
            </div>
            {errors.body && (
                <InputError id="comment-error" message={errors.body.message} />
            )}
        </form>
    );
};

export default ReplyForm;
