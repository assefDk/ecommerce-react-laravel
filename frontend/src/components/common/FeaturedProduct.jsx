import React from "react";
import ProductImag from "../../assets/images/eleven.jpg";

const FeaturedProduct = () => {
  return (
    <section className="section-2 py-5">
      <div className="container">
        <h2>Featured Products</h2>
        <div className="row mt-4">
          <div className="col-md-3 col-6">
            <div className="product card border-0">
              <div className="card-img">
                <img src={ProductImag} className="w-100" />
              </div>

              <div className="card-body pt-3">
                <a href="">Lorem ipsum dolor sit amet.</a>
                <div className="price">
                  $80 <span className="text-decoration-line-through">$99</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="product card border-0">
              <div className="card-img">
                <img src={ProductImag} className="w-100" />
              </div>

              <div className="card-body pt-3">
                <a href="">Lorem ipsum dolor sit amet.</a>
                <div className="price">
                  $80 <span className="text-decoration-line-through">$99</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="product card border-0">
              <div className="card-img">
                <img src={ProductImag} className="w-100" />
              </div>

              <div className="card-body pt-3">
                <a href="">Lorem ipsum dolor sit amet.</a>
                <div className="price">
                  $80 <span className="text-decoration-line-through">$99</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="product card border-0">
              <div className="card-img">
                <img src={ProductImag} className="w-100" />
              </div>

              <div className="card-body pt-3">
                <a href="">Lorem ipsum dolor sit amet.</a>
                <div className="price">
                  $80 <span className="text-decoration-line-through">$99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
