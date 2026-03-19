<?php

namespace App\Domains\User\Services;

use App\Events\UserFollowed;
use App\Models\User;

class FollowServices
{
    public function follow(User $follower, User $target)
    {
        if ($follower->id === $target->id) {
            throw new \Exception('You cannot follow yourself.');
        }

        $follower->following()->syncWithoutDetaching($target->id);

        $follower->profile->increment('following_count');
        $target->profile->increment('followers_count');

        UserFollowed::dispatch($follower, $target);
    }


    public function unfollow(User $follower, User $target)
    {

        $follower->following()->detach($target->id);

        $follower->profile->decrement('following_count');
        $target->profile->decrement('followers_count');

    }
}
