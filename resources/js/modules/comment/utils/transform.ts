import { ApiPaginatedResponse, PaginatedResponse } from "@/core/types/api";
import { Comment, CommentApi } from "../types";
import { mapUser } from "@/modules/user/utils/Transform";

export const mapComment = (commentApi: CommentApi): Comment => {
    return {
        id: commentApi.id,
        parentId: commentApi.parent_id,
        body: commentApi.body,
        createdAt: commentApi.created_at,
        updatedAt: commentApi.updated_at,
        user: mapUser(commentApi.user),
        postId: commentApi.post_id,
        replies: commentApi.replies ? commentApi.replies.map(mapComment) : null,
    };
};

export const transformFullResponse = (
    response: ApiPaginatedResponse<CommentApi>,
): PaginatedResponse<Comment> => {
    return {
        data: response.data.map(mapComment),
        meta: {
            nextCursor: response.meta.next_cursor,
        },
        message: response.message,
    };
};
