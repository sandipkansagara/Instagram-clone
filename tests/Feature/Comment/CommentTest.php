<?php

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;

it('user can comment on a post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('posts.comments.store', $post), [
            'body' => 'This is a comment',
        ]);

    $this->assertDatabaseHas('comments', [
        'body' => 'This is a comment',
        'user_id' => $user->id,
        'post_id' => $post->id,
    ]);
    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'comments_count' => 1,
    ]);

});

it('user can delete own comment', function () {
    $user = User::factory()->create();

    $comment = Comment::factory()->create([
        'user_id' => $user->id,
    ]);
    $comment->post->increment('comments_count');

    $this->actingAs($user)
        ->delete(route('comments.destroy', $comment));

    $this->assertDatabaseMissing('comments', [
        'id' => $comment->id,
    ]);
    $this->assertDatabaseHas('posts', [
        'id' => $comment->post_id,
        'comments_count' => 0,
    ]);
});

it('user can not delete other user comment', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $comment = Comment::factory()->create([
        'user_id' => $otherUser->id,
    ]);

    $response = $this->actingAs($user)
        ->delete(route('comments.destroy', $comment));

    $response->assertForbidden();

    $this->assertDatabaseHas('comments', [
        'id' => $comment->id,
    ]);
});

it('user can not delete comment if not authenticated', function () {
    $comment = Comment::factory()->create();
    $response = $this->delete(route('comments.destroy', $comment));
    $response->assertRedirect(route('login'));
    $this->assertDatabaseHas('comments', [
        'id' => $comment->id,
    ]);
});

it('user can reply to comment ', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $parentComment = Comment::factory()->create([
        'post_id' => $post->id,
    ]);

    $response = $this->actingAs($user)
        ->post(route('posts.comments.store', $post), [
            'body' => 'This is reply',
            'parent_id' => $parentComment->id,
        ]);

    $response->assertNoContent();

    $this->assertDatabaseHas(
        'comments',
        [
            'body' => 'This is reply',
            'parent_id' => $parentComment->id,
        ]
    );

});

it('user can not reply to comment from another comment', function () {
    $user = User::factory()->create();

    $post = Post::factory()->create();
    $otherPost = Post::factory()->create();

    $parentComment = Comment::factory()->create([
        'post_id' => $otherPost->id,
    ]);

    $response = $this->actingAs($user)
        ->post(route('posts.comments.store', $post), [
            'body' => 'This is reply',
            'parent_id' => $parentComment->id,
        ]);

    $response->assertSessionHasErrors('parent_id');

});
