<?php

use App\Models\Media;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('user can create a post', function () {
    $this->withoutExceptionHandling();

    Storage::fake('public');

    $user = User::factory()->create();

    $images = [
        UploadedFile::fake()->image('test.jpg'),
    ];

    $response = $this
        ->actingAs($user)
        ->post(route('posts.store'), [
            'caption' => 'This is a test post',
            'media' => $images,
        ]);

    // $response->assertStatus(201);
    $this->assertDatabaseHas('posts', [
        'caption' => 'This is a test post',
        'user_id' => $user->id,
    ]);

    $this->assertDatabaseHas('media', [
        'post_id' => Post::first()->id,
        'type' => 'image/jpeg',
        'path' => Media::first()->path,
    ]);

    Storage::disk('public')->assertExists(Media::first()->path);

});

// caption is required to create a post
it('caption is required to create a post', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('posts.store'), [
            'caption' => null,
        ]);

    $response->assertSessionHasErrors('caption');
});

it('fails if file is not an image', function () {
    $user = User::factory()->create();

    $files = [
        UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
    ];

    $response = $this
        ->actingAs($user)
        ->post(route('posts.store'), [
            'caption' => 'This is a test post',
            'media' => $files,
        ]);

    $response->assertSessionHasErrors('media.0');
});

it('fails if file is larger than 10MB', function () {
    $user = User::factory()->create();

    $files = [
        UploadedFile::fake()->create('large_image.jpg', 11000, 'image/jpeg'),
    ];

    $response = $this
        ->actingAs($user)
        ->post(route('posts.store'), [
            'caption' => 'This is a test post',
            'media' => $files,
        ]);

    $response->assertSessionHasErrors('media.0');
});

it('fails to create post if user is not authenticated', function () {
    $response = $this
        ->post(route('posts.store'), [
            'caption' => 'This is a test post',
        ]);

    $response->assertRedirect(route('login'));
});

it('fails if caption is greater than 255', function () {
    $user = User::factory()->create()->refresh();

    $response = $this
        ->actingAs($user)
        ->post(route('posts.store'), [
            'caption' => str_repeat('a', 300),
        ]);

    $response->assertSessionHasErrors('caption');

});

it('user can upload multiple images', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $images = [
        UploadedFile::fake()->image('test1.jpg'),
        UploadedFile::fake()->image('test2.jpg'),
        UploadedFile::fake()->image('test3.jpg'),
    ];

    $this
        ->actingAs($user)
        ->post(route('posts.store'), [
            'caption' => 'Multiple images post',
            'media' => $images,
        ]);

    $this->assertDatabaseHas('posts', [
        'caption' => 'Multiple images post',
        'user_id' => $user->id,
    ]);

    $post = Post::where('caption', 'Multiple images post')->first();

    expect($post->media)->toHaveCount(3);

    foreach ($post->media as $media) {
        Storage::disk('public')->assertExists($media->path);
    }
});

it('user can view their posts index', function () {
    $user = User::factory()->create();
    $posts = Post::factory()->count(3)->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($user)
        ->get(route('posts.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Posts/Index')
        ->has('posts.data', 3)
    );
});

it('user can view a single post', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $user->id]);

    $image = UploadedFile::fake()->image('test.jpg');
    $post->media()->create([
        'path' => $image->store('posts', 'public'),
        'type' => 'image/jpeg',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('posts.show', $post));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Posts/Show')
        ->has('post')
        ->where('post.id', $post->id)
        ->where('post.caption', $post->caption)
    );
});

it('post belongs to a user', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $user->id]);

    expect($post->user)->toBeInstanceOf(User::class);
    expect($post->user->id)->toBe($user->id);
});

it('post has media relationship', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $user->id]);

    $image = UploadedFile::fake()->image('test.jpg');
    $post->media()->create([
        'path' => $image->store('posts', 'public'),
        'type' => 'image/jpeg',
    ]);

    expect($post->media)->toHaveCount(1);
    expect($post->media->first())->toBeInstanceOf(Media::class);
});
