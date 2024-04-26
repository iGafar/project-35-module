import React from "react";
import "./loader.css";
import icon from "./images/loader3.webp";

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <img className="img-loader" src={icon} alt="loader" />
    </div>
  );
};

export default Loader;
