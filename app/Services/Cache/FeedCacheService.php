<?php

namespace App\Services\Cache;

use App\Models\FeedItem;
use Illuminate\Support\Facades\Cache;

class FeedCacheService
{
    public function getUserFeed(int $userId): mixed
    {
        return Cache::remember(
            $this->key($userId),
            now()->addMinutes(10),
            fn() => FeedItem::with('post.user', 'post.media', 'post.likes', 'post.comments.user', 'post.comments.replies')->where('user_id', $userId)->latest()->paginate(20)
        );
    }

    public function forgetUserFeed(int $userId): void
    {
        //log which feed is being cleared
        \Log::info("Clearing feed for user: {$userId}");
        Cache::forget($this->key($userId));
    }

    protected function key(int $userId): string
    {
        return "feed:user:{$userId}";
    }
}
