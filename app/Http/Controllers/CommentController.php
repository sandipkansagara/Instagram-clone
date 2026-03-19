<?php

namespace App\Http\Controllers;

use App\Domains\Post\Services\CommentService;
use App\Http\Requests\StoreCommentForm;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(StoreCommentForm $request, Post $post, CommentService $commentService)
    {
        $commentService->create($post, auth()->user(), $request->validated());

        return back();
    }

}
