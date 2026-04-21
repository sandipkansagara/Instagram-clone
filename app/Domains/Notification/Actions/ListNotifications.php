<?php

namespace App\Domains\Notification\Actions;

use App\Models\User;
use Illuminate\Contracts\Pagination\CursorPaginator;

class ListNotifications
{
    public function execute(User $user): CursorPaginator
    {
        return $user->unreadNotifications()
            ->latest()
            ->cursorPaginate(20);
    }
}
