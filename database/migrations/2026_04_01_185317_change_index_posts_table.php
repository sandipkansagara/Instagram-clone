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
        Schema::table('posts', function (Blueprint $table) {
            // Drop the foreign key first using its column name in an array
            $table->dropForeign(['user_id']);

            // Now you can safely drop the index
            $table->dropIndex('posts_user_id_created_at_index');

            $table->foreign('user_id')->references('id')->on('users')
                ->cascadeOnDelete();

            $table->index(['user_id', 'created_at', 'id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            //
        });
    }
};
