<?php

namespace App\Domains\User\Actions;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class UnfollowUser
{
    public function execute(User $follower, User $target): void
    {
        DB::transaction(function () use ($follower, $target): void {
            $removed = $follower->following()->detach($target->getKey());

            if ($removed === 0) {
                return;
            }

            $follower->profile()->decrement('following_count');
            $target->profile()->decrement('followers_count');
        });
    }
}
