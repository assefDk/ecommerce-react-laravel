<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;


class ProductController extends Controller
{
    // GET /products
    public function index()
    {
        $products = Product::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ],200);
    }

    // POST /products
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'price' => 'required|numeric',
            'compare_price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'exists:brands,id',
            'qty' => 'nullable|integer',
            'sku' => 'required|string|unique:products,sku',
            'barcode' => 'nullable|string',
            'status' => 'required|integer',
            'is_featured' => 'required|in:yes,no',
            'gallery' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // إنشاء المنتج أولاً
        $product = Product::create([
            'title' => $request->title,
            'price' => $request->price,
            'compare_price' => $request->compare_price,
            'description' => $request->description,
            'short_description' => $request->short_description,
            'category_id' => $request->category_id,
            'brand_id' => $request->brand_id,
            'qty' => $request->qty,
            'sku' => $request->sku,
            'barcode' => $request->barcode,
            'status' => $request->status,
            'is_featured' => $request->is_featured,
        ]);

        // معالجة الصور
        if ($request->filled('gallery')) {

            $manager = new ImageManager(new Driver());

            foreach ($request->gallery as $key => $tempImageId) {

                $tempImage = TempImage::find($tempImageId);

                // إذا لم توجد الصورة المؤقتة نتجاوزها
                if (!$tempImage) {
                    continue;
                }

                $tempPath = public_path('uploads/temp/' . $tempImage->name);

                // إذا الملف غير موجود على القرص نتجاوز
                if (!file_exists($tempPath)) {
                    continue;
                }

                // استخراج الامتداد
                $ext = pathinfo($tempImage->name, PATHINFO_EXTENSION);

                // اسم الصورة النهائي
                $imageName = $product->id . '-' . time() . '-' . $key . '.' . $ext;

                // ======================
                // Large Image
                // ======================
                $img = $manager->read($tempPath);
                $img->scaleDown(1200);
                $img->save(public_path('uploads/products/large/' . $imageName));

                // ======================
                // Small Image
                // ======================
                $img = $manager->read($tempPath);
                $img->coverDown(400, 460);
                $img->save(public_path('uploads/products/small/' . $imageName));

                // أول صورة تصبح الصورة الرئيسية للمنتج
                if ($key == 0) {
                    $product->image = $imageName;
                    $product->save();
                }

                // حذف الصورة المؤقتة بعد النقل
                unlink($tempPath);
                $tempImage->delete();
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Product created successfully',
            'product_id' => $product->id
        ], 201);
    }

    // GET single product
    public function show($id)
    {
        $product = Product::with(['category', 'brand'])->find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $product
        ]);
    }

    // PUT /products/{id}
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
            'price' => 'required|numeric',
            'compare_price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'image' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'qty' => 'nullable|integer',
            'sku' => 'required|string|unique:products,sku,' . $id,
            'barcode' => 'nullable|string',
            'status' => 'required|integer',
            'is_featured' => 'in:yes,no'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $product->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Product updated successfully',
        ]);
    }

    // DELETE /products/{id}
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $product->delete();

        return response()->json([
            'status' => true,
            'message' => 'Product deleted successfully'
        ]);
    }
}
