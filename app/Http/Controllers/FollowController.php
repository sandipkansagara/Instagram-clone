<?php

namespace App\Http\Controllers;

use App\Domains\User\Actions\FollowUser;
use App\Domains\User\Actions\UnfollowUser;
use App\Http\Requests\FollowRequest;
use App\Models\User;

class FollowController extends Controller
{
    public function store(FollowRequest $request, User $user, FollowUser $followUser)
    {
        $followUser->execute(auth()->user(), $user);

        return response()->noContent();
    }

    public function destroy(User $user, UnfollowUser $unfollowUser)
    {
        $unfollowUser->execute(auth()->user(), $user);

        return response()->noContent();
    }
}
