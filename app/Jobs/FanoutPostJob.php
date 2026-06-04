<?php

namespace App\Jobs;

use App\Models\FeedItem;
use App\Models\Post;
use App\Services\Cache\FeedCacheService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;

class FanoutPostJob implements ShouldQueue
{
    use Dispatchable, Queueable;

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
        /**
         * @var \App\Models\User | null $user
         */
        $user = $this->post->user;

        if (! $user) {
            return;
        }
       
        $followers = $user->followers()->pluck('users.id');

        if ($followers->isEmpty()) {
            return;
        }

        $rows = [];

        foreach ($followers as $followerId) {
            $rows[] = [
                'user_id' => $followerId,
                'post_id' => $this->post->id,
                'created_at' => now(),
            ];

            $feedCacheService->forgetUserFeed($followerId);
        }

        FeedItem::insert($rows);
    }
}
