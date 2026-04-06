import React, { useEffect, useState } from "react";
import Layout from "./common/Layout";
import { Link, useParams } from "react-router-dom";
import { apiUrl, userToken } from "./common/http";
import { toast } from "react-toastify";

const Confirmation = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchOrders = () => {
      fetch(`${apiUrl}/get-orders-details/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken()}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setLoading(false);
          if (result.status === 200) {
            console.log("Order details:", result.data);
            setOrder(result.data);
            setItems(result.data.order_items);
            
          } else {
            toast.error(result.message || "Failed to fetch order details");
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error("Network error. Please try again.");
          console.error("Fetch error:", error);
        });
    };

    fetchOrders();
  }, [id]);

  // عرض شاشة التحميل
  if (loading) {
    return (
      <Layout>
        <div className="container py-5 text-center">
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
        <div className="container py-5">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="fw-bold text-warning">Order Not Found</h1>
              <p className="text-muted mt-3">
                Sorry, we couldn't find your order details.
              </p>
              <Link to="/" className="btn btn-primary mt-3">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-5">
        <div className="row">
          <h1 className="text-center fw-bold text-success">Thank You!</h1>
          <p className="text-muted text-center">
            Your order has been successfully placed.
          </p>
        </div>

        <div className="card shadow">
          <div className="card-body">
            <h3 className="fw-bold">Order Summary</h3>
            <hr />
            
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Order ID: </strong>#{order.id}
                </p>
                <p>
                  <strong>Date: </strong> {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status: </strong>
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
                </p>
                <p>
                  <strong>Payment Method: </strong>
                  {order.payment_method || "Cash on Delivery"}
                </p>
              </div>
              
              <div className="col-md-6">
                <p>
                  <strong>Customer: </strong>
                  { order.name }
                </p>
                <p>
                  <strong>Address: </strong>
                  { order.address }, {order.city}, {order.state}, {order.zip}
                </p>
                <p>
                  <strong>Contact: </strong>
                  {order.mobile || "N/A"}
                </p>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-12">
                <table className="table table-striped table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th width="150">Price</th>
                      <th width="150">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                        items.map((item)=>(
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.qty}</td>
                                <td>{item.unit_price }</td>
                                <td>{item.price}</td>
                            </tr>
                        ))
                        
                    
                   }
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="text-end fw-bold" colSpan={3}>
                        Subtotal
                      </td>
                      <td>${parseFloat(order.subtotal || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="text-end fw-bold" colSpan={3}>
                        Shipping
                      </td>
                      <td>${parseFloat(order.shipping || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="text-end fw-bold" colSpan={3}>
                        Grand Total
                      </td>
                      <td>
                        <strong>
                          ${parseFloat(order.grand_total || 0).toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="text-center mt-4">
                <Link to={`/account/orders/details/${order.id}`} className="btn btn-primary">
                  View Order Details
                </Link>
                <Link to="/" className="btn btn-outline-secondary ms-2">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Confirmation;