<?php

namespace App\Http\Resources;

use App\Domains\Notification\Support\NotificationPresenter;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \Illuminate\Notifications\DatabaseNotification
 */
class NotificationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return app(NotificationPresenter::class)->present($this->data, $this->resource);
    }
}
