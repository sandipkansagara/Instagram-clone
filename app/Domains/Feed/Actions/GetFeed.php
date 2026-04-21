<?php

namespace App\Domains\Feed\Actions;

use App\Services\Cache\FeedCacheService;
use Illuminate\Contracts\Pagination\CursorPaginator;

class GetFeed
{
    public function __construct(
        public FeedCacheService $feedCacheService,
    ) {}

    public function execute(int $userId, ?string $cursor = null): CursorPaginator
    {
        return $this->feedCacheService->getUserFeed($userId, $cursor);
    }
}
