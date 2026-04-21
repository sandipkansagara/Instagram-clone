<?php

namespace App\Domains\User\Actions;

use App\Models\User;
use App\Notifications\ActivityNotification;
use App\NotificationType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class FollowUser
{
    public function execute(User $follower, User $target): void
    {
        if ($follower->is($target)) {
            return;
        }

        DB::transaction(function () use ($follower, $target): void {
            $alreadyFollowing = $follower->following()
                ->whereKey($target->getKey())
                ->exists();

            if ($alreadyFollowing) {
                return;
            }

            $follower->following()->attach($target->getKey());

            $follower->profile()->increment('following_count');
            $target->profile()->increment('followers_count');

            Notification::send(
                $target,
                new ActivityNotification($follower, NotificationType::FOLLOWED, $follower),
            );
        });
    }
}
