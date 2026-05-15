import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Home.css";
import Image1 from "../../assets/image1.jpg";
import Image2 from "../../assets/new.jpg";
import Image3 from "../../assets/image3.jpg";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/product");
        console.log(res.data.data.products);
        setProducts(res.data.data.products);
      } catch (error) {
        console.log(error);
      }
    };

    getProducts();
  }, []);

  const mensProducts = products.filter((item) => item.category === "Men");
  const womenProducts = products.filter((item) => item.category === "Women");
  const electronicsProducts = products.filter(
    (item) => item.category === "Electronics",
  );
  const shoesProducts = products.filter(
    (item) => item.category === "Shoes",
  );

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        grabCursor
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="hero-swiper"
      >
        <SwiperSlide>
          <div className="slide">
            <img src={Image1} />
            <div className="content">
              <h2>Big Sale 50% OFF</h2>
              <p>
                Grab unbeatable deals on top products with massive 50% discounts
                for a limited time.
              </p>
              <button style={{ borderRadius: "50px" }}>Shop Now</button>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="slide">
            <img src={Image2} />
            <div className="content">
              <h2>New Arrivals</h2>
              <p>
                Discover the latest additions featuring fresh designs and
                updated styles just for you.
              </p>
              <button
                style={{
                  background: "whiteSmoke",
                  color: "black",
                  borderRadius: "50px",
                }}
              >
                Explore
              </button>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="slide">
            <img src={Image3} />
            <div className="content">
              <h2>Trending Products</h2>
              Explore the most popular and in-demand products trending right
              now.
              <button style={{ borderRadius: "50px" }}>Buy Now</button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <section className="section">
        <div className="men-section">
          <div className="collection">
            <h2>
              Men's <span>Collection</span>
            </h2>
          </div>
          <div className="products-grid">
            {mensProducts.map((item) => (
              <div className="card" key={item._id}>
                <img src={item.images[0].url} alt={item.title} />

                <div className="title">
                  <p>{item.title}</p>
                </div>

                <div className="description">
                  <p>{item.description}</p>
                </div>

                <div className="category">
                  <h6>{item.category}</h6>
                </div>

                <div className="rating">
                  <p>****</p>
                </div>

                <div className="price">
                  <h6>Rs {item.price}/-</h6>
                </div>

                <button>Add To Cart</button>
              </div>
            ))}
          </div>

          <div className="view-all">
            <a href="#">View All →</a>
          </div>
        </div>
        <div className="women-section">
          <div className="collection">
            <h2>
              Women's <span>Collection</span>
            </h2>
          </div>

          <div className="products-grid">
            {womenProducts.map((item) => (
              <div className="card">
                <img src={item.images[0].url} alt="first" />
                <div className="title">
                  <p>{item.title}</p>
                </div>

                <div className="description">
                  <p>{item.description}</p>
                </div>

                <div className="category">
                  <h6>{item.category}</h6>
                </div>

                <div className="rating">
                  <p>****</p>
                </div>

                <div className="price">
                  <h6>Rs {item.price}/-</h6>
                </div>
                <button>Add To Cart</button>
              </div>
            ))}
          </div>

          <div className="view-all">
            <a href="">View All →</a>
          </div>
        </div>
        <div className="electronics-section">
          <div className="collection">
            <h2>
              Electronic's <span>Collection</span>
            </h2>
          </div>

          <div className="products-grid">
            {electronicsProducts.map((item) => (
              <div className="card">
                <img src={item.images[0].url} alt="first" />
               <div className="title">
                  <p>{item.title}</p>
                </div>

                <div className="description">
                  <p>{item.description}</p>
                </div>

                <div className="category">
                  <h6>{item.category}</h6>
                </div>

                <div className="rating">
                  <p>****</p>
                </div>

                <div className="price">
                  <h6>Rs {item.price}/-</h6>
                </div>
                <button>Add To Cart</button>
              </div>
            ))}
          </div>

          <div className="view-all">
            <a href="">View All →</a>
          </div>
        </div>
        <div className="shoes-section">
          <div className="collection">
            <h2>
              Shoes <span>Collection</span>
            </h2>
          </div>

          <div className="products-grid">
            {shoesProducts.map((item) => (
              <div className="card">
                <img src={item.images[0].url} alt="first" />
                <div className="title">
                  <p>{item.title}</p>
                </div>

                <div className="description">
                  <p>{item.description}</p>
                </div>

                <div className="category">
                  <h6>{item.category}</h6>
                </div>

                <div className="rating">
                  <p>****</p>
                </div>

                <div className="price">
                  <h6>Rs {item.price}/-</h6>
                </div>
                <button>Add To Cart</button>
              </div>
            ))}
          </div>

          <div className="view-all">
            <a href="">View All →</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
