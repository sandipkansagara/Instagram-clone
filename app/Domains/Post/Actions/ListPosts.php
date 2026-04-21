<?php

namespace App\Domains\Post\Actions;

use App\Models\User;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Support\Facades\Redis;
use Throwable;

class ListPosts
{
    public function execute(User $user): CursorPaginator
    {
        $posts = $user->posts()
            ->with('media')
            ->latest('id')
            ->cursorPaginate(5);

        try {
            foreach ($posts as $post) {
                Redis::setnx("post:{$post->id}:likes", $post->likes_count);
            }
        } catch (Throwable) {
            // Redis is an optimization for realtime counters, not a requirement for listing posts.
        }

        return $posts;
    }
}
