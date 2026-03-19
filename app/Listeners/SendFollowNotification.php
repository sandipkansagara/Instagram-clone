<?php

namespace App\Listeners;

use App\Events\UserFollowed;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendFollowNotification
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
    public function handle(UserFollowed $event): void
    {
        // For simplicity, we won't create a notification if the user follows themselves
        if($event->actor->id === $event->target->id) {
            return;
        }

        // In a real app, you'd likely want to create a Notification model here

        Notification::create([
            'user_id' => $event->target->id,
            'type' => 'user_followed',
            'data' => json_encode([
                'actor_id' => $event->actor->id,
            ]),
        ]);
        
        // For this example, we'll just log it
        \Log::info("User {$event->actor->id} followed User {$event->target->id}");
    }
}
