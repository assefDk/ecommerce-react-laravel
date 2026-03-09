import React from "react";
import Hero from "./common/Hero";
import LatestProducts from "./common/LatestProducts";
import FeaturedProduct from "./common/FeaturedProduct";

import Layout from "./common/Layout";

const Home = () => {
  return (
    <>
      <Layout>
        <Hero />
        <LatestProducts />
        <FeaturedProduct />
      </Layout>

    </>
  );
};

export default Home;
