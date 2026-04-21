<?php

namespace App\Domains\Post\Actions;

use App\Models\Post;
use Illuminate\Support\Facades\Cache;

class GetPost
{
    public function execute(int $postId): Post
    {
        /** @var Post */
        return Cache::remember(
            "post:{$postId}",
            now()->addMinutes(10),
            fn (): Post => Post::with('media', 'likes', 'comments.user', 'comments.replies')->findOrFail($postId)
        );
    }
}
