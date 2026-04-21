<?php

namespace App\Http\Controllers;

use App\Domains\Notification\Actions\ListNotifications;
use App\Domains\Notification\Actions\MarkNotificationAsRead;
use App\Http\Resources\NotificationResource;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index(Request $request, ListNotifications $listNotifications)
    {
        $notifications = $listNotifications->execute($request->user());

        if ($request->wantsJson()) {
            return NotificationResource::collection($notifications);
        }

        return inertia('Notifications/Index', [
            'notifications' => NotificationResource::collection($notifications),
        ]);
    }

    public function markAsRead(Request $request, DatabaseNotification $notification, MarkNotificationAsRead $markNotificationAsRead)
    {
        $markNotificationAsRead->execute($request->user(), $notification);

        return response()->noContent();
    }
}
