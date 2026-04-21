<?php

namespace App\Http\Resources;

use App\Domains\Notification\Support\NotificationPresenter;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray($request): array
    {
        return app(NotificationPresenter::class)->present($this->data, $this->resource);
    }
}
