<?php

namespace App\Services\Cache;

use App\Models\FeedItem;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Support\Facades\Cache;

class FeedCacheService
{
    public function getUserFeed(int $userId, ?string $cursor = null): CursorPaginator
    {
        return Cache::tags(['feed', 'user:'.$userId])->remember(
            $this->key($userId, $cursor),
            now()->addMinutes(10),
            fn (): CursorPaginator => FeedItem::with([
                'post' => function ($query) use ($userId) {
                    $query->withExists([
                        'likes as isLiked' => function ($query) use ($userId) {
                            $query->where('user_id', $userId);
                        },
                    ]);
                },
                'post.user.profile',
                'post.media',
                'post.comments.user',
                'post.comments.replies',
            ])->where('user_id', $userId)->latest()->cursorPaginate(20)
        );
    }

    public function forgetUserFeed(int $userId): void
    {
        // log which feed is being cleared
        Cache::tags(['feed', 'user:'.$userId])->flush();
    }

    protected function key(int $userId, ?string $cursor = null): string
    {
        return "private_feed_{$userId}_page_".($cursor ?: 'initial');
    }
}
