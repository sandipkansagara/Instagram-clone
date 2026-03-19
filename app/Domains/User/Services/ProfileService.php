<?php

namespace App\Domains\User\Services;

use App\Models\Profile;
use App\Services\Cache\ProfileCacheService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class ProfileService
{
    public function __construct(public ProfileCacheService $profileCacheService)
    {
        //
    }
    public function getByUsername($username)
    {
        $profile = $this->profileCacheService->getByUsername($username);

        Redis::setnx("user:{$profile->user_id}:following_count", $profile->following_count);

        Redis::setnx("user:{$profile->user_id}:followers_count", $profile->followers_count);

        return $profile;
    }
}
