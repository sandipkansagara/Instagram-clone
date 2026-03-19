<?php

namespace App\Console\Commands;

use App\Events\NotificationCreated;
use Illuminate\Console\Command;

class Notification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $notification = \App\Models\Notification::create([
            'user_id' => 2,
            'type' => 'post_liked',
            'data' => json_encode([
                'actor_id' => 2,
                'post_id' => 3,
            ]),
        ]);

        NotificationCreated::dispatch($notification);
    }
}
