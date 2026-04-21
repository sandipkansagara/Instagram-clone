<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Profile;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create 100 users, each with one profile (profile username will derive from user name)
        $users = User::factory(100)->has(Profile::factory())->create();

        $users->each(function ($user) use ($users) {
            $user->following()->attach(
                $users->random(rand(1, 10))->pluck('id')->toArray()
            );
        });

        Post::factory(1000)
            ->recycle($users)
            ->create();

        // 3. Seed the Feed Table
        // For every user, find what their "following" posted and add it to their feed
        $users->each(function ($user) {
            $followingIds = $user->following()->pluck('following_id');

            $postsToSee = Post::whereIn('user_id', $followingIds)
                ->limit(10)
                ->get();

            $data = [];

            foreach ($postsToSee as $post) {
                $data[] = [
                    'user_id' => $user->id,
                    'post_id' => $post->id,
                    'created_at' => now(),
                ];
            }

            \DB::table('feed_items')->insert($data);
        });

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
