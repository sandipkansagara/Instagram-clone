<?php

namespace App\Domains\Post\Actions;

use App\Jobs\FanoutPostJob;
use App\Jobs\ProcessMediaJob;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class CreatePost
{
    /**
     * @param  array{caption?: ?string, media?: array<int, UploadedFile>}  $data
     * 
     */
    public function execute(User $user, array $data): Post
    {
        return DB::transaction(function () use ($user, $data): Post {
            /** @var \App\Models\Post $post */
            $post = $user->posts()->create([
                'caption' => $data['caption'] ?? null,
            ]);

            foreach ($data['media'] ?? [] as $file) {
                $path = $file->store('posts', 'public');

                ProcessMediaJob::dispatch($post, $path);
            }

            $user->profile()->increment('posts_count');

            FanoutPostJob::dispatch($post);

            return $post;
        });
    }
}
