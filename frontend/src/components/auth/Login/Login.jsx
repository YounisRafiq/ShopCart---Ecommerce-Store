import { useState } from "react";
import banner from "../../../assets/download.png";
import { Link } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import loadingBar from "../../../assets/loading bar.gif";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [viewPassword, setViewPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidForm = !email || !password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/user/login",
        {
          email,
          password
        },
        { withCredentials: true },
      );

      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-left">
            <div className="form-content">
              <h1>Welcome Back</h1>

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="input-group password-group">
                  <label>Password</label>

                  <div className="password-input">
                    <input
                      value={password}
                      name="password"
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

                <div className="terms">
                  <input type="checkbox" />
                  <p>Remember me</p>
                </div>

                <button disabled={isValidForm} className="login-btn">
                  Log in
                </button>
              </form>

              <div className="login-link">
                Don&apos;t have an account?{" "}
                <Link to={"/user/signup"}>Sign up</Link>
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
          <img src={loadingBar} alt="" />
        </div>
      )}
    </>
  );
};

export default Login;
