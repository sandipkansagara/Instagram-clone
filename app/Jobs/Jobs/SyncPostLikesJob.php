<?php

namespace App\Jobs\Jobs;

use App\Models\Post;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Redis;

class SyncPostLikesJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $keys = Redis::keys('post:*:likes');
        foreach ($keys as $key) {
            $postId = explode(':', $key)[1];
            $likesCount = Redis::get($key);

            // Update the likes_count in the database for the post
            Post::where('id', $postId)->update(['likes_count' => $likesCount]);
        }
    }
}
