<?php

namespace App\Http\Controllers;

use App\Domains\Post\Actions\CreatePost;
use App\Domains\Post\Actions\GetPost;
use App\Domains\Post\Actions\ListPosts;
use App\Http\Requests\StorePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Inertia\Inertia;
class PostController extends Controller
{
    public function index(ListPosts $listPosts): \Inertia\Response|AnonymousResourceCollection
    {
        $posts = $listPosts->execute(auth()->user());

        if (request()->wantsJson() && !request()->hasHeader('X-Inertia')) {
            return PostResource::collection($posts);
        }

        return Inertia::render('Posts/Index', [
            'posts' => PostResource::collection($posts),
        ]);
    }

    public function store(StorePostRequest $request, CreatePost $createPost): \Illuminate\Http\JsonResponse
    {
        $post = $createPost->execute(auth()->user(), $request->validated());

        return response()->json($post, 201);
    }

    public function show(Post $post, GetPost $getPost): \Inertia\Response
    {
        $post = $getPost->execute($post->id);

        return Inertia::render('Posts/Show', compact('post'));
    }
    // TODO: Implement update and delete methods for posts with proper cache invalidation

}
