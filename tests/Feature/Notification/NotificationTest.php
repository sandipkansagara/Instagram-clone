<?php

use App\Models\Post;
use App\Models\Profile;
use App\Models\User;
use App\NotificationType;
use Database\Factories\NotificationFactory;
use Illuminate\Database\Eloquent\Relations\Relation;

it('creates a notification when post liked', function () {
    $user = User::factory()->create();
    $postOwner = User::factory()->create();

    $post = Post::factory()->create(['user_id' => $postOwner->id]);

    $this->actingAs($user)->post(route('posts.like', $post));

    $this->assertDatabaseHas('notifications', [
        'notifiable_id' => $postOwner->id,
        'notifiable_type' => Relation::getMorphAlias(User::class),
        'data->actor_id' => $user->id,
        'data->action' => NotificationType::LIKED->value,
    ]);

});

it('does not create a notification when user likes their own post', function () {
    $user = User::factory()->create();

    $post = Post::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)->post(route('posts.like', $post));

    $this->assertDatabaseCount('notifications', 0);

});

it('creates a notification when post commented', function () {
    $user = User::factory()->create();
    $postOwner = User::factory()->create();

    $post = Post::factory()->create(['user_id' => $postOwner->id]);

    $this->actingAs($user)->post(route('posts.comments.store', $post), [
        'body' => 'Nice post!',
    ]);

    $this->assertDatabaseHas('notifications', [
        'notifiable_id' => $postOwner->id,
        'notifiable_type' => Relation::getMorphAlias(User::class),
        'data->actor_id' => $user->id,
        'data->action' => NotificationType::COMMENTED->value,
    ]);

});

it('creates a notification when user followed', function () {
    $user = User::factory()->has(Profile::factory())->create();
    $followedUser = User::factory()->has(Profile::factory())->create();

    $this->actingAs($user)->post(route('follow', $followedUser));

    $this->assertDatabaseHas('notifications', [
        'notifiable_id' => $followedUser->id,
        'notifiable_type' => Relation::getMorphAlias(User::class),
        'data->actor_id' => $user->id,
        'data->action' => NotificationType::FOLLOWED->value,
    ]);

});

it('fetch notifications for user', function () {
    $user = User::factory()->has(
        Profile::factory()
    )->create();
    $friend = User::factory()->has(
        Profile::factory()
    )->create();

    $post = Post::factory()->create(['user_id' => $user->id]);

    // Create 5 "like" notifications for this user's post
    NotificationFactory::new()
        ->count(5)
        ->likedPost($friend, $post)
        ->create(['notifiable_id' => $user->id]);

    // Create a follow notification
    NotificationFactory::new()
        ->followed($friend)
        ->create(['notifiable_id' => $user->id]);

    $resource = $this->actingAs($user)
        ->get(route('notifications.index'))
        ->assertOk();

    $this->assertDatabaseCount('notifications', 6);

});

it('marks the authenticated users notification as read', function () {
    $user = User::factory()->has(Profile::factory())->create();
    $friend = User::factory()->has(Profile::factory())->create();

    $notification = NotificationFactory::new()
        ->followed($friend)
        ->create([
            'notifiable_id' => $user->id,
            'notifiable_type' => Relation::getMorphAlias(User::class),
            'read_at' => null,
        ]);

    $this->actingAs($user)
        ->post(route('notifications.read', $notification))
        ->assertNoContent();

    expect($notification->fresh()->read_at)->not->toBeNull();
});

it('cannot mark another users notification as read', function () {
    $user = User::factory()->has(Profile::factory())->create();
    $otherUser = User::factory()->has(Profile::factory())->create();
    $friend = User::factory()->has(Profile::factory())->create();

    $notification = NotificationFactory::new()
        ->followed($friend)
        ->create([
            'notifiable_id' => $otherUser->id,
            'notifiable_type' => Relation::getMorphAlias(User::class),
            'read_at' => null,
        ]);

    $this->actingAs($user)
        ->post(route('notifications.read', $notification))
        ->assertForbidden();

    expect($notification->fresh()->read_at)->toBeNull();
});
