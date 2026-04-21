<?php

namespace App\Http\Controllers;

use App\Domains\Post\Actions\LikePost;
use App\Domains\Post\Actions\UnlikePost;
use App\Models\Post;

class LikeController extends Controller
{
    public function store(Post $post, LikePost $likePost)
    {
        $likePost->execute($post, auth()->user());

        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return response()->noContent();
    }

    public function destroy(Post $post, UnlikePost $unlikePost)
    {
        $unlikePost->execute($post, auth()->user());

        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return back();
    }
}
