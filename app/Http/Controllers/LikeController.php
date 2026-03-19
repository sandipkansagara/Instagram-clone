<?php

namespace App\Http\Controllers;

use App\Domains\Post\Services\LikeService;
use App\Events\NotificationCreated;
use App\Models\Post;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function store(Post $post, LikeService $likeService)
    {
        $likeService->like($post, auth()->user());
        return back();
    }

    public function destroy(Post $post, LikeService $likeService)
    {
        $likeService->unlike($post, auth()->user());
        return back();
    }
}
