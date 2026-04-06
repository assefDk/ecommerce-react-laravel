<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingCharge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ShippingContoller extends Controller
{
    public function getShipping()
    {
        $shipping = ShippingCharge::first();

        return response()->json([
            'status' => 200,
            'data' => $shipping 
        ], 200);
    }
    public function updateShipping(Request $request)
    {
        $Vialidator = Validator::make($request->all(), [
            'shipping_charge' => 'required|numeric'
        ]);

        if ($Vialidator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $Vialidator->errors()
            ], 400);
        }

        ShippingCharge::updateOrInsert(
            ['id' => 1],
            ['shipping_charge' => $request->shipping_charge]
        );

        return response()->json([
            'status' => 200,
            'message' => "Shipping charge updated successfully"
        ], 200);
    }



    
}
