<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Profile
 */
class ProfileResource extends JsonResource
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
            'user_id' => when($this->user_id, fn () =>  $this->user_id),
            'username' => when($this->username, fn () => $this->username),
            'avatar' => when($this->avatar, fn () => asset('storage/' . $this->avatar)),
            'bio' => when($this->bio, fn () => $this->bio),
            'created_at' => when($this->created_at, fn () => $this->created_at->diffForHumans()),
            'followers_count' => when($this->followers_count, fn () => $this->followers_count),
            'following_count' => when($this->following_count, fn () => $this->following_count),
            'posts_count' => when($this->posts_count, fn () => $this->posts_count),
        ];
    }
}
