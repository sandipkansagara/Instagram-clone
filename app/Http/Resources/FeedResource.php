<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\FeedItem
 */

class FeedResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'post' => new PostResource($this->whenLoaded('post')),
            'user_id' => when($this->user_id, fn () => $this->user_id),
            'created_at' => when($this->created_at, fn () => $this->created_at->diffForHumans()),
        ];
    }
}
