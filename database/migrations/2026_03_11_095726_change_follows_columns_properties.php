<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('follows', function (Blueprint $table) {
            $table->unsignedInteger('follower_id')->change();
            $table->foreign('follower_id')->references('id')->on('users')
                ->cascadeOnDelete();

            $table->unsignedInteger('following_id')->change();
            $table->foreign('following_id')->references('id')->on('users')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('follows', function (Blueprint $table) {
            //
        });
    }
};
