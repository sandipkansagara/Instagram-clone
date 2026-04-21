<?php

namespace App\Domains\Post\Actions;

use App\Events\PostLikedToggled;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Throwable;

class UnlikePost
{
    public function execute(Post $post, User $user): void
    {
        DB::transaction(function () use ($post, $user): void {
            $removed = $post->likes()
                ->where('user_id', $user->id)
                ->delete();

            if ($removed === 0) {
                return;
            }

            $post->decrement('likes_count');

            try {
                Redis::decr("post:{$post->id}:likes");
                broadcast(new PostLikedToggled($user, $post))->toOthers();
            } catch (Throwable) {
                // Realtime updates are optional; removing the like must still succeed.
            }
        });
    }
}
