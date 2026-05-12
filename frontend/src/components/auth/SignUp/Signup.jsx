import React, { useEffect, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import banner from "../../../assets/download.png";
import { Link } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import googleSvg from "../../../assets/google.svg";
import facebookSvg from "../../../assets/facebook.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loadinBar from "../../../assets/loading bar.gif";
import Swal from "sweetalert2";

import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [viewPassword, setViewPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidForm = !name || !email || !password || !image;

  const { signIn } = useSignIn();

  const singInWithGoogle = async () => {
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/",
      redirectUrlComplete: "/",
    });
  };

  const singInWithFacebook = async () => {
    await signIn.authenticateWithRedirect({
      strategy: "oauth_facebook",
      redirectUrl: "/",
      redirectUrlComplete: "/",
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatar", image);

      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/user/register",
        formData,
        { withCredentials: true },
      );

      setLoading(false);

      await Swal.fire({
        title: "Success",
        text: response.data?.message || "User Registered Successfully",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/user/login");
    } catch (error) {
      setLoading(false);

      setError(error.response?.data?.message || "Something Went Wrong");

      await Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Something Went Wrong",
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "Try Again",
      });
    }
  };


  return (
    <>
      <div className="signup-wrapper">
        <div className="signup-container">
          <div className="signup-left">
            <div className="form-content">
              <h1>Create an account</h1>
              
              <form method="post" onSubmit={submitForm}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="input-group password-group">
                  <label>Password</label>

                  <div className="password-input">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={viewPassword ? "text" : "password"}
                      placeholder="Enter your password"
                    />
                    <div
                      onClick={() => setViewPassword(!viewPassword)}
                      className="eye-icon"
                    >
                      {viewPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label>Profile image</label>
                  <input
                    name="avatar"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    placeholder="upload your image"
                  />
                </div>

                <div className="terms">
                  <input type="checkbox" />
                  <p>
                    I agree to all the <span>Terms & Conditions</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isValidForm || loading}
                  className="signup-btn"
                >
                  {loading ? "Loading..." : "Sign up"}
                </button>
              </form>

              <div className="divider">
                <span></span>
                <p>Or</p>
                <span></span>
              </div>

              <div className="social-buttons">
                <button type="button" onClick={singInWithGoogle}>
                  <img className="google-icon" src={googleSvg} alt="" />
                  <span>Google</span>
                </button>

                <button type="button" onClick={singInWithFacebook}>
                  <img className="facebook-icon" src={facebookSvg} alt="" />
                  <span>Facebook</span>
                </button>
              </div>

              <div className="login-link">
                Already have an account? <Link to={"/user/login"}>Log in</Link>
              </div>
            </div>
          </div>

          <div className="signup-right">
            <div className="glow"></div>

            <img src={banner} alt="shopping" className="right-image" />

            <div className="right-text">
              <h2>Discover Premium Fashion</h2>
              <p>
                Shop the latest trends with a secure and seamless shopping
                experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-bar">
          <img src={loadinBar} alt="" />
        </div>
      )}
    </>
  );
};

export default Signup;
