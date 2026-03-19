<?php

use App\Events\MessageSent;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');

    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');

    Route::get('/feed', [FeedController::class, 'index'])->name('feed.index');

    Route::post('/posts/{post}/like', [LikeController::class, 'store'])->name('posts.like');

    Route::delete('/posts/{post}/like', [LikeController::class, 'destroy'])->name('posts.unlike');

    Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->name('posts.comments.store');

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');

    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');

    Route::get('/{username}', [ProfileController::class, 'show'])->name('profile.show');

    Route::post('/users/{user}/follow', [FollowController::class, 'store'])->name('follow');

    Route::delete('/users/{user}/follow', [FollowController::class, 'destroy'])->name('unfollow');

});



require __DIR__ . '/settings.php';
