<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Redis;

class FollowService
{
    public function follow(User $follower, User $following): void
    {
        Redis::incr("user:{$follower->id}:following_count");
        Redis::incr("user:{$following->id}:followers_count");
    }

    public function unfollow(User $follower, User $following): void
    {
        Redis::decr("user:{$follower->id}:following_count");
        Redis::decr("user:{$following->id}:followers_count");
    }

    public function getFollowingCount(User $user): int
    {
        return Redis::get("user:{$user->id}:following_count") ?? $user->following()->count();
    }

    public function getFollowersCount(User $user): int
    {
        return Redis::get("user:{$user->id}:followers_count") ?? $user->followers()->count();
    }
}
