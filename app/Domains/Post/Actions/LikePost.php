<?php

namespace App\Domains\Post\Actions;

use App\Events\PostLikedToggled;
use App\Models\Post;
use App\Models\User;
use App\Notifications\ActivityNotification;
use App\NotificationType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redis;
use Throwable;

class LikePost
{
    public function execute(Post $post, User $user): void
    {
        $exists = $post->likes()
            ->where('user_id', $user->id)
            ->exists();

        if ($exists) {
            return;
        }

        DB::transaction(function () use ($post, $user): void {
            $like = $post->likes()->create([
                'user_id' => $user->id,
            ]);

            $post->increment('likes_count');

            try {
                Redis::incr("post:{$post->id}:likes");
                broadcast(new PostLikedToggled($user, $post))->toOthers();
            } catch (Throwable) {
                // Realtime updates are optional; persisting the like must still succeed.
            }

            $owner = $post->user;

            if (! $owner->is($user)) {
                Notification::send($owner, new ActivityNotification($user, NotificationType::LIKED, $like, $post));
            }
        });
    }
}
