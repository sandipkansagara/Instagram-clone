<?php

use App\Models\Post;
use App\Models\User;

it('user can comment on a post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('posts.comments.store', $post), [
            'body' => 'This is a great post!',
        ]);

    $this->assertDatabaseHas('comments', [
        'body' => 'This is a great post!',
        'user_id' => $user->id,
        'post_id' => $post->id,
    ]);
});

it('guest cannot comment on a post', function () {
    $post = Post::factory()->create();

    $response = $this->post(route('posts.comments.store', $post), [
        'body' => 'This is a comment',
    ]);

    $response->assertRedirect(route('login'));
});

it('comment body is required', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('posts.comments.store', $post), [
            'body' => '',
        ]);

    $response->assertSessionHasErrors('body');
});

it('post can have multiple comments', function () {
    $post = Post::factory()->create();
    $user = User::factory()->create();

    $post->comments()->create([
        'body' => 'First comment',
        'user_id' => $user->id,
    ]);
    $post->comments()->create([
        'body' => 'Second comment',
        'user_id' => $user->id,
    ]);

    expect($post->fresh()->comments)->toHaveCount(2);
});
