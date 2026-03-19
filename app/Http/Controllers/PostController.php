<?php

namespace App\Http\Controllers;

use App\Domains\Post\Actions\CreatePostAction;
use App\Domains\Post\Actions\ShowPost;
use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use Illuminate\Support\Facades\Redis;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(): Response
    {
        $posts = auth()->user()->posts()->with('media', 'likes', 'comments.user', 'comments.replies')->latest()->paginate(10);

        //For each post, we can initialize the like count in Redis for real-time updates
        foreach ($posts as $post) {
            Redis::setnx("post:{$post->id}:likes", $post->likes_count);
        }

        return Inertia::render('Posts/Index', compact('posts'));
    }
    public function store(StorePostRequest $request, CreatePostAction $action)
    {
        $data = $request->validated();
        $action->execute(auth()->user(), $data);

        return redirect()->back();
    }

    public function show(Post $post, ShowPost $showPost): Response
    {
        $post = $showPost->execute($post->id);

        return Inertia::render('Posts/Show', compact('post'));
    }
    //TODO: Implement update and delete methods for posts with proper cache invalidation

}
