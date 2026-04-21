<?php

namespace App\Http\Controllers;

use App\Domains\Feed\Actions\GetFeed;
use Illuminate\Http\Request;

class FeedController extends Controller
{
    public function index(Request $request, GetFeed $getFeed)
    {
        $feed = $getFeed->execute(
            $request->user()->id,
            $request->string('cursor')->toString() ?: null,
        );

        if (request()->wantsJson()) {
            return response()->json($feed);
        }

        return inertia('Feed/Index', [
            'feed' => $feed,
        ]);
    }
}
