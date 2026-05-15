import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import user from "../../assets/user.svg";
const Navbar = () => {
  const [openSearch, setOpenSearch] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showNavbar , setShowNavbar] = useState(true);

  const lastScrollY = useRef(0);

   useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      const scrollDifference =
        Math.abs(currentScrollY - lastScrollY.current);

      if (scrollDifference < 20) return;

      if (
        currentScrollY > lastScrollY.current &&
        currentScrollY > 100
      ) {
        setShowNavbar(false);
      }

      else {
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);
 

  return (
    <div className={showNavbar ? "nav-bar" : "nav-bar hide"}>
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
            <p>Profile</p>
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

        <li>Dashboard</li>

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

      <div className="whish-list">
        <i className="ri-heart-line"></i>
        <i className="ri-shopping-cart-line"></i>
      </div>

      <div className="profile">
        <img src={user} alt="" />
      </div>
    </div>
  );
};

export default Navbar;
