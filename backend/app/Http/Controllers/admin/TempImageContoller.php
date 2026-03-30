<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class TempImageContoller extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $image = $request->file('image');
        
        // إنشاء المجلدات إذا لم تكن موجودة
        $tempDir = public_path('uploads/temp');
        $thumbDir = public_path('uploads/temp/thumb');
        
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0777, true);
        }
        
        if (!file_exists($thumbDir)) {
            mkdir($thumbDir, 0777, true);
        }
        
        // إنشاء اسم فريد للصورة
        $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
        
        // نقل الصورة إلى مجلد temp
        $image->move($tempDir, $imageName);
        
        // حفظ في قاعدة البيانات
        $tempImage = new TempImage();
        $tempImage->name = $imageName;
        $tempImage->save();
        
        // إنشاء الصورة المصغرة (thumbnail)
        try {
            $manager = new ImageManager(new Driver());
            $img = $manager->read($tempDir . '/' . $imageName);
            $img->cover(400, 450);
            $img->save($thumbDir . '/' . $imageName);
        } catch (\Exception $e) {
            // إذا فشل إنشاء الصورة المصغرة، لا نوقف العملية
            \Log::error('Thumbnail creation failed: ' . $e->getMessage());
        }
        
        return response()->json([
            'status' => 200,
            'message' => 'Image has been uploaded successfully',
            'data' => [
                'id' => $tempImage->id,
                'name' => $imageName
            ]
        ], 200);
    }
    
    public function destroy($id)
    {
        $tempImage = TempImage::find($id);
        
        if (!$tempImage) {
            return response()->json([
                'status' => false,
                'message' => 'Image not found'
            ], 404);
        }
        
        // حذف الملف الأصلي
        $originalPath = public_path('uploads/temp/' . $tempImage->name);
        if (file_exists($originalPath)) {
            unlink($originalPath);
        }
        
        // حذف الصورة المصغرة
        $thumbPath = public_path('uploads/temp/thumb/' . $tempImage->name);
        if (file_exists($thumbPath)) {
            unlink($thumbPath);
        }
        
        // حذف من قاعدة البيانات
        $tempImage->delete();
        
        return response()->json([
            'status' => true,
            'message' => 'Image deleted successfully'
        ]);
    }
    
}
