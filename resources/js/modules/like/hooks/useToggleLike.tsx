import type { QueryKey} from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { destroy, store } from '@/actions/App/Http/Controllers/LikeController';

export interface ToggleLikeVars {
    postId: number;
    isLiked: boolean;
    signal?: AbortSignal;
}

interface UseToggleLikeOptions<TQueryData> {
    queryKey: QueryKey;
    patchQueryData: (
        old: TQueryData | undefined,
        vars: ToggleLikeVars,
    ) => TQueryData | undefined;
}

export const useToggleLike = <TQueryData,>({
    queryKey,
    patchQueryData,
}: UseToggleLikeOptions<TQueryData>) => {
    const queryClient = useQueryClient();

    return useMutation<unknown, AxiosError, ToggleLikeVars, { previous?: TQueryData }>({
        mutationFn: async ({ postId, isLiked, signal }: ToggleLikeVars) => {
            const config = {
                headers: { Accept: 'application/json' },
                signal,
            };

            if (isLiked) {
                return await axios.delete(destroy.url(postId), config);
            }
            return await axios.post(store.url(postId), {}, config);
        },
        onMutate: async (vars) => {
            await queryClient.cancelQueries({ queryKey });

            const previous = queryClient.getQueryData<TQueryData>(queryKey);

            queryClient.setQueryData<TQueryData>(queryKey, (old) =>
                patchQueryData(old, vars),
            );

            return { previous };
        },
        onError: (_err, _variables, context) => {
            queryClient.setQueryData(queryKey, context?.previous);
        },
    });
};
