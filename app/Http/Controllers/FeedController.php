<?php

namespace App\Http\Controllers;

use App\Domains\Feed\Services\FeedService;
use App\Models\FeedItem;
use Illuminate\Http\Request;

class FeedController extends Controller
{
    public function index(FeedService $feedService)
    {
        // get the latest 20 feed items with post and corresponding user and media for the authenticated user

        $feed = $feedService->getFeed(auth()->id());

        return inertia('Feed/Index', [
            'feed' => $feed,
        ]);
    }
}
