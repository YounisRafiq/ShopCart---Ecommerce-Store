import React, { useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [openSearch, setOpenSearch] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="nav-bar">
      <div className={`sidebar ${openSidebar ? "show-sidebar" : ""}`}>
        <i
          onClick={() => setOpenSidebar(false)}
          className="ri-close-line close-sidebar"
        ></i>

        <ul className="links">
          <li>Home</li>

          <li>Shop</li>

          
            <li className="category-item">
              Categories
              <i className="ri-arrow-drop-down-line"></i>
              <ul className="dropdown-menu">
                <li>Men</li>
                <li>Women</li>
                <li>Electronics</li>
                <li>Shoes</li>
              </ul>
            </li>

          <li>About</li>
        </ul>

        <div className="sidebar-bottom">
          <div className="whish-list">
            <i className="ri-heart-line"></i>
            <i className="ri-shopping-cart-line"></i>
          </div>

          <div className="profile">
            <i className="ri-user-line"></i>
          </div>
        </div>
      </div>

      <div className="menu">
        <i onClick={() => setOpenSidebar(true)} className="ri-menu-4-line"></i>
      </div>

      <div className="logo">
        <img src={logo} alt="brand-logo" />
        <span>ShopCart</span>
      </div>

      <ul className="links">
        <li>Home</li>

        <li>Shop</li>

        <li className="category-item">
          Categories
          <i className="ri-arrow-drop-down-line"></i>
          <ul className="dropdown-menu">
            <li>Men</li>
            <li>Women</li>
            <li>Electronics</li>
            <li>Shoes</li>
          </ul>
        </li>

        <li>About</li>
      </ul>

      <div className={`search-bar ${openSearch ? "active" : ""}`}>
        <input type="text" placeholder="Search products..." />

        <i
          onClick={() => setOpenSearch(!openSearch)}
          className="ri-search-line"
        ></i>
      </div>

      {/* DESKTOP ICONS */}
      <div className="whish-list">
        <i className="ri-heart-line"></i>
        <i className="ri-shopping-cart-line"></i>
      </div>

      {/* PROFILE */}
      <div className="profile">
        <i className="ri-user-line"></i>
        <p>Profile</p>
      </div>
    </div>
  );
};

export default Navbar;
