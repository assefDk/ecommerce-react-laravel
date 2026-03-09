import React from "react";
import Layout from "./Layout";
import Hero from "./Hero";
import ProductImag from "../../assets/images/eight.jpg";

const Shop = () => {
  return (
    <Layout>
      <div className="container">
        <nav aria-label="breadcrumb" className="py-4">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              Shop
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-md-3">
            <div className="card shadow border-0 mb-3">
              <div className="card-body p-4">
                <h3 className="mb-3">Categories</h3>
                <ul>
                  <li className="mb-2">
                    <input type="checkbox" />
                    <label htmlFor="" className="py-2">
                      Kids
                    </label>
                  </li>
                  <li className="mb-2">
                    <input type="checkbox" />
                    <label htmlFor="" className="py-2">
                      Mens
                    </label>
                  </li>
                  <li className="mb-2">
                    <input type="checkbox" />
                    <label htmlFor="" className="py-2">
                      Womens
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card shadow border-0 mb-3">
              <div className="card-body p-4">
                <h3 className="mb-3">Brands</h3>
                <ul>
                  <li className="mb-2">
                    <input type="checkbox" />
                    <label htmlFor="" className="py-2">
                      puma
                    </label>
                  </li>
                  <li className="mb-2">
                    <input type="checkbox" />
                    <label htmlFor="" className="py-2">
                      Killer
                    </label>
                  </li>
                  <li className="mb-2">
                    <input type="checkbox" />
                    <label htmlFor="" className="py-2">
                      Levis
                    </label>
                  </li>
                  <li className="mb-2">
                    <input type="checkbox" />
                    <label htmlFor="" className="py-2">
                      Levis
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="row pb-5">
              <div className="col-md-4 col-6">
                <div className="product card border-0">
                  <div className="card-img">
                    <img src={ProductImag} className="w-100" />
                  </div>

                  <div className="card-body pt-3">
                    <a href="">Lorem ipsum dolor sit amet.</a>
                    <div className="price">
                      $80{" "}
                      <span className="text-decoration-line-through">$99</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-6">
                <div className="product card border-0">
                  <div className="card-img">
                    <img src={ProductImag} className="w-100" />
                  </div>

                  <div className="card-body pt-3">
                    <a href="">Lorem ipsum dolor sit amet.</a>
                    <div className="price">
                      $80{" "}
                      <span className="text-decoration-line-through">$99</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-6">
                <div className="product card border-0">
                  <div className="card-img">
                    <img src={ProductImag} className="w-100" />
                  </div>

                  <div className="card-body pt-3">
                    <a href="">Lorem ipsum dolor sit amet.</a>
                    <div className="price">
                      $80{" "}
                      <span className="text-decoration-line-through">$99</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-6">
                <div className="product card border-0">
                  <div className="card-img">
                    <img src={ProductImag} className="w-100" />
                  </div>

                  <div className="card-body pt-3">
                    <a href="">Lorem ipsum dolor sit amet.</a>
                    <div className="price">
                      $80{" "}
                      <span className="text-decoration-line-through">$99</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-6">
                <div className="product card border-0">
                  <div className="card-img">
                    <img src={ProductImag} className="w-100" />
                  </div>

                  <div className="card-body pt-3">
                    <a href="">Lorem ipsum dolor sit amet.</a>
                    <div className="price">
                      $80{" "}
                      <span className="text-decoration-line-through">$99</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-6">
                <div className="product card border-0">
                  <div className="card-img">
                    <img src={ProductImag} className="w-100" />
                  </div>

                  <div className="card-body pt-3">
                    <a href="">Lorem ipsum dolor sit amet.</a>
                    <div className="price">
                      $80{" "}
                      <span className="text-decoration-line-through">$99</span>
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

export default Shop;
