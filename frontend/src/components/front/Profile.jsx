import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../common/Layout";
import UserSidebar from "../common/UserSidebar";
import { useForm } from "react-hook-form";
import { apiUrl, userToken } from "../common/http";
import { toast } from "react-toastify";
import Loader from "../common/Loader";

const Profile = () => {
  const [loader, setLoader] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      fetch(`${apiUrl}/get-account-details`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken()}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          if (result.status == 200) {
            setLoader(false);
            reset({
              name: result.data.name,
              email: result.data.email,
              address: result.data.address,
              mobile: result.data.mobile,
              city: result.data.city,
              state: result.data.state,
              zip: result.data.zip,
            });
          }
        });
    },
  });

  const updateProfile = async (data) => {
    fetch(`${apiUrl}/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken()}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
          toast.success(result.message);
        }
      });
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className="h4 pb-0 mb-0">My Account</h4>
          </div>
          <div className="col-md-3">
            <UserSidebar />
          </div>
          <div className="col-md-9">
            {loader == true && <Loader />}
            {loader == false && (
              <form onSubmit={handleSubmit(updateProfile)}>
                <div className="card shadow">
                  <div className="card-body p-4">
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="name">Name</label>
                        <input
                          {...register("name", {
                            required: "The name field is required",
                          })}
                          type="text"
                          className={`form-control ${errors.name && "is-invalid"}`}
                          id="name"
                          placeholder="Enter name"
                        />
                        {errors.name && (
                          <p className="text-danger">{errors.name?.message}</p>
                        )}
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="email">Email</label>
                        <input
                          {...register("email", {
                            required: "The email field is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          type="email"
                          className={`form-control ${errors.email && "is-invalid"}`}
                          id="email"
                          placeholder="Enter email"
                        />
                        {errors.email && (
                          <p className="text-danger">{errors.email?.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="mb-3 ">
                        <label htmlFor="name">Address</label>
                        <textarea
                          {...register("address", {
                            required: "The address field is required",
                          })}
                          className={`form-control ${errors.address && "is-invalid"}`}
                          id="address"
                          placeholder="Enter address"
                        ></textarea>
                        {errors.address && (
                          <p className="text-danger">
                            {errors.address?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="name">Mobile</label>
                        <input
                          {...register("mobile", {
                            required: "The mobile field is required",
                          })}
                          type="text"
                          className={`form-control ${errors.mobile && "is-invalid"}`}
                          id="mobile"
                          placeholder="Enter mobile"
                        />
                        {errors.mobile && (
                          <p className="text-danger">
                            {errors.mobile?.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="email">City</label>
                        <input
                          {...register("city", {
                            required: "The city field is required",
                          })}
                          type="text"
                          className={`form-control ${errors.city && "is-invalid"}`}
                          id="city"
                          placeholder="Enter city"
                        />
                        {errors.city && (
                          <p className="text-danger">{errors.city?.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="name">State</label>
                        <input
                          {...register("state", {
                            required: "The state field is required",
                          })}
                          type="text"
                          className={`form-control ${errors.state && "is-invalid"}`}
                          id="state"
                          placeholder="Enter state"
                        />
                        {errors.state && (
                          <p className="text-danger">{errors.state?.message}</p>
                        )}
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="email">Zip</label>
                        <input
                          {...register("zip", {
                            required: "The zip field is required",
                          })}
                          type="text"
                          className={`form-control ${errors.zip && "is-invalid"}`}
                          id="zip"
                          placeholder="Enter zip"
                        />
                        {errors.zip && (
                          <p className="text-danger">{errors.zip?.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button className="btn btn-primary mt-4 mb-5">Update</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
