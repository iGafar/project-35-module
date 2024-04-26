import React from "react";
import List from "../List/list";
import ProductItem from "../ProductItem/productItem";
import "./layout.css";

import { Route, Routes } from "react-router-dom";
import Header from "../Header/header";
import Initial from "../Initial/initial";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div className="container">
      <div className="gray-square">
        <Header />
        <Routes>
          <Route path="/" element={<Initial />} />
          <Route path={"/products/:productId"} element={<ProductItem />} />
          <Route path={"/products"} element={<List />} />
        </Routes>
      </div>
    </div>
  );
};

export default Layout;
