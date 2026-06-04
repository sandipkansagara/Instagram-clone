import { ApiPaginatedResponse, PaginatedResponse } from '@/core/types/api';
import { Comment, CommentApi } from '@/modules/comment/types';
import {
    Media,
    MediaApi,
    PostApi,
    Post,
} from '@/modules/post/types';
import { mapUser } from '@/modules/user/utils/Transform';

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

export const mapMedia = (mediaApi: MediaApi): Media => {
    return {
        id: mediaApi.id,
        path: mediaApi.path,
        type: mediaApi.type,
        postId: mediaApi.post_id,
    };
};

export const mapPost = (postApi: PostApi): Post => {
    return {
        id: postApi.id,
        caption: postApi.caption,
        isLiked: postApi.is_liked,
        createdAt: postApi.created_at,
        updatedAt: postApi.updated_at,
        user: postApi.user ? mapUser(postApi.user) : undefined,
        media: postApi.media ? postApi.media.map(mapMedia) : null,
        likesCount: postApi.likes_count,
        commentsCount: postApi.comments_count,
        comments: postApi.comments ? postApi.comments.map(mapComment) : null,
    };
};

export const transformFullResponse = (
    response: ApiPaginatedResponse<PostApi>,
): PaginatedResponse<Post> => {
    return {
        data: response.data.map(mapPost),
        meta: {
            nextCursor: response.meta.next_cursor,
        },
        message: response.message,
    };
};
