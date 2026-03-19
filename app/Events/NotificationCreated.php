<?php

namespace App\Events;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Notification $notification)
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->notification->user_id),
        ];
    }

    public function broadcastWith(): array
    {
        $actorID = is_array($this->notification->data) ? $this->notification->data['actor_id'] : json_decode($this->notification->data, true)['actor_id'] ?? null;

        // get user name from actor_id in notification data
        $actor = User::find($actorID);

        $notification = $this->notification->toArray();

        if ($notification['type'] === 'post_liked') {
            $notification['message'] = 'Your post was liked by ' . $actor->name;
        } else if ($notification['type'] === 'comment_created') {
            $notification['message'] = 'Your post was commented on by ' . $actor->name;
        } else if ($notification['type'] === 'followed') {
            $notification['message'] = $actor->name . ' started following you';
        } else {
            $notification['message'] = 'You have a new notification';
        }



        return [
            'notification' => $notification,
        ];
    }
}
