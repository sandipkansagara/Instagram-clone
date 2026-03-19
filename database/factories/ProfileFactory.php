<?php

namespace Database\Factories;

use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profile>
 */
class ProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'username' => Str::slug($this->faker->unique()->userName()) . rand(100, 999),
            'bio' => $this->faker->sentence(),
        ];
    }

    /**
     * Configure the factory to derive username from the parent User when present.
     */
    public function configure(): self
    {
        return $this->afterCreating(function (Profile $profile) {
            $user = $profile->user()->first();

            if ($user instanceof User) {
                $profile->username = Str::slug($user->name) . rand(100, 999);
                $profile->save();
            }
        });
    }
}
