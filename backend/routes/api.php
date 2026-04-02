<?php

use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\admin\BrandController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\SizeController;
use App\Http\Controllers\admin\TempImageContoller;
use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\ProductFrontContoller;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::post('/admin/login', [AuthController::class, 'authenticate'])->name('admin.auth');


// front
Route::get('get-latest-porducts', [ProductFrontContoller::class, 'latestProducts']);
Route::get('get-featured-porducts', [ProductFrontContoller::class, 'featuredProducts']);
Route::get('get-categories', [ProductFrontContoller::class, 'grtCategories']);
Route::get('get-brands', [ProductFrontContoller::class, 'grtBrands']);
Route::get('get-products', [ProductFrontContoller::class, 'grtProducts']);
Route::get('get-product/{id}', [ProductFrontContoller::class, 'grtProduct']);
// auht customer
Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'authenticate']);






Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::resource('categories', CategoryController::class);
    Route::resource('brands', BrandController::class);
    Route::get('sizes', [SizeController::class, 'index']);
    Route::resource('products', ProductController::class);
    Route::delete('products/images/{id}', [ProductController::class, 'deleteImage']);
    Route::post('temp-images', [TempImageContoller::class, 'store']);
    Route::delete('temp-images/{id}', [TempImageContoller::class, 'destroy']);

    


});

