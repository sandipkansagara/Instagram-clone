<?php

namespace App\Http\Controllers;

use App\Domains\Post\Actions\LikePost;
use App\Domains\Post\Actions\UnlikePost;
use App\Models\Post;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;

class LikeController extends Controller
{
    public function store(Post $post, LikePost $likePost) : Response|JsonResponse
    {
        $likePost->execute($post, auth()->user());

        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return response()->noContent();
    }

    public function destroy(Post $post, UnlikePost $unlikePost) : Response|JsonResponse
    {
        $unlikePost->execute($post, auth()->user());

        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return response()->noContent();
    }
}
