import React, { useContext } from "react";
import Layout from "./common/Layout";
import { Link, useNavigate } from "react-router-dom";
import PrductImage from "../assets/images/mens/six.jpg";
import { useState } from "react";
import { CartContext } from "./context/Cart";
import { useForm } from "react-hook-form";
import { apiUrl, userToken } from "./common/http";
import { toast } from "react-toastify";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const { cartData, grandTotal, subTotal, shipping } = useContext(CartContext);
  const navigate = useNavigate();

  // console.log(cartData);

  const handlePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
  };

  const {
    register,
    handleSubmit,
    setError,
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

  const processOrder = (data) => {
    // console.log(data);
    if (paymentMethod == "cod") {
      saveOrder(data, "not paid");
    }
  };

  const saveOrder = (formData, paymentStatus) => {
    const newFormData = {
      ...formData,
      grand_total: grandTotal(),
      subtotal: subTotal(),
      shipping: shipping(),
      discount: 0,
      payment_status: paymentStatus,
      cart: cartData.map((item) => ({
        product_id: item.product_id,
        name: item.title,
        size: item.size || "N/A",
        price: item.price,
        unit_price: item.price,
        qty: item.qty,
      })),
    };

    console.log("Sending data:", newFormData);

    fetch(`${apiUrl}/save-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken()}`,
      },
      body: JSON.stringify(newFormData),
    })
      .then(async (res) => {
        const text = await res.text();
        console.log("Raw response:", text);

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("JSON parse error:", e);
          throw new Error("Invalid JSON response");
        }

        if (!res.ok) {
          throw new Error(data.message || "Server error");
        }

        return data;
      })
      .then((result) => {
        console.log("Success:", result);
        if (result.status === 200) {
          localStorage.removeItem("cart");
          navigate(`/order/confirmation/${result.order_id}`);
        } else {
          toast.error(result.message || "Failed to place order");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("Error: " + err.message);
      });
  };
  return (
    <Layout>
      <div className="container pb-5">
        <div className="row">
          <div className="col-md-12">
            <nav aria-label="breadcrumb" className="py-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>

                <li className="breadcrumb-item active">Checkout</li>
              </ol>
            </nav>
          </div>
        </div>
        <form onSubmit={handleSubmit(processOrder)}>
          <div className="row">
            <div className="col-md-7">
              <h3 className="border-bottom pb-3">
                <strong>Billing Details</strong>
              </h3>

              <div className="row pt-3">
                <div className="col-md-6">
                  <div className="mb-3">
                    <input
                      {...register("name", { required: "Name is required" })}
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      placeholder="Name"
                    />
                    {errors.name && (
                      <p className="invalid-feedback">{errors.name?.message}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      type="text"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="Email"
                    />
                    {errors.email && (
                      <p className="invalid-feedback">
                        {errors.email?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <textarea
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                    rows={3}
                    placeholder="Address"
                  ></textarea>
                  {errors.address && (
                    <p className="invalid-feedback">
                      {errors.address?.message}
                    </p>
                  )}
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <input
                      {...register("city", { required: "City is required" })}
                      type="text"
                      className={`form-control ${errors.city ? "is-invalid" : ""}`}
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="invalid-feedback">{errors.city?.message}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <input
                      {...register("state", { required: "State is required" })}
                      type="text"
                      className={`form-control ${errors.state ? "is-invalid" : ""}`}
                      placeholder="State"
                    />
                    {errors.state && (
                      <p className="invalid-feedback">
                        {errors.state?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <input
                      {...register("zip", { required: "Zip is required" })}
                      type="text"
                      className={`form-control ${errors.zip ? "is-invalid" : ""}`}
                      placeholder="Zip"
                    />
                    {errors.zip && (
                      <p className="invalid-feedback">{errors.zip?.message}</p>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <input
                      {...register("mobile", {
                        required: "Mobile is required",
                      })}
                      type="text"
                      className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                      placeholder="Mobile"
                    />
                    {errors.mobile && (
                      <p className="invalid-feedback">
                        {errors.mobile?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <h3 className="border-bottom pb-3">
                <strong>Items</strong>
              </h3>

              <table className="table">
                <tbody>
                  {cartData &&
                    cartData.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td width={100}>
                            <img src={item.image_url} width={80} alt="" />
                          </td>
                          <td width={400}>
                            <h4>{item.title}</h4>
                            <div className="d-flex align-items-center pt-3">
                              <span>${item.price.toFixed(2)}</span>
                              <div className="ps-3">
                                {item.size && (
                                  <button className="btn btn-size">
                                    {item.size}
                                  </button>
                                )}{" "}
                              </div>
                              <div className="ps-5">X {item.qty}</div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              <div className="row ">
                <div className="col-md-12">
                  <div className="d-flex justify-content-between border-bottom pb-2">
                    <div>
                      <strong>Subtotal</strong>
                    </div>
                    <div>${subTotal().toFixed(2)}</div>
                  </div>

                  <div className="d-flex justify-content-between border-bottom py-2">
                    <div>
                      <strong>Shipping</strong>
                    </div>
                    <div>${shipping().toFixed(2)}</div>
                  </div>

                  <div className="d-flex justify-content-between border-bottom">
                    <div>
                      <strong>Grand Total</strong>
                    </div>
                    <div>${grandTotal().toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <h3 className="border-bottom pt-4 pb-3">
                <strong>Payment Method</strong>
              </h3>

              <div className="pt-2">
                <input
                  type="radio"
                  onChange={handlePaymentMethod}
                  checked={paymentMethod === "strip"}
                  value="strip"
                />
                <label htmlFor="" className="form-lable ps-2 me-4">
                  Stripe
                </label>

                <input
                  type="radio"
                  onChange={handlePaymentMethod}
                  checked={paymentMethod === "cod"}
                  value="cod"
                />
                <label htmlFor="" className="form-lable ps-2">
                  COD
                </label>
              </div>

              <div className="d-flex py-3">
                <button className="btn btn-primary">Pay Now </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
