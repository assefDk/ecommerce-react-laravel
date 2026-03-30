<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSize;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductController extends Controller
{
    /**
     * GET /products - عرض جميع المنتجات
     */
    public function index()
    {
        $products = Product::with(['category', 'brand', 'product_sizes'])
            ->orderBy('created_at', 'DESC')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ], 200);
    }

    /**
     * POST /products - إنشاء منتج جديد
     */
    public function store(Request $request)
    {
        // التحقق من البيانات
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'content' => 'nullable|string',
            'short_description' => 'nullable|string',
            'category' => 'required|exists:categories,id',
            'brand' => 'nullable|exists:brands,id',
            'qty' => 'nullable|integer|min:0',
            'sku' => 'required|string|unique:products,sku',
            'barcode' => 'nullable|string|max:100',
            'status' => 'required|in:0,1',
            'is_featured' => 'required|in:Yes,No',
            'gallery' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // تحويل status إلى integer
        $status = is_numeric($data['status']) ? (int) $data['status'] : ($data['status'] == '1' ? 1 : 0);

        // إنشاء المنتج
        $product = Product::create([
            'title' => $data['title'],
            'price' => $data['price'],
            'compare_price' => $data['compare_price'] ?? null,
            'description' => $data['content'] ?? null,
            'short_description' => $data['short_description'] ?? null,
            'category_id' => $data['category'],
            'brand_id' => $data['brand'] ?? null,
            'qty' => $data['qty'] ?? 0,
            'sku' => $data['sku'],
            'barcode' => $data['barcode'] ?? null,
            'status' => $status,
            'is_featured' => $data['is_featured'],
            'image' => null // سيتم تحديثه لاحقاً إذا وجدت صور
        ]);

        // معالجة معرض الصور
        if (!empty($data['gallery'])) {
            $manager = new ImageManager(new Driver());

            $tempDir = public_path('uploads/temp/');
            $largeDir = public_path('uploads/products/large/');
            $smallDir = public_path('uploads/products/small/');

            // إنشاء المجلدات إذا لم تكن موجودة
            foreach ([$largeDir, $smallDir] as $dir) {
                if (!file_exists($dir)) {
                    mkdir($dir, 0777, true);
                }
            }

            $firstImage = null; // لتخزين اسم الصورة الأولى

            foreach ($data['gallery'] as $key => $tempImageId) {
                $tempImage = TempImage::find($tempImageId);

                if (!$tempImage) {
                    Log::warning("Temp image not found: {$tempImageId}");
                    continue;
                }

                $tempPath = $tempDir . $tempImage->name;

                if (!file_exists($tempPath)) {
                    Log::warning("Temp file not found: {$tempPath}");
                    $tempImage->delete();
                    continue;
                }

                $extension = strtolower(pathinfo($tempImage->name, PATHINFO_EXTENSION));
                $imageName = $product->id . '-' . uniqid() . '-' . ($key + 1) . '.' . $extension;

                try {
                    // حفظ الصورة بالحجم الكبير (1200px)
                    $img = $manager->read($tempPath);
                    $img->scaleDown(1200);
                    $img->save($largeDir . $imageName);

                    // حفظ الصورة المصغرة (400x460)
                    $img = $manager->read($tempPath);
                    $img->coverDown(400, 460);
                    $img->save($smallDir . $imageName);

                    // حفظ في قاعدة البيانات
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $imageName,
                    ]);

                    // حفظ اسم الصورة الأولى لتكون الصورة الرئيسية
                    if ($key === 0) {
                        $firstImage = $imageName;
                    }

                    // حذف الملف المؤقت
                    if (file_exists($tempPath)) {
                        unlink($tempPath);
                    }

                    // حذف الصورة المصغرة المؤقتة
                    $tempThumbPath = public_path('uploads/temp/thumb/' . $tempImage->name);
                    if (file_exists($tempThumbPath)) {
                        unlink($tempThumbPath);
                    }

                    $tempImage->delete();

                } catch (\Exception $e) {
                    Log::error("Failed to process image {$tempImage->name}: " . $e->getMessage());
                    continue;
                }
            }

            // تحديث حقل image في المنتج بأول صورة
            if ($firstImage) {
                $product->update(['image' => $firstImage]);
            }
        }


        if(!empty($request->sizes)){
            foreach($request->sizes as $sizeId){
                $productSize = new ProductSize();
                $productSize->product_id = $product->id;
                $productSize->size_id = $sizeId;
                $productSize->save();
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Product created successfully',
            'product_id' => $product->id,
            'product' => $product->load(['category', 'brand', 'images'])
        ], 201);
    }

    /**
     * GET /products/{id} - عرض منتج محدد
     */
    public function show($id)
    {
        $product = Product::with(['category', 'brand','product_sizes'])->find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $productSizes = $product->product_sizes()->pluck('size_id');


        return response()->json([
            'status' => 200,
            'data' => $product,
            'sizes' => $productSizes
        ], 200);
    }

    /**
     * PUT /products/{id} - تحديث منتج
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'content' => 'nullable|string',
            'short_description' => 'nullable|string',
            'category' => 'required|exists:categories,id',
            'brand' => 'nullable|exists:brands,id',
            'qty' => 'nullable|integer|min:0',
            'sku' => 'required|string|unique:products,sku,' . $id,
            'barcode' => 'nullable|string|max:100',
            'status' => 'required|in:0,1',
            'is_featured' => 'required|in:Yes,No',
            'gallery' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        $status = is_numeric($data['status']) ? (int) $data['status'] : ($data['status'] == '1' ? 1 : 0);

        // تحديث بيانات المنتج
        $product->update([
            'title' => $data['title'],
            'price' => $data['price'],
            'compare_price' => $data['compare_price'] ?? null,
            'description' => $data['content'] ?? null,
            'short_description' => $data['short_description'] ?? null,
            'category_id' => $data['category'],
            'brand_id' => $data['brand'] ?? null,
            'qty' => $data['qty'] ?? 0,
            'sku' => $data['sku'],
            'barcode' => $data['barcode'] ?? null,
            'status' => $status,
            'is_featured' => $data['is_featured'],
        ]);

        /*
        =========================
        معالجة الصور (مثل store)
        =========================
        */
        if (!empty($data['gallery'])) {

            $manager = new ImageManager(new Driver());

            $tempDir = public_path('uploads/temp/');
            $largeDir = public_path('uploads/products/large/');
            $smallDir = public_path('uploads/products/small/');

            foreach ([$largeDir, $smallDir] as $dir) {
                if (!file_exists($dir)) {
                    mkdir($dir, 0777, true);
                }
            }

            $firstImage = null;

            foreach ($data['gallery'] as $key => $tempImageId) {

                $tempImage = TempImage::find($tempImageId);

                if (!$tempImage) {
                    continue;
                }

                $tempPath = $tempDir . $tempImage->name;

                if (!file_exists($tempPath)) {
                    $tempImage->delete();
                    continue;
                }

                $extension = strtolower(pathinfo($tempImage->name, PATHINFO_EXTENSION));
                $imageName = $product->id . '-' . uniqid() . '-' . ($key + 1) . '.' . $extension;

                try {

                    // large
                    $img = $manager->read($tempPath);
                    $img->scaleDown(1200);
                    $img->save($largeDir . $imageName);

                    // small
                    $img = $manager->read($tempPath);
                    $img->coverDown(400, 460);
                    $img->save($smallDir . $imageName);

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $imageName,
                    ]);

                    if ($key === 0) {
                        $firstImage = $imageName;
                    }

                    // حذف المؤقت
                    unlink($tempPath);

                    $thumb = public_path('uploads/temp/thumb/' . $tempImage->name);
                    if (file_exists($thumb)) {
                        unlink($thumb);
                    }

                    $tempImage->delete();

                } catch (\Exception $e) {
                    Log::error("Image update failed: " . $e->getMessage());
                }
            }

            // تحديث الصورة الرئيسية إذا تم رفع صور جديدة
            if ($firstImage) {
                $product->update(['image' => $firstImage]);
            }
        }

        if(!empty($request->sizes)){
            ProductSize::where('product_id', $product->id)->delete();
            foreach($request->sizes as $sizeId){
                $productSize = new ProductSize();
                $productSize->product_id = $product->id;
                $productSize->size_id = $sizeId;
                $productSize->save();
            }
        }
        
        return response()->json([
            'status' => 200,
            'message' => 'Product updated successfully',
            'product' => $product->load(['category', 'brand', 'images'])
        ], 200);
    }

    /**
     * DELETE /products/{id} - حذف منتج
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        // حذف الصور المرتبطة بالمنتج
        if ($product->images) {
            foreach ($product->images as $image) {
                // حذف الملفات الفعلية
                $largePath = public_path('uploads/products/large/' . $image->image);
                $smallPath = public_path('uploads/products/small/' . $image->image);

                if (file_exists($largePath)) {
                    unlink($largePath);
                }
                if (file_exists($smallPath)) {
                    unlink($smallPath);
                }

                $image->delete();
            }
        }

        // حذف الصورة الرئيسية
        if ($product->image) {
            $mainImagePath = public_path('uploads/products/large/' . $product->image);
            if (file_exists($mainImagePath)) {
                unlink($mainImagePath);
            }
        }

        $product->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Product deleted successfully'
        ], 200);
    }

    public function deleteImage($id)
    {
        $image = ProductImage::find($id);

        if (!$image) {
            return response()->json([
                'status' => false,
                'message' => 'Image not found'
            ], 404);
        }

        // حذف الملفات الفعلية
        $largePath = public_path('uploads/products/large/' . $image->image);
        $smallPath = public_path('uploads/products/small/' . $image->image);

        if (file_exists($largePath)) {
            unlink($largePath);
        }
        if (file_exists($smallPath)) {
            unlink($smallPath);
        }

        // إذا كانت هذه الصورة هي الصورة الرئيسية للمنتج
        $product = $image->product;
        if ($product && $product->image === $image->image) {
            $product->update(['image' => null]);
        }

        $image->delete();

        return response()->json([
            'status' => true,
            'message' => 'Image deleted successfully'
        ], 200);
    }


}


