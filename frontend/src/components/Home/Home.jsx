import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay  } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Hero.css"
import Image1 from "../../assets/image1.jpg";
import Image2 from "../../assets/new.jpg";
import Image3 from "../../assets/image3.jpg";

const Home = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
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
            <button>Shop Now</button>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="slide">
          <img src={Image2} />
          <div className="content">
            <h2>New Arrivals</h2>
            <button>Explore</button>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="slide">
          <img src={Image3} />
          <div className="content">
            <h2>Trending Products</h2>
            <button>Buy Now</button>
          </div>
        </div>
      </SwiperSlide>

    </Swiper>
  );
};

export default Home;