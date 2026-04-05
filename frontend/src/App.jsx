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

import { default as ShowCategories } from "./components/admin/catugory/Show";
import { default as CreateCategory } from "./components/admin/catugory/Create";
import { default as EditCategory } from "./components/admin/catugory/Edit";

import { default as ShowBrands } from "./components/admin/brand/Show";
import { default as CreateBrand } from "./components/admin/brand/Create";
import { default as EditBrand } from "./components/admin/brand/Edit";

import { default as ShowOrders } from "./components/admin/orders/ShowOrders";
import { default as OrderDetail } from "./components/admin/orders/OrderDetail";

import { default as ShowProducts } from "./components/admin/product/Show";
import { default as CreateProduct } from "./components/admin/product/Create";
import { default as EditProduct } from "./components/admin/product/Edit";
import Register from "./components/Register";
import { default as UserLogin } from "./components/Login";
import Profile from "./components/profile";
import { RequireAuth } from "./components/RequireAuth";
import Confirmation from "./components/Confirmation";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* user routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account/register" element={<Register />} />
          <Route path="/account/login" element={<UserLogin />} />
          {/* Auth user route  */}
          <Route
            path="/account"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route
            path="/order/confirmation/:id"
            element={
              <RequireAuth>
                <Confirmation />
              </RequireAuth>
            }
          />

          {/* admin routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRequireAuth>
                <Dashboard />
              </AdminRequireAuth>
            }
          />
          {/* categories */}
          <Route
            path="/admin/categories"
            element={
              <AdminRequireAuth>
                <ShowCategories />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/categories/create"
            element={
              <AdminRequireAuth>
                <CreateCategory />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/categories/edit/:id"
            element={
              <AdminRequireAuth>
                <EditCategory />
              </AdminRequireAuth>
            }
          />
          {/* brand */}
          <Route
            path="/admin/brands"
            element={
              <AdminRequireAuth>
                <ShowBrands />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/brand/create"
            element={
              <AdminRequireAuth>
                <CreateBrand />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/brand/edit/:id"
            element={
              <AdminRequireAuth>
                <EditBrand />
              </AdminRequireAuth>
            }
          />
          {/* Product */}
          <Route
            path="/admin/products"
            element={
              <AdminRequireAuth>
                <ShowProducts />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/product/create"
            element={
              <AdminRequireAuth>
                <CreateProduct />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/product/edit/:id"
            element={
              <AdminRequireAuth>
                <EditProduct />
              </AdminRequireAuth>
            }
          />
          {/* orders */}
          <Route
            path="/admin/orders"
            element={
              <AdminRequireAuth>
                <ShowOrders />
              </AdminRequireAuth>
            }
          />

          <Route
            path="/admin/orders/:id"
            element={
              <AdminRequireAuth>
                <OrderDetail />
              </AdminRequireAuth>
            }
          />



          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
