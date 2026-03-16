import Layout from "./common/Layout";
import { Link } from "react-router-dom";
import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// استيراد react-bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import { Tabs, Tab } from "react-bootstrap";

import ProductImgOne from "../assets/images/mens/five.jpg";
import ProductImgTow from "../assets/images/mens/six.jpg";
import ProductImgThree from "../assets/images/mens/seven.jpg";
import { Rating } from "react-simple-star-rating";

const Product = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [rating, setRating] = useState(4);

  return (
    <Layout>
      <div className="container product-detail">
        <div className="row">
          <div className="col-md-12">
            <nav aria-label="breadcrumb" className="py-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>

                <li className="breadcrumb-item">
                  <Link to="/shop">Shop</Link>
                </li>

                <li className="breadcrumb-item active">Dummy Product Title</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-md-5">
            <div className="row">
              <div className="col-2">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  direction={"vertical"}
                  spaceBetween={10}
                  slidesPerView={3}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper mt-2"
                >
                  <SwiperSlide>
                    <img src={ProductImgOne} alt="product" className="w-100" />
                  </SwiperSlide>

                  <SwiperSlide>
                    <img src={ProductImgTow} alt="product" className="w-100" />
                  </SwiperSlide>

                  <SwiperSlide>
                    <img
                      src={ProductImgThree}
                      alt="product"
                      className="w-100"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>

              {/* الصورة الكبيرة */}
              <div className="col-10">
                <Swiper
                  loop={true}
                  spaceBetween={10}
                  navigation={true}
                  thumbs={{
                    swiper:
                      thumbsSwiper && !thumbsSwiper.destroyed
                        ? thumbsSwiper
                        : null,
                  }}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper2"
                >
                  <SwiperSlide>
                    <img src={ProductImgOne} alt="product" className="w-100" />
                  </SwiperSlide>

                  <SwiperSlide>
                    <img src={ProductImgTow} alt="product" className="w-100" />
                  </SwiperSlide>

                  <SwiperSlide>
                    <img
                      src={ProductImgThree}
                      alt="product"
                      className="w-100"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>

          {/* تفاصيل المنتج */}
          <div className="col-md-7">
            <h2>Dummy Product Title</h2>

            <div className="d-flex">
              <Rating size={20} readOnly initialValue={rating} />
              <span className="pt-1 ps-2">10 Reviews</span>
            </div>

            <div className="price h3 py-3">
              $199.00{" "}
              <span className="text-decoration-line-through">$299.00</span>
            </div>

            <div>
              Lorem ipsum dolor sit amet,
              <br /> consectetur adipiscing elit.
              <br /> Sed do eiusmod tempor incididunt ut labore.
              <br />
            </div>

            <div className="pt-3">
              <strong>Select Size</strong>
              <div className="sizes pt-2">
                <button className="btn btn-size">S</button>
                <button className="btn btn-size ms-1">M</button>
                <button className="btn btn-size ms-1">L</button>
                <button className="btn btn-size ms-1">XL</button>
              </div>
            </div>

            <div className="add-to-cart my-4">
              <button className="btn btn-primary text-uppercase">
                Add to Cart
              </button>
            </div>

            <hr />

            <div>
              <strong>SKU:</strong>
              1234567890
            </div>
          </div>
        </div>

        <div className="row pb-5">
          <div className="col-md-12">
            <Tabs
              defaultActiveKey="profile"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="home" title="Description">
                Tab content for Description
              </Tab>
              <Tab eventKey="profile" title="Reviews (10)">
                Tab content for Reviews
              </Tab>
               
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;