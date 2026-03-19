<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('follows', function (Blueprint $table) {
            $table->id();
            $table->integer('follower_id');
            $table->integer('following_id');
            $table->timestamps();

            $table->unique(['follower_id', 'following_id']);

            $table->index('follower_id');
        });
    }
};
