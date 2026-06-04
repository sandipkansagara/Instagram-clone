/**
 * Broadcast Event Types
 * Defines the shape of events broadcasted via Laravel Echo
 */

import type { Post } from '@/pages/Feed/Index';

/**
 * PostLikedToggled Event
 * Fired when a post is liked or unliked
 */
export interface PostLikedToggledEvent {
    post: Post;
}

/**
 * Comment Event
 * Fired when a comment is added, updated, or deleted
 */
export interface CommentEvent {
    postId: number;
    comment: {
        id: number;
        user_id: number;
        post_id: number;
        body: string;
        created_at: string;
        updated_at: string;
    };
}

/**
 * Generic broadcast event type
 * All broadcast events should extend this interface
 */
export interface BroadcastEvent {
    [key: string]: unknown;
}
