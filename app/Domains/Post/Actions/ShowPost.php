<?php

namespace App\Domains\Post\Actions;

use App\Models\Post;
use Illuminate\Support\Facades\Cache;

class ShowPost
{
    public function execute($postId)
    {
        return Cache::remember(
            "post:{$postId}",
            now()->addMinutes(10),
            fn () => Post::with('media', 'likes', 'comments.user', 'comments.replies')->findOrFail($postId)
        );
    }
}
