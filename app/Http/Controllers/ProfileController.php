<?php

namespace App\Http\Controllers;

use App\Domains\User\Actions\GetProfileByUsername;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show(string $username, GetProfileByUsername $getProfileByUsername)
    {
        $profile = $getProfileByUsername->execute($username, auth()->user());

        return Inertia::render('Profile/Show', [
            'profile' => $profile,
        ]);
    }
}
