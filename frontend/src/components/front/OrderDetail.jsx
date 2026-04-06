import React, { useEffect, useState } from "react";
import UserSidebar from "../common/UserSidebar";
import Layout from "../common/Layout";
import { Link, useParams } from "react-router-dom";
import { apiUrl, userToken } from "../common/http";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loader, setLoader] = useState(true);
  const { id } = useParams();

  const fetchOrder = async () => {
    setLoader(true);

    try {
      const res = await fetch(`${apiUrl}/get-orders-details/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken()}`,
        },
      });
      const result = await res.json();

      //   console.log(result);
      if (result.status === 200) {
        setOrder(result.data);
        setItems(result.data.order_items || []);
        // console.log(result.data.order_items.product);
      } else {
        toast.error(result.message || "Failed to fetch order");
        setOrder(null);
      }
    } catch (error) {
      toast.error("Network error");
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loader) {
    return (
      <Layout>
        <div className="container text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container text-center py-5">
          <p>Order not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mb-5">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className="h4 pb-0 mb-0">My Order</h4>
            <Link className="btn btn-primary" to="/account/orders">
              Back
            </Link>
          </div>
          <div className="col-md-3">
            <UserSidebar />
          </div>
          <div className="col-md-9">
            <div className="card shadow">
              <div className="card-body p-4">
                <div>
                  <div className="row">
                    <div className="col-md-4">
                      <h3>Order ID : #{order.id}</h3>
                      {order.status === "pending" && (
                        <span className="badge bg-warning">Pending</span>
                      )}
                      {order.status === "shipped" && (
                        <span className="badge bg-info">Shipped</span>
                      )}
                      {order.status === "delivered" && (
                        <span className="badge bg-success">Delivered</span>
                      )}
                      {order.status === "cancelled" && (
                        <span className="badge bg-danger">Cancelled</span>
                      )}
                    </div>
                    <div className="col-md-4">
                      <div className="text-secondary">Date</div>
                      <h4 className="pt-2">{order.created_at}</h4>
                    </div>
                    <div className="col-md-4">
                      <div className="text-secondary">Payment Status</div>
                      {order.payment_status === "paid" ? (
                        <span className="badge bg-success">Paid</span>
                      ) : (
                        <span className="badge bg-danger">Not paid</span>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="py-3">
                        <h5>Customer Information</h5>
                        <hr />
                        <strong>{order.name}</strong>
                        <div>Email: {order.email}</div>
                        <div>Mobile: {order.mobile}</div>
                        <div>
                          Address: {order.address} {order.city} {order.zip}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="py-3">
                        <h5>Payment Information</h5>
                        <hr />
                        <p>Payment Method: Cash on Delivery</p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <h3 className="pb-2">
                      <strong>Items</strong>
                    </h3>
                    {items.map((item) => {
                      return (
                        <div key={item.id} className="row justify-content-end">
                          <div className="col-lg-12">
                            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                              <div className="d-flex">
                                {item.product?.image && (
                                  <img
                                    width="70"
                                    className="me-3"
                                    src={`http://localhost:8000/uploads/products/small/${item.product.image}`}
                                    alt={item.name}
                                  />
                                )}
                                <div className="d-flex flex-column">
                                  <div className="mb-2">
                                    <span>{item.name}</span>
                                  </div>
                                  <div>
                                    <button className="btn btn-size btn-sm">
                                      Size: {item.size}
                                    </button>
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Unit Price: ${item.price}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex align-items-center">
                                <div>X {item.qty}</div>
                                <div className="ps-3 fw-bold">
                                  ${(item.price * item.qty).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div className="row justify-content-end mt-3">
                      <div className="col-lg-12">
                        <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                          <div>Subtotal</div>
                          <div>${parseFloat(order.subtotal).toFixed(2)}</div>
                        </div>
                        <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                          <div>Shipping</div>
                          <div>${parseFloat(order.shipping).toFixed(2)}</div>
                        </div>
                        <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                          <div>
                            <strong>Grand Total</strong>
                          </div>
                          <div>
                            <strong>
                              ${parseFloat(order.grand_total).toFixed(2)}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
