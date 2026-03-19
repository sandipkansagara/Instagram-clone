<?php

namespace App\Listeners;

use App\Events\LikeCreated;
use App\Events\NotificationCreated;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendLikeNotification
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
    public function handle(LikeCreated $event): void
    {
        $postOwner = $event->post->user;

        if($postOwner->id === $event->actor->id) {
            return; // Don't notify if user liked their own post
        }

        $notification = Notification::create([
            'user_id' => $postOwner->id,
            'type' => 'post_liked',
            'data' => json_encode([
                'actor_id' => $event->actor->id,
                'post_id' => $event->post->id,
            ]),
        ]);

        NotificationCreated::dispatch($notification);
    }
}
