<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Str;

/**
 * @extends Factory<DatabaseNotification>
 */
class NotificationFactory extends Factory
{
    protected $model = DatabaseNotification::class;

    public function definition(): array
    {
        return [
            'id' => Str::uuid()->toString(),
            'type' => 'App\\Notifications\\ActivityNotification',
            'notifiable_type' => 'user',
            'notifiable_id' => User::factory(),
            'data' => [],
            'read_at' => null,
        ];
    }

    /** State for liking a post */
    public function likedPost(User $actor, Post $post)
    {
        return $this->state(fn (array $attributes) => [
            'data' => [
                'actor_id' => $actor->id,
                'actor_name' => $actor->name,
                'action' => 'liked',
                'subject_type' => 'like',
                'subject_id' => Like::factory(),
                'target_type' => 'post',
                'target_id' => $post->id,
            ],
        ]);
    }

    /** State for commenting on a post */
    public function commentedOnPost(User $actor, Post $post)
    {
        return $this->state(fn (array $attributes) => [
            'data' => [
                'actor_id' => $actor->id,
                'actor_name' => $actor->name,
                'action' => 'commented',
                'subject_type' => 'comment',
                'subject_id' => Comment::factory(),
                'target_type' => 'post',
                'target_id' => $post->id,
            ],
        ]);
    }

    /** State for following a user */
    public function followed(User $actor)
    {
        return $this->state(fn (array $attributes) => [
            'data' => [
                'actor_id' => $actor->id,
                'actor_name' => $actor->name,
                'action' => 'followed',
                'subject_type' => 'user',
                'subject_id' => $actor->id,
                'target_type' => null,
                'target_id' => null,
            ],
        ]);
    }
}
