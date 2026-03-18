import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import Shop from "./components/Shop";
import Product from "./components/Product";
import Cart from "./components/Cart";
import NotFound from "./components/NotFound";
import Checkout from "./components/Checkout";
import Login from "./components/admin/login";
import Dashboard from "./components/admin/Dashboard";
import { ToastContainer, toast } from "react-toastify";
import { AdminRequireAuth } from "./components/admin/AdminRequireAuth";


function App() {
  return (
    <>
      {/* <div>hello i am app file</div> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={
            <AdminRequireAuth>
              <Dashboard />
            </AdminRequireAuth>
          } />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
