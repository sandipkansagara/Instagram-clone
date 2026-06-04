<?php

namespace App\Services\Cache;

use App\Models\FeedItem;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Support\Facades\Cache;
use Log;

class FeedCacheService
{
    public function getUserFeed(int $userId, ?string $cursor = null): CursorPaginator
    {
        //\DB::enableQueryLog();
        $maxId = request()->has('max_id') ? request()->input('max_id') : null;
        Log::info('Fetching feed for user ' . $userId . ' with cursor: ' . ($cursor ?? 'none') . ' and max_id: ' . ($maxId ?? 'none'));

        $result = Cache::tags(['feed', 'user:' . $userId])->remember(
            $this->key($userId, $cursor),
            now()->addMinutes(10),
            fn(): CursorPaginator => FeedItem::select('id', 'post_id', 'user_id')
                ->where('user_id', $userId)
                //->when($maxId, fn($query) => $query->where('id', '<=', $maxId))
                ->with([
                    'post' => function ($query) use ($userId) {
                        $query->select('id', 'caption', 'likes_count', 'comments_count', 'user_id', 'created_at')->withExists([
                            'likes as is_liked' => function ($query) use ($userId) {
                                $query->where('user_id', $userId);
                            },
                        ]);
                    },

                    'post.user' => function ($query) {
                        $query->select('id', 'name');
                    },
                    'post.media' => function ($query) {
                        $query->select('id', 'post_id', 'type', 'path');
                    },
                ])->orderByDesc('id')->cursorPaginate(5)
        );
        //dd(\DB::getQueryLog());
        return $result;
    }

    public function forgetUserFeed(int $userId): void
    {
        // log which feed is being cleared
        Cache::tags(['feed', 'user:' . $userId])->flush();
    }

    protected function key(int $userId, ?string $cursor = null): string
    {
        return "private_feed_{$userId}_page_" . ($cursor ?: 'initial');
    }
}
