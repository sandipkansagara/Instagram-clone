<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'username',
        'bio',
        'avatar',
        'followers_count',
        'following_count',
        'posts_count',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
