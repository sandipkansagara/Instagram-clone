<?php

namespace App\Domains\Post\Services;

use App\Events\LikeCreated;
use App\Models\Post;
use App\Models\User;
use DB;
use Illuminate\Support\Facades\Redis;

class LikeService
{
    public function like(Post $post, User $user)
    {
        $exist = $post->likes()->where('user_id', $user->id)->exists();

        if ($exist) {
            return;
        }

        DB::transaction(function () use ($post, $user) {
            $post->likes()->create([
                'user_id' => $user->id,
            ]);

            $post->increment('likes_count');
            //redis increment for post likes count can be added here for real-time updates

            Redis::incr("post:{$post->id}:likes");

            // event(new LikeCreated($user, $post));
            LikeCreated::dispatch($user, $post);
        });
    }

    public function unlike(Post $post, User $user)
    {
        DB::transaction(function () use ($post, $user) {
            $post->likes()->where('user_id', $user->id)->delete();

            Redis::decr("post:{$post->id}:likes");

            $post->decrement('likes_count');
        });
    }
}
