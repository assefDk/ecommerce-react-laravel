<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    /**
     * The attributes that are mass assignable.
     * 
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'image'
    ];
    
    /**
     * The attributes that should be cast.
     * 
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    /**
     * Get the product that owns the image.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
    /**
     * Accessor to get full image URL
     */
    public function getImageUrlAttribute()
    {
        return asset('uploads/products/large/' . $this->image);
    }
    
    /**
     * Accessor to get thumbnail URL
     */
    public function getThumbUrlAttribute()
    {
        return asset('uploads/products/small/' . $this->image);
    }


    
}