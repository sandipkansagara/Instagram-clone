<?php

namespace App\Http\Controllers;

use App\Domains\User\Services\FollowServices;
use App\Models\User;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    public function store(User $user, FollowServices $followServices)
    {
        $followServices->follow(auth()->user(), $user);

        return back();
    }

    public function destroy(User $user, FollowServices $followServices)
    {
        $followServices->unfollow(auth()->user(), $user);

        return back();
    }
}
