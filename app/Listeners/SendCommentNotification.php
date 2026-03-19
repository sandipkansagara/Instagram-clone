<?php

namespace App\Listeners;

use App\Events\CommentCreated;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendCommentNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(CommentCreated $event): void
    {
        $postOwner = $event->post->user;

        if($postOwner->id === $event->actor->id) {
            return; // Don't notify if user commented on their own post
        }

        Notification::create([
            'user_id' => $postOwner->id,
            'type' => 'post_commented',
            'data' => json_encode([
                'actor_id' => $event->actor->id,
                'post_id' => $event->post->id,
            ]),
        ]);
    }
}
