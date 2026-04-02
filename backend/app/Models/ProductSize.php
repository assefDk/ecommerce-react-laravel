<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ProductSize extends Pivot
{
    protected $table = 'product_sizes';

    protected $fillable = [
        'product_id',
        'size_id',
        'stock' // مثال: إذا بدك تضيف كمية لكل مقاس
    ];

    /**
     * العلاقة مع المنتج
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * العلاقة مع المقاس
     */
    public function size()
    {
        return $this->belongsTo(Size::class);
    }
}