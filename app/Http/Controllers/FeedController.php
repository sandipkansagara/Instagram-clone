<?php

namespace App\Http\Controllers;

use App\Domains\Feed\Actions\GetFeed;
use App\Http\Resources\FeedResource;
use App\Models\FeedItem;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class FeedController extends Controller
{
    public function index(Request $request, GetFeed $getFeed) : \Inertia\Response | \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $feed = $getFeed->execute(
            $request->user()->id,
            $request->string('cursor')->toString() ?: null,
        );

        if (request()->wantsJson()) {
            // return FeedResource::collection($feed)->additional([
            //     'max_id' => $request->max_id ?? FeedItem::where('user_id', $request->user()->id)->max('id') ?? 0,
            // ]);

            return FeedResource::collection($feed);
        }

        return inertia('Feed/Index', [
            'feed' => FeedResource::collection($feed),
            //'max_id' => $request->max_id ?? FeedItem::where('user_id', $request->user()->id)->max('id') ?? 0,
        ]);
    }
}
