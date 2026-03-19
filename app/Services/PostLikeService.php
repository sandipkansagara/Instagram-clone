<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Support\Facades\Redis;

class PostLikeService
{
    public function like(Post $post)
    {
        Redis::incr("post:{$post->id}:likes");
    }

    public function unlike(Post $post)
    {
        Redis::decr("post:{$post->id}:likes");
    }

    public function getLikesCount(Post $post)
    {
        return Redis::get("post:{$post->id}:likes") ?? $post->likes_count;
    }

}
