<?php

namespace App\Domains\Comment\Actions;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use App\Notifications\ActivityNotification;
use App\NotificationType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class AddReply
{
    /**
     * @param  array{body: string, parent_id?: int|null}  $data
     */
    public function execute(Comment $comment, User $user, array $data): Comment
    {
        return DB::transaction(function () use ($comment, $user, $data): Comment {
            $reply = $comment->replies()->create([
                'user_id' => $user->id,
                'post_id' => $comment->post_id,
                'body' => $data['body'],
            ]);


            $owner = $comment->user;

            if (! $owner->is($user)) {
                Notification::send($owner, new ActivityNotification($user, NotificationType::COMMENTED, $reply, $comment));
            }

            return $comment;
        });
    }
}
