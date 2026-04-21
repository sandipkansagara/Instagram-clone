import { destroy, store } from '@/actions/App/Http/Controllers/LikeController';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface ToggleLikeVars {
    postId: number;
    isLiked: boolean;
    signal?: AbortSignal;
}

interface UseToggleLikeOptions {
    queryKey: QueryKey;
    patchQueryData: (old: unknown, vars: ToggleLikeVars) => unknown;
}

export const useToggleLike = ({
    queryKey,
    patchQueryData,
}: UseToggleLikeOptions) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ postId, isLiked, signal }: ToggleLikeVars) => {
            const config = {
                headers: { Accept: 'application/json' },
                signal,
            };

            if (isLiked) {
                await axios.delete(destroy.url(postId), config);
            } else {
                await axios.post(store.url(postId), {}, config);
            }
        },
        onMutate: async (vars) => {
            await queryClient.cancelQueries({ queryKey });

            const previous = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old) => patchQueryData(old, vars));

            return { previous };
        },
        onError: (_err, _variables, context) => {
            queryClient.setQueryData(queryKey, context?.previous);
        },
    });
};
