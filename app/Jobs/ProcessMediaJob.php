<?php

namespace App\Jobs;

use App\Models\Post;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ProcessMediaJob implements ShouldQueue
{
    use Dispatchable, Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Post $post, public string $path)
    {
        // Path to already-stored uploaded file on the disk
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $disk = Storage::disk('public');
        $mime = $disk->mimeType($this->path) ?: 'application/octet-stream';

        $this->post->media()->create([
            'type' => $mime,
            'path' => $this->path,
        ]);
    }
}
