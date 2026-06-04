export type ApiResponse<T> = {
    data: T;
    message: string;
}

export type ApiPaginatedResponse<T> = {
    data: T[];
    meta: {
        next_cursor: string | null;
    };
    message: string;
    max_id?: number;
}

export type ApiErrorResponse = {
    message: string;
    errors?: Record<string, string[]>;
}

export type PaginatedResponse<T> = {
    data: T[];
    meta: {
        nextCursor: string | null;
    };
    message: string;
    maxId?: number;
};

