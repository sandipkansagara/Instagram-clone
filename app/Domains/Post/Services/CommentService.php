<?php

namespace App\Domains\Post\Services;

use App\Events\CommentCreated;
use App\Models\Post;
use App\Models\User;
use DB;

class CommentService
{
    public function create(Post $post, User $user, array $data)
    {
        DB::transaction(function () use ($post, $user, $data) {
            $comment = $post->comments()->create([
                'user_id' => $user->id,
                'body' => $data['body'],
                'parent_id' => $data['parent_id'] ?? null,
            ]);

            $post->increment('comments_count');

            CommentCreated::dispatch($user, $post);

            return $comment;
        });
    }

}
