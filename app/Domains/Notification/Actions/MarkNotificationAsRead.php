<?php

namespace App\Domains\Notification\Actions;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Notifications\DatabaseNotification;

class MarkNotificationAsRead
{
    /**
     * @throws AuthorizationException
     */
    public function execute(User $user, DatabaseNotification $notification): void
    {
        if ($notification->notifiable_id !== $user->getKey() || $notification->notifiable_type !== $user->getMorphClass()) {
            throw new AuthorizationException;
        }

        $notification->markAsRead();
    }
}
