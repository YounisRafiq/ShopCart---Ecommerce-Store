import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Home.css";
import Image1 from "../../assets/image1.jpg";
import Image2 from "../../assets/new.jpg";
import Image3 from "../../assets/image3.jpg";

const Home = () => {
  return (
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
            <p>Grab unbeatable deals on top products with massive 50% discounts for a limited time.</p>
            <button style={{ borderRadius: "50px" }}>Shop Now</button>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="slide">
          <img src={Image2} />
          <div className="content">
            <h2>New Arrivals</h2>
            <p>Discover the latest additions featuring fresh designs and updated styles just for you.</p>
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
            Explore the most popular and in-demand products trending right now.
            <button style={{ borderRadius: "50px" }}>Buy Now</button>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Home;
