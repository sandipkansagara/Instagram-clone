<?php

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;

test('profile page is displayed using username', function () {
    $user = User::factory()->create();
    $username = Str::slug($user->name).rand(100, 999);
    $user->profile()->create([
        'username' => $username,
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('profile.show', ['username' => $username]));

    $response->assertOk();
    // View should contain the user's username
    $response->assertSee($username);
});

test('profile follow state is resolved per viewer and not from shared cache', function () {
    Cache::flush();

    $profileOwner = User::factory()->create();
    $viewerWhoFollows = User::factory()->create();
    $viewerWhoDoesNotFollow = User::factory()->create();

    $username = Str::slug($profileOwner->name).rand(100, 999);
    $profileOwner->profile()->create([
        'username' => $username,
    ]);

    $viewerWhoFollows->following()->attach($profileOwner->id);

    $this->actingAs($viewerWhoFollows)
        ->get(route('profile.show', ['username' => $username]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Profile/Show')
            ->where('profile.id', $profileOwner->id)
            ->where('profile.isFollowing', true));

    $this->actingAs($viewerWhoDoesNotFollow)
        ->get(route('profile.show', ['username' => $username]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Profile/Show')
            ->where('profile.id', $profileOwner->id)
            ->where('profile.isFollowing', false));
});

test('profile should be created when user registers', function () {

    $response = $this->post('/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertDatabaseHas('profiles', [
        'user_id' => User::where('email', 'john@example.com')->first()->id,
    ]);
});
