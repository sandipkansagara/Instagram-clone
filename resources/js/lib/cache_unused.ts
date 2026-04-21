import { QueryClient } from '@tanstack/react-query';

/**
 * Common cache update utilities for optimistic updates and server data synchronization
 */

/**
 * Adds an optimistic item to the beginning of the first page in a paginated query
 */
export const addOptimisticItem = <T extends { id: any }>(
    queryClient: QueryClient,
    queryKey: string[],
    optimisticItem: T,
): { tempId: any; previousData: any } => {
    queryClient.cancelQueries({ queryKey });
    const previousData = queryClient.getQueryData(queryKey);

    queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
            ...old,
            pages: old.pages.map((page: any, index: number) => {
                if (index === 0) {
                    return {
                        ...page,
                        data: [optimisticItem, ...page.data],
                    };
                }
                return page;
            }),
        };
    });

    return { tempId: optimisticItem.id, previousData };
};

/**
 * Updates an item in the cache by replacing the item with the given tempId
 */
export const updateItemWithServerData = <T extends { id: any }>(
    queryClient: QueryClient,
    queryKey: string[],
    tempId: any,
    serverData: T,
): void => {
    queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
            ...old,
            pages: old.pages.map((page: any) => {
                return {
                    ...page,
                    data: page.data.map((item: any) => {
                        if (item.id === tempId) {
                            return serverData;
                        }
                        return item;
                    }),
                };
            }),
        };
    });
};

/**
 * Reverts the cache to the previous state (used on error)
 */
export const revertCache = (
    queryClient: QueryClient,
    queryKey: string[],
    previousData: any,
): void => {
    queryClient.setQueryData(queryKey, previousData);
};

/**
 * Removes an optimistic item from the cache (alternative to revert for partial failures)
 */
export const removeOptimisticItem = (
    queryClient: QueryClient,
    queryKey: string[],
    tempId: any,
): void => {
    queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
            ...old,
            pages: old.pages.map((page: any) => {
                return {
                    ...page,
                    data: page.data.filter((item: any) => item.id !== tempId),
                };
            }),
        };
    });
};

/**
 * Updates a specific field of an item in the cache
 */
export const updateItemField = <T extends { id: any }, K extends keyof T>(
    queryClient: QueryClient,
    queryKey: string[],
    itemId: any,
    field: K,
    value: T[K],
): void => {
    queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
            ...old,
            pages: old.pages.map((page: any) => {
                return {
                    ...page,
                    data: page.data.map((item: any) => {
                        if (item.id === itemId) {
                            return { ...item, [field]: value };
                        }
                        return item;
                    }),
                };
            }),
        };
    });
};

/**
 * Increments a numeric field of an item in the cache
 */
export const incrementItemField = (
    queryClient: QueryClient,
    queryKey: string[],
    itemId: any,
    field: string,
    incrementBy: number = 1,
): void => {
    queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
            ...old,
            pages: old.pages.map((page: any) => {
                return {
                    ...page,
                    data: page.data.map((item: any) => {
                        if (item.id === itemId) {
                            return {
                                ...item,
                                [field]: (item[field] || 0) + incrementBy,
                            };
                        }
                        return item;
                    }),
                };
            }),
        };
    });
};

/**
 * Decrements a numeric field of an item in the cache
 */
export const decrementItemField = (
    queryClient: QueryClient,
    queryKey: string[],
    itemId: any,
    field: string,
    decrementBy: number = 1,
): void => {
    incrementItemField(queryClient, queryKey, itemId, field, -decrementBy);
};
