<?php

namespace App\Http\Controllers;

use App;
use App\Domains\Comment\Actions\AddReply;
use App\Http\Requests\StoreCommentForm;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Http\Response;

class ReplyController extends Controller
{
    public function index(Comment $comment) : AnonymousResourceCollection
    {
        /** @var CursorPaginator<int, App\Models\Comment> */
        $replies = $comment->replies()->with('user')->latest()->cursorPaginate(5);

        if (request()->wantsJson() && !request()->hasHeader('X-Inertia')) {
            return CommentResource::collection($replies);
        }
        abort(404);

    }

    public function store(StoreCommentForm $request,  Comment $comment, AddReply $addReply ) : Response
    {
        $addReply->execute($comment, auth()->user(), $request->validated());

        return response()->noContent();
    }

    public function show(Comment $comment) : \Inertia\Response
    {
        $comment->load('user', 'replies.user');

        return inertia('Comment/Show', [
            'comment' => new CommentResource($comment),
        ]);
    }

    // public function destroy(Comment $comment, DeleteComment $deleteComment)
    // {
    //     $deleteComment->execute($comment, auth()->user());

    //     return response()->noContent();
    // }
}
