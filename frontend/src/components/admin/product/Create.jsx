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
  const navigate = useNavigate();

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || "Start typings...",
    }),
    [placeholder],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const saveProduct = async (data) => {
    console.log(data);
    return;
    setDisable(true);
    const res = await fetch(`${apiUrl}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setDisable(false);
        if (result.status == 200) {
          toast.success(result.message);
          navigate("/admin/categories");
        } else {
          console.log("something went wrong");
        }
      });
  };

  const fetchCategories = async () => {
    const res = await fetch(`${apiUrl}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result.data)
        setCategories(result.data);
      });
  };

  const fetchBrands = async () => {
    const res = await fetch(`${apiUrl}/brands`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result.data);
        setBrands(result.data);
      });
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
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
                  <div className="mb-3">
                    <label htmlFor="" className="form-label">
                      Title
                    </label>
                    <input
                      {...register("title", {
                        required: "The name field is required",
                      })}
                      type="text"
                      className={`form-control mb-3 ${errors.title && "is-invalid"}`}
                      placeholder="Title"
                    />
                    {errors.title && (
                      <p className="invalid-feedback">
                        {errors.title?.message}
                      </p>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="">
                          Category
                        </label>
                        <select
                          {...register("category", {
                            required: "please select a Category",
                          })}
                          className={`form-control mb-3 ${errors.category && "is-invalid"}`}
                        >
                          <option value="" hidden>
                            Select a Category
                          </option>
                          {categories &&
                            categories.map((category) => {
                              return (
                                <option
                                  key={`category-${category.id}`}
                                  value={category.id}
                                >
                                  {category.name}
                                </option>
                              );
                            })}
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
                        <label className="form-label" htmlFor="">
                          Brand
                        </label>
                        <select
                          {...register("brand")}
                          className="form-control"
                        >
                          <option value="" hidden>
                            Select a Brand
                          </option>
                          {brands &&
                            brands.map((brand) => {
                              return (
                                <option
                                  key={`category-${brand.id}`}
                                  value={brand.id}
                                >
                                  {brand.name}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="" className="form-label">
                      Short Description
                    </label>
                    <textarea
                      className="form-control"
                      placeholder="Short Description"
                      rows={3}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="" className="form-label">
                      Descreption
                    </label>
                    <JoditEditor
                      ref={editor}
                      value={content}
                      config={config}
                      tabIndex={1} // tabIndex of textarea
                      onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    />
                  </div>

                  <h3 className="py-3 border-bottom mb-3">Pricing</h3>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Price
                        </label>
                        <input
                          type="text"
                          placeholder="Price"
                          {...register("price", {
                            required: "the price field is reqired",
                          })}
                          className={`form-control mb-3 ${errors.price && "is-invalid"}`}
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
                        <label htmlFor="" className="form-label">
                          Discounted Price
                        </label>
                        <input
                          type="text"
                          placeholder=" Discounted Price"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="py-3 border-bottom mb-3">Inventory</h3>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          SKU
                        </label>
                        <input
                          type="text"
                          placeholder="SKU"
                          {...register("sku", {
                            required: "the sku field is reqired",
                          })}
                          className={`form-control mb-3 ${errors.sku && "is-invalid"}`}
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
                        <label htmlFor="" className="form-label">
                          Barcode
                        </label>
                        <input
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
                        <label htmlFor="" className="form-label">
                          Qty
                        </label>
                        <input
                          type="text"
                          placeholder="Qty"
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Status
                        </label>
                        <select
                          className={`form-control mb-3 ${errors.status && "is-invalid"}`}
                          {...register("status", {
                            required: "Plesae select a status",
                          })}
                        >
                          <option value="" hidden>
                            Select a Status
                          </option>
                          <option value="1">Active</option>
                          <option value="0">Block</option>
                        </select>
                        {errors.status && (
                          <p className="invalid-feedback">
                            {errors.status?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Featured
                      </label>
                      <select
                        className={`form-control mb-3 ${errors.is_featured && "is-invalid"}`}
                        {...register("is_featured", {
                          required: "Plesae select a status",
                        })}
                      >
                        <option value="" hidden>
                          Select a Status
                        </option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {errors.is_featured && (
                        <p className="invalid-feedback">
                          {errors.is_featured?.message}
                        </p>
                      )}
                    </div>

                    <h3 className="py-3 border-bottom mb-3">Gallery</h3>

                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Image
                      </label>
                      <input type="file" className="form-control" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                disabled={disable}
                type="submit"
                className="btn btn-primary mt-3 mb-5"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Create;
// 44:19
