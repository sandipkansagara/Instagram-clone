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
        Schema::table('feed_items', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex('feed_items_user_id_created_at_index');
            $table->dropIndex(['created_at']);

            $table->foreign('user_id')->references('id')->on('users')
                ->cascadeOnDelete();

        });
        
        DB::statement('ALTER TABLE `feed_items` ADD INDEX `feed_items_user_id_id_desc_index` (`user_id` ASC, `id` DESC)');
    }

};
