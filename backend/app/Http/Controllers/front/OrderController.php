<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function saveOrder(Request $request)
    {
        try {
            // تسجيل البيانات للتصحيح
            Log::info('Order Data:', $request->all());
            
            // التحقق من وجود المستخدم
            if (!$request->user()) {
                return response()->json([
                    'status' => 401,
                    'message' => 'User not authenticated'
                ], 401);
            }
            
            if (!empty($request->cart)) {
                DB::beginTransaction();
                
                $order = new Order();
                $order->name = $request->name;
                $order->email = $request->email;
                $order->mobile = $request->mobile;
                $order->address = $request->address;
                $order->city = $request->city;
                $order->state = $request->state; // هذه هي المدينة/الولاية من الفورم
                $order->zip = $request->zip;
                $order->subtotal = $request->subtotal;
                $order->grand_total = $request->grand_total;
                $order->shipping = $request->shipping;
                $order->discount = $request->discount ?? 0;
                $order->user_id = $request->user()->id;
                $order->payment_status = $request->payment_status ?? 'not paid';
                $order->status = 'pending'; // حالة الطلب (pending, shipped, etc)
                $order->save();

                foreach ($request->cart as $item) {
                    $orderItem = new OrderItem();
                    $orderItem->product_id = $item['product_id'] ?? $item['id'];
                    $orderItem->order_id = $order->id;
                    $orderItem->name = $item['name'] ?? $item['title'];
                    $orderItem->size = $item['size'] ?? 'N/A';
                    $orderItem->price = $item['price'] * $item['qty'];
                    $orderItem->unit_price = $item['unit_price'];
                    $orderItem->qty = $item['qty'];
                    $orderItem->save();
                }
                
                DB::commit();

                return response()->json([
                    'status' => 200,
                    'message' => "Your order has been placed successfully",
                    'order_id' => $order->id
                ], 200);
            } else {
                return response()->json([
                    'status' => 400,
                    'message' => "Your cart is empty"
                ], 400);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order Error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => 500,
                'message' => 'Error: ' . $e->getMessage(),
                'line' => $e->getLine(),
                'file' => basename($e->getFile())
            ], 500);
        }
    }

    
}