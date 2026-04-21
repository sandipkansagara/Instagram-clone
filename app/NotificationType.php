<?php

namespace App;

enum NotificationType: string
{
    case LIKED = 'liked';
    case COMMENTED = 'commented';
    case FOLLOWED = 'followed';

    public static function getAllActions(): array
    {
        return array_map(fn ($type) => $type->value, self::cases());
    }
}
