<?php

use App\Jobs\FanoutPostJob;
use App\Models\FeedItem;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Queue;
use Inertia\Testing\AssertableInertia as Assert;

it('shows posts from followed users', function () {
    $user = User::factory()->create();

    $followedUser = User::factory()->create();
    $unFollowedUser = User::factory()->create();

    $user->following()->attach($followedUser);

    $post1 = ['caption' => 'First Post'];
    $post2 = ['caption' => 'Second Post'];

    $this->actingAs($followedUser)->post('/posts', $post1);
    $this->actingAs($unFollowedUser)->post('/posts', $post2);

    // $post1 = Post::factory()->create(['user_id' => $followedUser->id]);
    // $post2 = Post::factory()->create(['user_id' => $unFollowedUser->id]);

    $response = $this->actingAs($user)->get('/feed')->assertOk();

    $this->assertDatabaseCount(FeedItem::class, 1);

    $response->assertSee($post1['caption']);
    $response->assertDontSee($post2['caption']);

    // $response->assertInertia(
    //     fn(Assert $page) => $page
    //         ->component('Feed/Index')
    //         ->has('feed.data', 1) // Verify there is exactly 1 item in the data array
    //         ->where('feed.data.0.post.caption', $post1['caption']) // Access the nested caption directly
    // );

});

it('orders posts by latest', function () {
    $user = User::factory()->create();

    $followedUser = User::factory()->create();

    $user->following()->attach($followedUser);

    $oldPost = ['caption' => 'First Post', 'created_at' => now()->subDay()];
    $newPost = ['caption' => 'Second Post', 'created_at' => now()];

    $this->actingAs($followedUser)->post('/posts', $oldPost);
    $this->actingAs($followedUser)->post('/posts', $newPost);

    $response = $this->actingAs($user)->get('/feed')->assertOk();

    $this->assertDatabaseCount('feed_items', 2);

    $response->assertSeeInOrder(
        [$newPost['caption'], $oldPost['caption']]
    );

});

it('paginates feed results', function () {

    $user = User::factory()->create();
    $followedUser = User::factory()->create();

    $user->following()->attach($followedUser->id);

    Post::factory()->count(15)->create([
        'user_id' => $followedUser->id,
    ])->each(function ($post) {
        FanoutPostJob::dispatch($post);
    });

    $response = $this->actingAs($user)->get('/feed');

    $response->assertOk();
    // $response->assertSee('Next'); // depends on UI

    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('Feed/Index')
            ->has('feed.data', 15)
            ->has('feed.next_page_url')
    );

});

it('pushes posts to followers feed', function () {
    Queue::fake();

    $user = User::factory()->create();
    $follower = User::factory()->create();

    $follower->following()->attach($user->id);

    $postData = ['caption' => 'New Post', 'media' => [
        UploadedFile::fake()->image('photo.jpg'),
    ]];

    $this->actingAs($user)->post('/posts', $postData);

    Queue::assertPushed(FanoutPostJob::class);
});

it('caches feed pages per cursor', function () {
    Cache::flush();

    $user = User::factory()->create();
    $followedUser = User::factory()->create();

    $user->following()->attach($followedUser->id);

    Post::factory()->count(25)->create([
        'user_id' => $followedUser->id,
    ])->each(function ($post) {
        FanoutPostJob::dispatch($post);
    });

    $firstPage = $this->actingAs($user)
        ->getJson(route('feed.index'))
        ->assertOk()
        ->json();

    $secondPage = $this->actingAs($user)
        ->getJson(route('feed.index', ['cursor' => $firstPage['next_cursor']]))
        ->assertOk()
        ->json();

    expect($firstPage['data'])->not->toBe($secondPage['data']);
});
