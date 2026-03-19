<?php

namespace App\Listeners;

use App\Events\UserUpdated;
use App\Services\Cache\ProfileCacheService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Cache;
use Str;

class UpdateUserProfile
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(UserUpdated $event, ProfileCacheService $profileCacheService): void
    {
        $user = $event->user;
        $username = Str::slug($user->name) . rand(100, 999);

        $user->profile()->update([
            'username' => $username
        ]);

        // Clear the cache for the updated profile
        $profileCacheService->forgetByUsername($username);
    }
}
