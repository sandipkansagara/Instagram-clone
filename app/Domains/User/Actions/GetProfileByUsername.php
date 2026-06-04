<?php

namespace App\Domains\User\Actions;

use App\Models\User;
use App\Services\Cache\ProfileCacheService;
use Illuminate\Support\Facades\Redis;
use Throwable;

class GetProfileByUsername
{
    public function __construct(
        public ProfileCacheService $profileCacheService,
    ) {
    }

    public function execute(string $username, ?User $viewer = null): User
    {
        /**
         * @var \App\Models\User $user
         */

        $user = $this->profileCacheService->getByUsername($username);

        $user->isFollowing = $viewer?->isFollowing($user) ?? false;

        // try {
        //     Redis::setnx("user:{$user->id}:following_count", $user->profile->following_count);
        //     Redis::setnx("user:{$user->id}:followers_count", $user->profile->followers_count);
        // } catch (Throwable) {
        //     // Redis counters are an optimization and should not block profile pages.
        // }

        return $user;
    }
}
