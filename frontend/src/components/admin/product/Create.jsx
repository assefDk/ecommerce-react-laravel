import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../common/Sidebar";
import Layout from "../../common/Layout";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { adminToken, apiUrl } from "../../common/http";
import JoditEditor from "jodit-react";

const Create = ({ placeholder }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [disable, setDisable] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [gallery, setGallery] = useState([]); // مصفوفة لتخزين بيانات الصور {id, url, name}
  const [uploading, setUploading] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [sizeChecked, setSizeChecked] = useState([]);
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
    formState: { errors },
  } = useForm();

  const saveProduct = async (data) => {
    const galleryIds = gallery.map((item) => item.id);

    const payload = {
      title: data.title,
      price: data.price,
      compare_price: data.compare_price || null,
      content: content,
      short_description: data.short_description || null,
      category: data.category,
      brand: data.brand || null,
      qty: data.qty || 0,
      sku: data.sku,
      barcode: data.barcode || null,
      status: parseInt(data.status),
      is_featured: data.is_featured,
      gallery: galleryIds,
      sizes: sizeChecked
    };

    setDisable(true);

    try {
      const res = await fetch(`${apiUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.status === 200 || result.status === 201) {
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
      console.error("Save error:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setDisable(false);
    }
  };

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

  // رفع الصورة
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // التحقق من نوع الملف
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP images are allowed");
      e.target.value = "";
      return;
    }

    // التحقق من الحجم (2MB)
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
        // إنشاء رابط الصورة المصغرة
        const baseUrl = apiUrl.replace("/api", "");
        const imageUrl = `${baseUrl}/uploads/temp/thumb/${result.data.name}`;

        // تخزين بيانات الصورة كاملة
        setGallery((prev) => [
          ...prev,
          {
            id: result.data.id,
            name: result.data.name,
            url: imageUrl,
          },
        ]);
        toast.success("Image uploaded successfully");
        e.target.value = ""; // reset input
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

  // حذف صورة من المعرض
  const removeImage = async (imageId) => {
    try {
      const res = await fetch(`${apiUrl}/temp-images/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken()}`,
        },
      });

      if (res.ok) {
        setGallery((prev) => prev.filter((item) => item.id !== imageId));
        toast.info("Image removed");
      } else {
        setGallery((prev) => prev.filter((item) => item.id !== imageId));
      }
    } catch (error) {
      console.error("Remove error:", error);
      setGallery((prev) => prev.filter((item) => item.id !== imageId));
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchSizes();
  }, []);

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className="h4 pb-0 mb-0">Product / Create</h4>
            <Link className="btn btn-primary" to="/admin/products">
              Back
            </Link>
          </div>
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <form onSubmit={handleSubmit(saveProduct)}>
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

                  <h3 className="py-3 border-bottom mb-3">Sizes</h3>

                  <div className="mb-3">
                    {sizes &&
                      sizes.map((size) => {
                        return (
                          <div className="form-check-inline ps-2" key={size.id}>
                            <input
                              {...register("sizes")}
                              checked={sizeChecked.includes(size.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSizeChecked([...sizeChecked, size.id]);
                                } else {
                                  setSizeChecked(
                                    sizeChecked.filter((sid) => size.id != sid),
                                  );
                                }
                              }}
                              className="form-check-input"
                              type="checkbox"
                              value={size.id}
                              id={`flexCheck${size.id}`}
                            />
                            <label
                              className="form-check-label ps-2"
                              htmlFor={`flexCheck${size.id}`}
                            >
                              {size.name}
                            </label>
                          </div>
                        );
                      })}
                  </div>

                  {/* Gallery Section */}
                  <h3 className="py-3 border-bottom mb-3">Gallery</h3>

                  <div className="mb-3">
                    <label className="form-label">Upload Images</label>
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

                  {/* عرض الصور المرفوعة مع صور حقيقية وزر حذف */}
                  {gallery.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Uploaded Images ({gallery.length})
                      </label>
                      <div className="row mt-3">
                        {gallery.map((image, index) => (
                          <div
                            key={image.id}
                            className="col-md-3 col-sm-4 col-6 mb-3"
                          >
                            <div className="card h-100 shadow-sm">
                              <div className="position-relative">
                                <img
                                  src={image.url}
                                  alt={`Uploaded ${index + 1}`}
                                  className="card-img-top"
                                  style={{
                                    height: "150px",
                                    objectFit: "cover",
                                    borderTopLeftRadius: "calc(0.25rem - 1px)",
                                    borderTopRightRadius: "calc(0.25rem - 1px)",
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://placehold.co/150x150?text=No+Image";
                                  }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  onClick={() => removeImage(image.id)}
                                >
                                  ×
                                </button>
                              </div>
                              <div className="card-body p-2 text-center">
                                <small className="text-muted text-truncate d-block">
                                  Image {index + 1}
                                </small>
                              </div>
                            </div>
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
                {disable ? "Creating..." : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Create;
