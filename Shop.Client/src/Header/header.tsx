import React from "react";
import "./header.css";
import logo from "./images/bookstore-shop-logo-icon.jpg";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <div>
      <img className="logo" src={logo} alt="logo" />
      <h1 className="text-body-header">Shop.Client</h1>
    </div>
  );
};

export default Header;
