<?php

namespace App\Domains\Post\Actions;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use App\Notifications\ActivityNotification;
use App\NotificationType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class AddComment
{
    /**
     * @param  array{body: string, parent_id?: int|null}  $data
     */
    public function execute(Post $post, User $user, array $data): Comment
    {
        return DB::transaction(function () use ($post, $user, $data): Comment {
            $comment = $post->comments()->create([
                'user_id' => $user->id,
                'body' => $data['body'],
                'parent_id' => $data['parent_id'] ?? null,
            ]);

            $post->increment('comments_count');

            $owner = $post->user;

            if (! $owner->is($user)) {
                Notification::send($owner, new ActivityNotification($user, NotificationType::COMMENTED, $comment, $post));
            }

            return $comment;
        });
    }
}
