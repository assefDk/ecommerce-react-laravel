import React, { useEffect, useState } from "react";
import ProductImag from "../../assets/images/eight.jpg";
import { apiUrl } from "../common/http";
import { Link } from "react-router-dom";

const FeaturedProduct = () => {

    const [products, setProducts] = useState([]);
  
    const featuredProduct = async () => {
      await fetch(apiUrl + "/get-featured-porducts", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setProducts(result.data);
          // console.log(result);
        });
    };
  
    useEffect(() => {
      featuredProduct();
    }, []);
  return (
    <section className="section-2 py-5">
      <div className="container">
        <h2>Featured Products</h2>
        <div className="row mt-4">
           {products &&
            products.map((product) => {
              return (
                <div className="col-md-3 col-6" key={`product-${product.id}`}>
                  <div className="product card border-0">
                    <div className="card-img">
                      {!product.image_url || product.image_url === "" ? (
                        <img
                          src="https://placehold.co/50x50?text=No+Image"
                          alt={product.title}
                          className="w-100"
                          style={{ objectFit: "cover", borderRadius: "4px" }}
                        />
                      ) : (
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-100"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/50x50?text=No+Image";
                          }}
                        />
                      )}

                    </div>

                    <div className="card-body pt-3">
                      <Link to={`/product/${product.id}`}>
                        {product.title}
                      </Link>
                      <div className="price">
                        ${product.price} &nbsp;
                        {product.compare_price && (
                          <span className="text-decoration-line-through">
                            ${product.compare_price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
