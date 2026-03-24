<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Brand;
use Illuminate\Support\Facades\Validator;

class BrandController extends Controller
{
     /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = Brand::orderBy('id', 'DESC')->get();
        return response()->json([
            'status' => 200,
            'data' => $brands
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validateData = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validateData->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validation failed',
                'errors' => $validateData->errors()
            ], 422);
        }

        $brand = new Brand();
        $brand->name = $request->name;
        $brand->status = $request->status;
        $brand->save();

        return response()->json([
            'status' => 200,
            'message' => 'Brand added successfully',
            'data' => $brand
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json([
                'status' => 404,
                'message' => 'Brand not found',
                'data' => []
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $brand
        ], 200);
    }

 

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validateData = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validateData->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validation failed',
                'errors' => $validateData->errors()
            ], 422);
        }

        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json([
                'status' => 404,
                'message' => 'Brand not found',
                'data' => []
            ], 404);
        }

        $brand->name = $request->name;
        $brand->status = $request->status;
        $brand->save();

        return response()->json([
            'status' => 200,
            'message' => 'Brand updated successfully',
            'data' => $brand
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json([
                'status' => 404,
                'message' => 'Brand not found',
                'data' => []
            ], 404);
        }

        $brand->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Brand deleted successfully',
            'data' => []
        ], 200);
    }
}
