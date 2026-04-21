<?php

namespace App\Http\Controllers;

use App\Domains\Post\Actions\CreatePost;
use App\Domains\Post\Actions\GetPost;
use App\Domains\Post\Actions\ListPosts;
use App\Http\Requests\StorePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(ListPosts $listPosts): mixed
    {
        $posts = $listPosts->execute(auth()->user());

        if (request()->wantsJson() && ! request()->hasHeader('X-Inertia')) {
            return PostResource::collection($posts);
        }

        return Inertia::render('Posts/Index', [
            'posts' => PostResource::collection($posts),
        ]);
    }

    public function store(StorePostRequest $request, CreatePost $createPost)
    {
        $post = $createPost->execute(auth()->user(), $request->validated());

        return response()->json($post, 201);
    }

    public function show(Post $post, GetPost $getPost): Response
    {
        $post = $getPost->execute($post->id);

        return Inertia::render('Posts/Show', compact('post'));
    }
    // TODO: Implement update and delete methods for posts with proper cache invalidation

}
