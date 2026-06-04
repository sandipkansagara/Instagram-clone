<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index() : \Inertia\Response|AnonymousResourceCollection
    {
        $users = User::withExists(
            ['followers as is_following' => fn($q) => $q->where('follower_id', auth()->id())]
        )
            ->with('profile')
            ->where('id', '!=', auth()->id())
            ->latest()->cursorPaginate(20);

        if (request()->wantsJson() && !request()->hasHeader('X-Inertia')) {
            return UserResource::collection($users);
        }

        return Inertia::render('User/Index', [
            'users' => UserResource::collection($users)
        ]);
    }
}
