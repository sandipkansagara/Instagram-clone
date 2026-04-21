<?php

use App\Models\Post;
use App\Models\User;

it('user can like a post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('posts.like', $post));

    $response->assertRedirect();
    $this->assertDatabaseHas('likes', [
        'user_id' => $user->id,
        'post_id' => $post->id,
    ]);

    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'likes_count' => 1,
    ]);

    expect($post->isLikedBy($user))->toBeTrue();
});

it('user can unlike a post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $this
        ->actingAs($user)
        ->post(route('posts.like', $post));

    $response = $this
        ->actingAs($user)
        ->delete(route('posts.unlike', $post));

    $response->assertRedirect();
    $this->assertDatabaseMissing('likes', [
        'user_id' => $user->id,
        'post_id' => $post->id,
    ]);

    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'likes_count' => 0,
    ]);

    expect($post->fresh()->isLikedBy($user))->toBeFalse();
});

it('user cannot like the same post twice', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $this->actingAs($user)->post(route('posts.like', $post));
    $this->actingAs($user)->post(route('posts.like', $post));

    $this->assertDatabaseCount('likes', 1);
    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'likes_count' => 1,
    ]);
});

it('repeated unlike does not decrement below zero', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $this->actingAs($user)->delete(route('posts.unlike', $post));

    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'likes_count' => 0,
    ]);
});

it('guest cannot like a post', function () {
    $post = Post::factory()->create();

    $response = $this->post(route('posts.like', $post));

    $response->assertRedirect(route('login'));
});

it('isLikedBy returns false for null user', function () {
    $post = Post::factory()->create();

    expect($post->isLikedBy(null))->toBeFalse();
});

it('isLikedBy returns false when user has not liked', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    expect($post->isLikedBy($user))->toBeFalse();
});

it('isLikedBy returns true when user has liked', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $post->likes()->create(['user_id' => $user->id]);

    expect($post->isLikedBy($user))->toBeTrue();
});
