<?php

namespace App\Domains\Notification\Support;

use App\Models\Profile;
use App\NotificationType;
use Illuminate\Notifications\DatabaseNotification;

class NotificationPresenter
{
    /**
     * @param  array{
     *   actor_name?: string|null,
     *   action: NotificationType|string,
     *   subject_id?: int|string|null,
     *   subject_type?: string|null,
     *   target_id?: int|string|null,
     *   target_type?: string|null,
     *   created_at?: string
     * }  $data
     * @return array{id?: string, message: string, url: string, actor_name: string|null, created_at?: string}
     */
    public function present(array $data, ?DatabaseNotification $notification = null): array
    {
        $payload = [
            'message' => $this->buildMessage($data),
            'url' => $this->buildUrl($data),
            'actor_name' => $data['actor_name'] ?? null,
        ];

        if ($notification !== null) {
            $payload['id'] = $notification->getKey();
            $payload['created_at'] = $notification->created_at->diffForHumans();
        } elseif (isset($data['created_at'])) {
            $payload['created_at'] = $data['created_at'];
        }

        return $payload;
    }

    /**
     * @param  array{action: NotificationType|string, target_type?: string|null}  $data
     */
    private function buildMessage(array $data): string
    {
        $action = $data['action'] instanceof NotificationType ? $data['action']->value : $data['action'];

        return match ($action) {
            NotificationType::LIKED->value => "liked your {$data['target_type']}",
            NotificationType::COMMENTED->value => "commented on your {$data['target_type']}",
            NotificationType::FOLLOWED->value => 'started following you',
            default => 'interacted with your content',
        };
    }

    /**
     * @param  array{
     *   subject_id?: int|string|null,
     *   subject_type?: string|null,
     *   target_id?: int|string|null,
     *   target_type?: string|null
     * }  $data
     */
    private function buildUrl(array $data): string
    {
        $type = $data['target_type'] ?? $data['subject_type'] ?? null;
        $id = $data['target_id'] ?? $data['subject_id'] ?? null;

        if ($type === 'user') {
            $username = Profile::where('user_id', $id)->value('username');

            return route('profile.show', $username);
        }

        return route("{$type}s.show", $id);
    }
}
