<?php

use App\Models\Profile;
use App\Models\User;
use Illuminate\Support\Facades\DB;

it('user can follow to another user', function () {

    $user = User::factory()->has(Profile::factory())->create();
    $targetUser = User::factory()->has(Profile::factory())->create();

    $response = $this->actingAs($user)->post(route('follow', $targetUser));
    $response->assertNoContent();

    $this->assertDatabaseHas('follows', [
        'follower_id' => $user->id,
        'following_id' => $targetUser->id,
    ]);

    expect(Profile::find($user->profile->id)->following_count)->toBe(1);
    expect(Profile::find($targetUser->profile->id)->followers_count)->toBe(1);

});

it('user can not follow them self', function () {
    $user = User::factory()->has(Profile::factory())->create();
    $response = $this->actingAs($user)->post(route('follow', $user));

    $response->assertSessionHasErrors('user');
});

it('user can not follow same user twice', function () {
    $user = User::factory()->has(Profile::factory())->create();
    $targetUser = User::factory()->has(Profile::factory())->create();

    $this->actingAs($user)->post(route('follow', $targetUser));
    $this->actingAs($user)->post(route('follow', $targetUser));

    expect(DB::table('follows')->where([
        'follower_id' => $user->id,
        'following_id' => $targetUser->id,
    ])->count())->toBe(1);
    expect($user->profile()->value('following_count'))->toBe(1);
    expect($targetUser->profile()->value('followers_count'))->toBe(1);
    $this->assertDatabaseCount('notifications', 1);

});

it('user can unfollow', function () {
    $user = User::factory()->has(Profile::factory())->create();
    $targetUser = User::factory()->has(Profile::factory())->create();

    $user->following()->attach($targetUser);

    $response = $this->actingAs($user)->delete(route('unfollow', $targetUser));

    $response->assertNoContent();

    $this->assertDatabaseMissing('follows', [
        'follower_id' => $user->id,
        'following_id' => $targetUser->id,
    ]);

});

it('guest can not follow', function () {
    $targetUser = User::factory()->has(Profile::factory())->create();
    $response = $this->post(route('follow', $targetUser));
    $response->assertRedirect(route('login'));
});
