<?php

namespace App\Notifications;

use App\Domains\Notification\Support\NotificationPresenter;
use App\NotificationType;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class ActivityNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        protected mixed $actor,
        protected NotificationType $action,
        protected mixed $subject,
        protected mixed $target = null
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'actor_id' => $this->actor->id,
            'actor_name' => $this->actor->name,
            'action' => $this->action,
            'subject_id' => $this->subject->id,
            'subject_type' => $this->subject->getMorphClass(),
            'target_id' => $this->target ? $this->target->id : null,
            'target_type' => $this->target ? $this->target->getMorphClass() : null,
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        $data = $this->toDatabase($notifiable);

        return new BroadcastMessage(
            app(NotificationPresenter::class)->present($data + [
                'created_at' => now()->diffForHumans(),
            ]),
        );
    }
}
