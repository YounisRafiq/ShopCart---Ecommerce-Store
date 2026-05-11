// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../components/auth//SignUp/Signup";
import Login from "../components/auth/Login/Login";
import Home from "../components/Home/Home";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
