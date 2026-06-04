<?php

namespace App\Domains\Notification\Actions;

use App\Models\User;
use Illuminate\Contracts\Pagination\CursorPaginator;

class ListNotifications
{
    /**
     * @return CursorPaginator<int, \Illuminate\Notifications\DatabaseNotification>
     */
    public function execute(User $user): CursorPaginator
    {
        return $user->unreadNotifications()
            ->latest()
            ->cursorPaginate(20);
    }
}
