<?php

namespace App\Domains\Post\Actions;

use App\Jobs\FanoutPostJob;
use App\Jobs\ProcessMediaJob;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreatePostAction
{
    public function execute(User $user, array $data)
    {
        DB::transaction(function () use ($user, $data) {
            $post = $user->posts()->create([
                'caption' => $data['caption'] ?? null,
            ]);

            foreach ($data['media'] as $file) {
                // Store the uploaded file first so the queued job doesn't need to serialize
                // the UploadedFile instance (which isn't serializable).
                $path = $file->store('posts', 'public');

                ProcessMediaJob::dispatch($post, $path);
            }

            $user->profile()->increment('posts_count');

            FanoutPostJob::dispatch($post);

            return $post;
        });
    }
}
