import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../common/Sidebar";
import Layout from "../../common/Layout";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { adminToken, apiUrl } from "../../common/http";

const Create = () => {
  const [disable,setDisable] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const saveCategory = async (data) => {
    // console.log(data);
    setDisable(true);
    const res = await fetch(`${apiUrl}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then((result) => {
        console.log(result);
        setDisable(false);
        if (result.status == 200) {
          toast.success(result.message);
          navigate('/admin/categories');
        } else {
          console.log("something went wrong");
        }
      });
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className="h4 pb-0 mb-0">Categories / Create</h4>
            <Link className="btn btn-primary" to="/admin/categories">
              Back
            </Link>
          </div>
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <form onSubmit={handleSubmit(saveCategory)}>
              <div className="card shadow">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <label htmlFor="" className="form-label">
                      Name
                    </label>
                    <input
                      {...register("name", {
                        required: "The name field is required",
                      })}
                      type="text"
                      className={`form-control mb-3 ${errors.name && "is-invalid"}`}
                      placeholder="Name"
                    />
                    {errors.name && (
                      <p className="invalid-feedback">{errors.name?.message}</p>
                    )}
                  </div>

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
              </div>
              <button disabled={disable} type="submit" className="btn btn-primary mt-3">
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
