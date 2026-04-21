<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class FollowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($this->user()?->is($this->route('user'))) {
                    $validator->errors()->add('user', 'You cannot follow yourself.');
                }
            },
        ];
    }
}
