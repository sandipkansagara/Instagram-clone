<?php

namespace App\Domains\Post\Actions;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;

class DeleteComment
{
    /**
     * @throws AuthorizationException
     */
    public function execute(Comment $comment, User $user): void
    {
        if ($comment->user_id !== $user->id) {
            throw new AuthorizationException;
        }

        DB::transaction(function () use ($comment): void {
            $post = $comment->post;

            $comment->delete();

            $post->decrement('comments_count');
        });
    }
}
