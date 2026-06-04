<?php

namespace App\Http\Controllers;

use App\Domains\Post\Actions\AddComment;
use App\Domains\Post\Actions\DeleteComment;
use App\Http\Requests\StoreCommentForm;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Response;
// inertia response


class CommentController extends Controller
{
    public function index(Post $post) : mixed
    {      

        if (request()->wantsJson() && !request()->hasHeader('X-Inertia')) {
            $comments = $post->comments()->with('user')->latest()->cursorPaginate(5);
            return CommentResource::collection($comments);
        }
        abort(404);

    }

    public function store(StoreCommentForm $request, Post $post, AddComment $addComment) : Response
    {
        $addComment->execute($post, auth()->user(), $request->validated());

        return response()->noContent();
    }

    public function show(Comment $comment) : \Inertia\Response
    {
        $comment->load('user');

        return inertia('Comment/Show', [
            'comment' => new CommentResource($comment),
        ]);
    }

    public function destroy(Comment $comment, DeleteComment $deleteComment) : Response
    {
        $deleteComment->execute($comment, auth()->user());

        return response()->noContent();
    }
}
