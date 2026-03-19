<?php

namespace App\Jobs;

use App\Models\FeedItem;
use App\Models\Post;
use App\Services\Cache\FeedCacheService;
use Cache;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Redis;

class FanoutPostJob implements ShouldQueue
{
    use Queueable, Dispatchable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Post $post)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(FeedCacheService $feedCacheService): void
    {
        $followers = $this->post->user->followers()->pluck('users.id');

        $row = [];

        foreach ($followers as $followerId) {
            $row[] = [
                'user_id' => $followerId,
                'post_id' => $this->post->id,
                'created_at' => now(),
            ];
            // Clear the cache for the user's feed
            $feedCacheService->forgetUserFeed($followerId);
            
        }

        FeedItem::insert($row);

    }
}
