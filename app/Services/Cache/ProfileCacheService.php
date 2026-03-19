<?php

namespace App\Services\Cache;

use App\Models\Profile;
use Illuminate\Support\Facades\Cache;


class ProfileCacheService
{
    public function getByUsername(string $username): mixed
    {
        return Cache::remember(
            $this->key($username),
            now()->addMinutes(10),
            fn() =>
            Profile::where('username', $username)->with('user')->firstOrFail()
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
