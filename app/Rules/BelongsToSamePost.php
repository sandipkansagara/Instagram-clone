<?php

namespace App\Rules;

use App\Models\Comment;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class BelongsToSamePost implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $parent = Comment::find($value);
        if (! $parent || $parent->post_id !== request()->route('post')->id) {
            $fail('The selected parent comment does not belong to this post.');
        }
    }
}
