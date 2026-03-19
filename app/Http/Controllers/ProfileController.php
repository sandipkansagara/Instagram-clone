<?php

namespace App\Http\Controllers;

use App\Domains\User\Services\ProfileService;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show($username, ProfileService $profileService)
    {
        $profile = $profileService->getByUsername($username);

        return Inertia::render('Profile/Show', [
            'profile' => $profile,
        ]);
    }
}
