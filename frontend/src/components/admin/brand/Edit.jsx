import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../common/Sidebar";
import Layout from "../../common/Layout";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { adminToken, apiUrl } from "../../common/http";

const Sample = () => {
  const [disable, setDisable] = useState(false);
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
      const res = await fetch(`${apiUrl}/brands/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log(result);
          if (result.status == 200) {
            reset({
              name: result.data.name,
              status: result.data.status,
            });
          } else {
            setcategories([]);
            console.log("something went wrong");
          }
        });
    },
  });

  const saveBrand = async (data) => {
    try {
      setDisable(true);

      const response = await fetch(`${apiUrl}/brands/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      setDisable(false);

      if (result.status === 200) {
        toast.success(result.message);
        navigate("/admin/brands");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      setDisable(false);
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className="h4 pb-0 mb-0">Your title</h4>
            <Link className="btn btn-primary">Button</Link>
          </div>
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <form onSubmit={handleSubmit(saveBrand)}>
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

export default Sample;
