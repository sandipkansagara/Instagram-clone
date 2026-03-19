<?php

namespace App\Domains\Feed\Services;

use App\Models\FeedItem;
use App\Services\Cache\FeedCacheService;
use Cache;

class FeedService
{
    public function __construct(public FeedCacheService $feedCacheService)
    {
    }
    public function getFeed(int $userId)
    {
        return $this->feedCacheService->getUserFeed($userId);
    }
}
