import Layout from "./common/Layout";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

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
import { apiUrl } from "./common/http";
import { CartContext } from "./context/Cart";
import { toast } from "react-toastify";

const Product = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [rating, setRating] = useState(4);
  const [product, setProduct] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [sizeSelected, setSizeSelected] = useState(null);
  const params = useParams();
  const { addToCart } = useContext(CartContext);

  const fetchProduct = () => {
    fetch(`${apiUrl}/get-product/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result.data);
        if (result.status === 200) {
          setProduct(result.data);
          setProductImages(result.data.images);
          setProductSizes(result.data.product_sizes);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const handleAddToCart = () => {
    if (productSizes.length > 0) {
      if (sizeSelected == null) {
        toast.error("Please select a size");
      } else {
        addToCart(product, sizeSelected);
        toast.success("Product added to cart");
      }
    } else {
      addToCart(product, null);
      toast.success("Product added to cart");
    }
  };
  // console.log(productImages);

  useEffect(() => {
    fetchProduct();
  }, []);

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
                  {productImages &&
                    productImages.map((image) => (
                      <SwiperSlide key={image.id}>
                        <img
                          src={`http://localhost:8000/uploads/products/small/${image.image}`}
                          alt="product"
                          height={100}
                          className="w-100"
                        />
                      </SwiperSlide>
                    ))}
                   
              </Swiper>
              </div>

              {/* الصورة الكبيرة */}
              <div className="col-10">
                <Swiper
                  loop={productImages.length > 2}
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
                  {productImages &&
                    productImages.map((image) => (
                      <SwiperSlide key={image.id}>
                        <img
                          src={`http://localhost:8000/uploads/products/large/${image.image}`}
                          alt="product"
                          className="w-100"
                        />
                      </SwiperSlide>
                    ))}
                  {/* <SwiperSlide>
                    <img src={ProductImgOne} alt="product" className="w-100" />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img src={ProductImgTow} alt="product" className="w-100" />
                  </SwiperSlide> */}
                </Swiper>
              </div>
            </div>
          </div>

        

          <div className="col-md-7">
            <h2>{product.title}</h2>

            <div className="d-flex">
              <Rating size={20} readOnly initialValue={rating} />
              <span className="pt-1 ps-2">10 Reviews</span>
            </div>

            <div className="price h3 py-3">
              ${product.price} &nbsp;
              {product.compare_price && (
                <span className="text-decoration-line-through">
                  ${product.compare_price}
                </span>
              )}
            </div>

            <div>{product.short_description}</div>

            <div className="pt-3">
              <strong>Select Size</strong>
              <div className="sizes pt-2">
                {productSizes &&
                  productSizes.map((product_size) => {
                    return (
                      <button
                        onClick={() => setSizeSelected(product_size.size.name)}
                        key={product_size.id}
                        className={`btn btn-size me-2 ${sizeSelected === product_size.size.name ? "active" : ""}`}
                      >
                        {product_size.size.name}
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="add-to-cart my-4">
              <button
                onClick={() => handleAddToCart()}
                className="btn btn-primary text-uppercase"
              >
                Add to Cart
              </button>
            </div>

            <hr />

            <div>
              <strong>SKU:</strong>
              {product.sku}
            </div>
          </div>
        </div>

        <div className="row pb-5">
          <div className="col-md-12">
            <Tabs
              defaultActiveKey="description"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="home" title="description">
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                ></div>
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
