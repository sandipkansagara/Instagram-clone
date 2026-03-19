<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeedItem extends Model
{
    protected $fillable = ['user_id', 'post_id', 'created_at'];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
