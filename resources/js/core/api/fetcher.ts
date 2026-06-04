import type { ApiPaginatedResponse, ApiResponse } from '../types/api';

export const fetcher = async <T, R = T>
    (
        promise: Promise<{ data: ApiResponse<T> }>,
        transform? : (data: T) => R
    ): Promise<R> => {
    const response = await promise;
    const data = response.data.data;
    return transform ? transform(data) : data as unknown as R;
};

export const fetcherPaginated = async <T, R = ApiPaginatedResponse<T>>(
    promise: Promise<{ data: ApiPaginatedResponse<T> }>,
    transform?: (data: ApiPaginatedResponse<T>) => R,
): Promise<R> => {
    const response = await promise;
    const data = response.data;
    return transform ? transform(data) : (data as unknown as R);
};
