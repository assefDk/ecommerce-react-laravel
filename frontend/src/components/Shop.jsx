import React, { useEffect, useState, useCallback } from "react";
import Layout from "./common/Layout";
import ProductImag from "../assets/images/eight.jpg";
import { Link, useSearchParams } from "react-router-dom";
import { apiUrl } from "../components/common/http";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [catChecked, setCatChecked] = useState(() => {
    const category = searchParams.get("category");
    return category ? category.split(",") : [];
  });
  const [brands, setBrands] = useState([]);
  const [brandChecked, setBrandChecked] = useState(() => {
    const brand = searchParams.get("brand");
    return brand ? brand.split(",") : [];
  });
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(() => {
    let search = [];
    let params = "";

    if (catChecked.length > 0) {
      search.push(["category", catChecked]);
    }

    if (brandChecked.length > 0) {
      search.push(["brand", brandChecked]);
    }

    if (search.length > 0) {
      params = new URLSearchParams(search);
      setSearchParams(params);
    } else {
      setSearchParams([]);
    }

    fetch(`${apiUrl}/get-products?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setProducts(result.data);
        } else {
          console.log("Something went wrong");  
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [catChecked, brandChecked]);  

  const fetchCategories = () => {
    fetch(`${apiUrl}/get-categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setCategories(result.data);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const handleCategory = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setCatChecked((prev) => [...prev, value]);
    } else {
      setCatChecked((prev) => prev.filter((id) => id !== value));
    }
  };

  const fetchBrands = () => {
    fetch(`${apiUrl}/get-brands`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setBrands(result.data);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch((error) => console.error("Error fetching brands:", error));
  };

  const handleBrand = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setBrandChecked((prev) => [...prev, value]);
    } else {
      setBrandChecked((prev) => prev.filter((id) => id !== value));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);  

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  return (
    <Layout>
      <div className="container">
        <nav aria-label="breadcrumb" className="py-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item " aria-current="page">
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
                  {categories &&
                    categories.map((category) => {
                      return (
                        <li className="mb-2" key={category.id}>
                          <input
                            type="checkbox"
                            value={category.id}
                            onChange={handleCategory}
                            checked={
                              searchParams.get("category")
                                ? searchParams
                                    .get("category")
                                    .includes(category.id)
                                : false
                            }
                          />
                          <label htmlFor="" className="py-2 ms-2">
                            {category.name}
                          </label>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
            <div className="card shadow border-0 mb-3">
              <div className="card-body p-4">
                <h3 className="mb-3">Brands</h3>
                <ul>
                  {brands &&
                    brands.map((brand) => {
                      return (
                        <li className="mb-2" key={brand.id}>
                          <input
                            type="checkbox"
                            value={brand.id} // تصحيح: vocab إلى value
                            onChange={handleBrand} // تغيير onClick إلى onChange
                            checked={
                              searchParams.get("brand")
                                ? searchParams
                                    .get("brand")
                                    .includes(brand.id)
                                : false
                            }
                          />
                          <label htmlFor="" className="py-2 ms-2">
                            {brand.name}
                          </label>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <div className="row pb-5">
              {products &&
                products.map((product) => {
                  return (
                    <div className="col-md-4 col-6" key={product.id}>
                      <div className="product card border-0">
                        <div className="card-img">
                          <Link to={`/product/${product.id}`}>
                            {/* إضافة id المنتج */}
                            {!product.image_url || product.image_url === "" ? (
                              <img
                                src="https://placehold.co/300x300?text=No+Image"
                                alt={product.title}
                                className="w-100"
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            ) : (
                              <img
                                src={product.image_url}
                                alt={product.title}
                                className="w-100"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/300x300?text=No+Image";
                                }}
                              />
                            )}
                          </Link>
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
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
