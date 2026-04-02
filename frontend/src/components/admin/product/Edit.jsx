import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../common/Sidebar";
import Layout from "../../common/Layout";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { adminToken, apiUrl } from "../../common/http";
import JoditEditor from "jodit-react";

const Edit = ({ placeholder }) => {
  const editor = useRef(null);
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [disable, setDisable] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [sizeChecked, setSizeChecked] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typings...",
      height: 400,
    }),
    [placeholder],
  );

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm();

  // جلب بيانات المنتج للتعديل
  const fetchProduct = async () => {
    try {
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });
      const result = await res.json();

      // console.log(result.data.product_sizes);
      setSizeChecked(
        result.data.product_sizes
          ? result.data.product_sizes.map((ps) => Number(ps.size_id))
          : [],
      );
      if (result.status === 200) {
        const product = result.data;

        console.log(product);
        setValue("title", product.title);
        setValue("price", product.price);
        setValue("compare_price", product.compare_price || "");
        setValue("short_description", product.short_description || "");
        setValue("category", product.category_id);
        setValue("brand", product.brand_id || "");
        setValue("qty", product.qty);
        setValue("sku", product.sku);
        setValue("barcode", product.barcode || "");
        setValue("status", product.status.toString());
        setValue("is_featured", product.is_featured);
        setContent(product.description || "");

        if (product.images && product.images.length > 0) {
          const baseUrl = apiUrl.replace("/api", "");

          const imagesWithUrl = product.images.map((img) => ({
            ...img,
            // المسار الصحيح للصورة بدون /api
            image_url: `${baseUrl}/uploads/products/small/${img.image}`,
          }));

          setExistingImages(imagesWithUrl);
        }
      } else {
        toast.error("Failed to load product");
        navigate("/admin/products");
      }
    } catch (error) {
      console.error("Fetch product error:", error);
      toast.error("Server error");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  // تحديث المنتج
  const updateProduct = async (data) => {
    console.log(data);
    // return "";
    const payload = {
      title: data.title,
      price: data.price,
      compare_price: data.compare_price || null,
      description: content,
      short_description: data.short_description || null,
      category: data.category,
      brand: data.brand || null,
      qty: data.qty || 0,
      sku: data.sku,
      barcode: data.barcode || null,
      status: parseInt(data.status),
      is_featured: data.is_featured,
      gallery: gallery,
      sizes: sizeChecked,
    };

    setDisable(true);

    try {
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.status === 200) {
        toast.success(result.message);
        navigate("/admin/products");
        return;
      }

      if (result.errors) {
        Object.keys(result.errors).forEach((field) => {
          setError(field, {
            type: "server",
            message: result.errors[field][0],
          });
        });
        toast.error("Please check the form errors");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setDisable(false);
    }
  };

  // حذف صورة موجودة
  const removeExistingImage = async (imageId) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`${apiUrl}/products/images/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken()}`,
        },
      });

      if (res.ok) {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success("Image deleted successfully");
      } else {
        const result = await res.json();
        toast.error(result.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Delete image error:", error);
      toast.error("Server error");
    }
  };

  // جلب التصنيفات
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiUrl}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });
      const result = await res.json();
      if (result.data) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
      toast.error("Failed to load categories");
    }
  };

  // جلب الماركات
  const fetchBrands = async () => {
    try {
      const res = await fetch(`${apiUrl}/brands`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });
      const result = await res.json();
      if (result.data) {
        setBrands(result.data);
      }
    } catch (error) {
      console.error("Fetch brands error:", error);
      toast.error("Failed to load brands");
    }
  };

  const fetchSizes = async () => {
    try {
      const res = await fetch(`${apiUrl}/sizes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });
      const result = await res.json();
      if (result.data) {
        setSizes(result.data);
      }
    } catch (error) {
      console.error("Fetch brands error:", error);
      toast.error("Failed to load brands");
    }
  };

  // رفع صورة جديدة
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP images are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const res = await fetch(`${apiUrl}/temp-images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken()}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (result.status === 200) {
        setGallery((prev) => [...prev, result.data.id]);
        toast.success("Image uploaded successfully");
        e.target.value = "";
      } else {
        toast.error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // حذف صورة جديدة
  const removeNewImage = async (imageId) => {
    try {
      const res = await fetch(`${apiUrl}/temp-images/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken()}`,
        },
      });

      if (res.ok) {
        setGallery((prev) => prev.filter((id) => id !== imageId));
        toast.info("Image removed");
      } else {
        setGallery((prev) => prev.filter((id) => id !== imageId));
      }
    } catch (error) {
      console.error("Remove error:", error);
      setGallery((prev) => prev.filter((id) => id !== imageId));
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchSizes();
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className="h4 pb-0 mb-0">Product / Edit</h4>
            <Link className="btn btn-primary" to="/admin/products">
              Back
            </Link>
          </div>
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <form onSubmit={handleSubmit(updateProduct)}>
              <div className="card shadow">
                <div className="card-body p-4">
                  {/* العنوان */}
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      {...register("title", {
                        required: "The title field is required",
                      })}
                      type="text"
                      className={`form-control ${errors.title && "is-invalid"}`}
                      placeholder="Product Title"
                    />
                    {errors.title && (
                      <p className="invalid-feedback">
                        {errors.title?.message}
                      </p>
                    )}
                  </div>

                  {/* التصنيف والماركة */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Category <span className="text-danger">*</span>
                        </label>
                        <select
                          {...register("category", {
                            required: "Please select a category",
                          })}
                          className={`form-select ${errors.category && "is-invalid"}`}
                        >
                          <option value="">Select a Category</option>
                          {categories.map((category) => (
                            <option
                              key={`category-${category.id}`}
                              value={category.id}
                            >
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="invalid-feedback">
                            {errors.category?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Brand</label>
                        <select {...register("brand")} className="form-select">
                          <option value="">Select a Brand</option>
                          {brands.map((brand) => (
                            <option key={`brand-${brand.id}`} value={brand.id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* الوصف المختصر */}
                  <div className="mb-3">
                    <label htmlFor="short_description" className="form-label">
                      Short Description
                    </label>
                    <textarea
                      {...register("short_description")}
                      className="form-control"
                      placeholder="Short Description"
                      rows={3}
                    />
                  </div>

                  {/* الوصف الكامل */}
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <JoditEditor
                      ref={editor}
                      value={content}
                      config={config}
                      onBlur={(newContent) => setContent(newContent)}
                    />
                  </div>

                  {/* Pricing Section */}
                  <h3 className="py-3 border-bottom mb-3">Pricing</h3>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Price <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          {...register("price", {
                            required: "The price field is required",
                            min: {
                              value: 0,
                              message: "Price must be greater than 0",
                            },
                          })}
                          className={`form-control ${errors.price && "is-invalid"}`}
                        />
                        {errors.price && (
                          <p className="invalid-feedback">
                            {errors.price?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Discounted Price</label>
                        <input
                          {...register("compare_price")}
                          type="number"
                          step="0.01"
                          placeholder="Discounted Price"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inventory Section */}
                  <h3 className="py-3 border-bottom mb-3">Inventory</h3>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          SKU <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="SKU"
                          {...register("sku", {
                            required: "The SKU field is required",
                          })}
                          className={`form-control ${errors.sku && "is-invalid"}`}
                        />
                        {errors.sku && (
                          <p className="invalid-feedback">
                            {errors.sku?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Barcode</label>
                        <input
                          {...register("barcode")}
                          type="text"
                          placeholder="Barcode"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Quantity</label>
                        <input
                          {...register("qty")}
                          type="number"
                          placeholder="Quantity"
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Status <span className="text-danger">*</span>
                        </label>
                        <select
                          {...register("status", {
                            required: "Please select a status",
                          })}
                          className={`form-select ${errors.status && "is-invalid"}`}
                        >
                          <option value="">Select a Status</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                        {errors.status && (
                          <p className="invalid-feedback">
                            {errors.status?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Featured <span className="text-danger">*</span>
                    </label>
                    <select
                      {...register("is_featured", {
                        required: "Please select featured status",
                      })}
                      className={`form-select ${errors.is_featured && "is-invalid"}`}
                    >
                      <option value="">Select Featured Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.is_featured && (
                      <p className="invalid-feedback">
                        {errors.is_featured?.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Sizes</label>

                    {sizes.map((size) => (
                      <div className="form-check-inline ps-2" key={size.id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={sizeChecked.includes(size.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSizeChecked((prev) => [...prev, size.id]);
                            } else {
                              setSizeChecked((prev) =>
                                prev.filter((sid) => sid !== size.id),
                              );
                            }
                          }}
                          id={`flexCheck${size.id}`}
                        />
                        <label
                          className="form-check-label ps-2"
                          htmlFor={`flexCheck${size.id}`}
                        >
                          {size.name}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Gallery Section */}
                  <h3 className="py-3 border-bottom mb-3">Gallery</h3>

                  {/* الصور الموجودة */}
                  {existingImages.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Existing Images ({existingImages.length})
                      </label>
                      <div className="d-flex flex-wrap gap-3 mt-2">
                        {existingImages.map((image) => {
                          // بناء المسار الصحيح للصورة
                          const baseUrl = apiUrl.replace("/api", "");
                          const imageSrc =
                            image.image_url ||
                            `${baseUrl}/uploads/products/small/${image.image}`;

                          return (
                            <div
                              key={image.id}
                              className="position-relative"
                              style={{ width: "100px" }}
                            >
                              <img
                                src={imageSrc}
                                alt="Product"
                                className="img-fluid rounded border"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/100x100?text=No+Image";
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                                style={{
                                  transform: "translate(50%, -50%)",
                                  width: "24px",
                                  height: "24px",
                                  fontSize: "12px",
                                  padding: "0",
                                }}
                                onClick={() => removeExistingImage(image.id)}
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* رفع صور جديدة */}
                  <div className="mb-3">
                    <label className="form-label">Upload New Images</label>
                    <input
                      onChange={handleFile}
                      type="file"
                      className="form-control"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      disabled={uploading}
                    />
                    {uploading && (
                      <div className="mt-2 text-primary">
                        <small>Uploading...</small>
                      </div>
                    )}
                    <small className="text-muted">
                      Allowed formats: JPG, PNG, WEBP. Max size: 2MB
                    </small>
                  </div>

                  {/* الصور الجديدة المرفوعة */}
                  {gallery.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        New Images ({gallery.length})
                      </label>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {gallery.map((id, index) => (
                          <div
                            key={index}
                            className="badge bg-primary d-flex align-items-center gap-2 p-2"
                            style={{ fontSize: "14px" }}
                          >
                            <span>Image ID: {id}</span>
                            <button
                              type="button"
                              className="btn-close btn-close-white"
                              style={{ fontSize: "10px" }}
                              onClick={() => removeNewImage(id)}
                              aria-label="Remove"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                disabled={disable || uploading}
                type="submit"
                className="btn btn-primary mt-3 mb-5"
              >
                {disable ? "Updating..." : "Update Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
