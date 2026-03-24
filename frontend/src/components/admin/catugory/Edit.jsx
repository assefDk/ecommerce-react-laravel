import React, { useState } from "react";
import Layout from "../../common/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../common/Sidebar";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { adminToken, apiUrl } from "../../common/http";

const Edit = () => {


  const [disable, setDisable] = useState(false);
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(`${apiUrl}/categories/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        }
      }).then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.status == 200) {
            setCategory(result.data);
            reset({
                name : result.data.name,
                status : result.data.status
            })
          } else {
            setcategories([]);
            console.log("something went wrong");
          }
        });
    },
  });

  const saveCategory = async (data) => {
    // console.log(data);
    setDisable(true);
    const res = await fetch(`${apiUrl}/categories/${params.id}`, {
      method: "PUT",
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
          setCategory([]);
          console.log("something went wrong");
        }
      });
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className="h4 pb-0 mb-0">Categories / Edit</h4>
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
              <button
                disabled={disable}
                type="submit"
                className="btn btn-primary mt-3"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
