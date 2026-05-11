import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import banner from "../../../assets/download.png";
import { Link } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import googleSvg from "../../../assets/google.svg";
import facebookSvg from "../../../assets/facebook.svg";
import "./Signup.css";
const Signup = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);

  const isValidForm = !name || !email || !password || !image;

  const { signIn } = useSignIn();

  const singInWithGoogle = async () => {
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/user/login",
      redirectUrlComplete: "/user/login",
    });
  };

  const singInWithFacebook = async () => {
    await signIn.authenticateWithRedirect({
      strategy: "oauth_facebook",
      redirectUrl: "/",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <div className="signup-left">
          <div className="form-content">
            <h1>Create an account</h1>

            <form>
              <div className="input-group">
                <label>Name</label>
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

              <button disabled={isValidForm} className="signup-btn">
                Sign up
              </button>
            </form>

            <div className="divider">
              <span></span>
              <p>Or</p>
              <span></span>
            </div>

            <div className="social-buttons">
              <button onClick={singInWithGoogle}>
                <img className="google-icon" src={googleSvg} alt="" />
                <span>Google</span>
              </button>

              <button onClick={singInWithFacebook}>
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
  );
};

export default Signup;
