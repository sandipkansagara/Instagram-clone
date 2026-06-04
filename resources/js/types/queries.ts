/**
 * Query Data Types
 * Defines the shape of data used in TanStack Query operations
 */

import type { Feed } from '@/pages/Feed/Index';

/**
 * Infinite query page structure
 * Used for paginated queries like feeds
 */
export interface InfiniteQueryPageStructure<T> {
    pages: T[];
    pageParams: (string | number | null)[];
}

/**
 * Feed query data type
 * Represents the paginated feed data structure
 */
export type FeedQueryData = InfiniteQueryPageStructure<Feed>;
