<?php

namespace App\Services\Cache;

use App\Models\User;
use Illuminate\Support\Facades\Cache;

class ProfileCacheService
{
    public function getByUsername(string $username): User
    {
        /** @var User */
        return Cache::remember(
            $this->key($username),
            now()->addMinutes(10),
            fn () => User::with('profile')
                ->whereRelation('profile', 'username', $username)
                ->firstOrFail(),
        );
    }

    public function forgetByUsername(string $username): void
    {
        Cache::forget($this->key($username));
    }

    protected function key(string $username): string
    {
        return "profile:{$username}";
    }
}
