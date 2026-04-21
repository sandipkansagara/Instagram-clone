<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::withExists(
            ['followers as isFollowing' => fn ($q) => $q->where('follower_id', auth()->id())]
        )
            ->with('profile')
            ->where('id', '!=', auth()->id())
            ->latest()->cursorPaginate(20);

        return Inertia::render('User/Index', [
            'users' => $users,
        ]);
    }
}
