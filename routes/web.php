<?php

use App\Http\Controllers\CarouselController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PaymentController;
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);

    Route::post('/payments', [PaymentController::class, 'store']);
    Route::put('/payments/{id}', [PaymentController::class, 'update']);
    Route::get('/carousels', [CarouselController::class, 'index']);
    Route::delete('/carousels/{id}', [CarouselController::class, 'destroy']);

    Route::post('/carousels', [CarouselController::class, 'store']);
    Route::put('/carousels/{id}', [CarouselController::class, 'update']);
});
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
