<?php

namespace App\Http\Controllers;

use App\Domains\Post\Actions\AddComment;
use App\Domains\Post\Actions\DeleteComment;
use App\Http\Requests\StoreCommentForm;
use App\Models\Comment;
use App\Models\Post;

class CommentController extends Controller
{
    public function index(Post $post)
    {
        $comments = $post->comments()->with('user')->latest()->get();

        return response()->json($comments);
    }

    public function store(StoreCommentForm $request, Post $post, AddComment $addComment)
    {
        $addComment->execute($post, auth()->user(), $request->validated());

        return response()->noContent();
    }

    public function destroy(Comment $comment, DeleteComment $deleteComment)
    {
        $deleteComment->execute($comment, auth()->user());

        return response()->noContent();
    }
}
