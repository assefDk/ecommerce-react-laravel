<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subtotal',
        'grand_total',
        'shipping',
        'discount',
        'payment_status',
        'status',
        'name',
        'email',
        'mobile',
        'address',
        'city',
        'state',
        'zip'
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    protected function casts():array
    {
        return [
            'created_at' => 'datetime:d M -Y'
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
