import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BidImg1 from '../Asset/BiddingPageAssets/BidImg1.png';
import CompletedAuction from '../Asset/BiddingPageAssets/CompletedAuctionImg.png';
import CurrentAuction from '../Asset/BiddingPageAssets/CurrentAuctionImg.png';
import UpcomingAuction1 from '../Asset/BiddingPageAssets/AuctionImg1.jpg';
import UpcomingAuction2 from '../Asset/BiddingPageAssets/AuctionImg2.png';
import Razer from '../Asset/BiddingPageAssets/Razer.jpg';
import Logitech from '../Asset/BiddingPageAssets/Logitech.jpg';
import Aorus from '../Asset/BiddingPageAssets/Aorus.jpg';
import AsusRog from '../Asset/BiddingPageAssets/AsusRog.png';
import { Heart, Eye, Share2 } from "lucide-react";
import Plasma from '../components/Plasma';

const heroSlides = [
  {
    title: "Your Products Deserve a Second Life",
    description:
      "Sell your products directly to eager bidders and use your earnings to power up with premium upgrades. One marketplace — endless possibilities.",
    img: BidImg1,
    bgImg: "",
  },
  {
    title: "Upgrade Smarter, Not Harder",
    description:
      "Join thousands of sellers turning yesterday's gadgets into tomorrow's opportunities. List today and watch the bidding war begin.",
    img: BidImg1,
  },
  {
    title: "Bid on Premium Tech for Less",
    description:
      "Why pay full price? Compete in real-time auctions and grab used devices at unbeatable prices, only on our marketplace.",
    img: BidImg1,
  },
];

const auctionProducts = [
  {
    id: 1,
    title: "1964 Ferrari 250 LM",
    desc: "Classic sports car, collector's edition with timeless design.",
    price: "6,000,000 PKR",
    img: "/cars/ferrari-red.jpg",
    time: 2419200, // in seconds (30h)
  },
  {
    id: 2,
    title: "1994 McLaren F1 LM",
    desc: "Legendary supercar with race-bred performance.",
    price: "6,000,000 PKR",
    img: "/cars/mclaren.jpg",
    time: 2419200,
  },
  {
    id: 3,
    title: "1961 Ferrari 250 GT SWB California Spyder",
    desc: "Exclusive convertible masterpiece, rare in market.",
    price: "6,000,000 PKR",
    img: "/cars/ferrari-blue.jpg",
    time: 2419200,
  },
  {
    id: 4,
    title: "Corolla Hybrid",
    desc: "Modern efficiency meets reliability, perfect for city drives.",
    price: "6,000,000 PKR",
    img: "/cars/corolla.jpg",
    time: 2419200,
  },
    {
    id: 4,
    title: "Corolla Hybrid",
    desc: "Modern efficiency meets reliability, perfect for city drives.",
    price: "6,000,000 PKR",
    img: "/cars/corolla.jpg",
    time: 2419200,
  },
    {
    id: 4,
    title: "Corolla Hybrid",
    desc: "Modern efficiency meets reliability, perfect for city drives.",
    price: "6,000,000 PKR",
    img: "/cars/corolla.jpg",
    time: 2419200,
  },
];

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h : ${m}m : ${s}s`;
};

const AuctionSection = () => {
  const [activeTab, setActiveTab] = useState("ending");
  const [timers, setTimers] = useState(
    auctionProducts.map((p) => ({ id: p.id, time: p.time }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) =>
          t.time > 0 ? { ...t, time: t.time - 1 } : { ...t, time: 0 }
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = auctionProducts; // later filter by tab (ending, new, trending)

  return (
    <div className="py-12 bg-base-300">
      {/* Tabs */}
      <div className="flex justify-center space-x-8 mb-8 text-xl font-semibold pt-16">
        <button
          onClick={() => setActiveTab("ending")}
          className={activeTab === "ending" ? "text-black" : "text-gray-400"}
        >
          Ending Soon
        </button>
        <button
          onClick={() => setActiveTab("new")}
          className={activeTab === "new" ? "text-black" : "text-gray-400"}
        >
          Newly Added
        </button>
        <button
          onClick={() => setActiveTab("trending")}
          className={activeTab === "trending" ? "text-black" : "text-gray-400"}
        >
          Trending
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 px-20 py-20">
        {filteredProducts.map((product) => {
          const timer = timers.find((t) => t.id === product.id);
          return (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative">
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                {/* Icons */}
                <div className="absolute top-2 left-2 flex space-x-2">
                  <button className="p-2 bg-white rounded-full shadow">
                    <Share2 size={16} />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow">
                    <Heart size={16} />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow">
                    <Eye size={16} />
                  </button>
                </div>
                {/* Timer */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded shadow font-bold text-sm">
                  {formatTime(timer?.time || 0)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.desc}
                </p>
                <p className="text-red-600 font-bold mt-2">{product.price}</p>
                <button className="w-full bg-gray-500 hover:bg-gray-700 text-white py-2 rounded mt-3">
                  Start Bid
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View all */}
      <div className="text-center mt-8">
        <button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg shadow">
          View all products
        </button>
      </div>
    </div>
  );
};

const BiddingPage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    pauseOnHover: true,
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 ">
        <div className="w-full">
          {/* Hero Section */}
        <section className="relative w-full h-[100vh] text-white overflow-hidden">
            <Slider {...settings} className="h-full">
                {heroSlides.map((slide, index) => (
                <div
                    key={index}
                    className="relative flex items-center h-[90vh] px-12 lg:px-24"
                    style={{
                    backgroundImage: `url(${slide.bgImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    }}
                >
                    {/* Dark overlay for readability */}
                    <div className="absolute inset-0 bg-black/60"></div>

                    {/* Content Wrapper */}
                    <div className="relative z-10 flex flex-col md:flex-row items-center w-full">
                    {/* Left Content */}
                    <div className="flex-1 max-w-xl space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bol font-aldrich leading-snug">
                        {slide.title}
                        </h1>
                        <p className="text-lg text-gray-300">{slide.description}</p>
                        <div className="flex space-x-4 pt-4">
                        <button className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition">
                            Start Selling
                        </button>
                        <a href="#_" className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple-600 rounded-full shadow-md group">
                            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-600 group-hover:translate-x-0 ease">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </span>
                            <span className="absolute flex items-center justify-center w-full h-full text-purple-600 transition-all duration-300 transform group-hover:translate-x-full ease">Start Bidding</span>
                            <span className="relative invisible">Start Bidding</span>
                        </a>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="flex-1 flex justify-end">
                        <img
                        src={slide.img}
                        alt={slide.title}
                        className="w-[550px] h-auto object-contain drop-shadow-2xl"
                        />
                    </div>
                    </div>
                </div>
                ))}
            </Slider>
            </section>
    </div>

{/* New Section Below Hero */}
      <div className="bg-base-200 text-black px-16 py-16 grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Current Auctions */}
        <div
          className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg"
          style={{
            backgroundImage:
              `url(${CurrentAuction})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition" />
          <div className="relative p-20 text-white">
            <h2 className="text-2xl font-bold">Current Auctions</h2>
            <p className="mt-2">20 High end Components</p>
          </div>
        </div>

        {/* Completed Auctions */}
        <div
          className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg"
          style={{
            backgroundImage:
              `url(${CompletedAuction})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition" />
          <div className="relative p-20 text-white">
            <h2 className="text-2xl font-bold">Completed Auctions</h2>
            <p className="mt-2">200 High end Components</p>
          </div>
        </div>
      </div>

      {/* Upcoming Auctions */}
      <section className="bg-base-200 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-purple-600 font-semibold text-lg">Just wait and get best deals.</p>
          <h2 className="text-3xl font-bold font-aldrich">Upcoming Auctions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src={UpcomingAuction1}
              alt="1935 Duesenberg SSJ"
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">1935 Duesenberg SSJ</h3>
              <p className="text-gray-600 text-sm mt-2">
                The 1935 Duesenberg SSJ is an American automotive legend. The SSJ
                draws power from a dual-supercharged, inline-eight-cylinder engine
                supplying 400-hp.
              </p>
              <div className="flex justify-between items-center mt-4">
                <button className="px-4 py-2 bg-gray-200 rounded">Reminder</button>
                <button className="px-4 py-2 bg-gray-700 text-white rounded">
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src={UpcomingAuction2}
              alt="1994 McLaren F1 LM"
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">1994 McLaren F1 LM</h3>
              <p className="text-gray-600 text-sm mt-2">
                Most cars that sell for tens of millions of dollars are from half a
                century ago. The McLaren F1 debuted in 1992 and already has an
                astronomical value.
              </p>
              <div className="flex justify-between items-center mt-4">
                <button className="px-4 py-2 bg-gray-200 rounded">Reminder</button>
                <button className="px-4 py-2 bg-gray-700 text-white rounded">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Auction Products Section */}
    <AuctionSection />


      {/* Register Banner */}
      <div className="bg-base-200 text-black pl-20 pr-16 py-16">
        <div className="max-w-5xl ">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-3xl font-bold font-aldrich">100% Online Auction</h2>
              <p className="text-gray-600 text-sm mt-2 max-w-xl">
                Most cars that sell for tens of millions of dollars are from half a
                century ago. The McLaren F1 debuted in 1992 and already has an
                astronomical value.
              </p>
            </div>
            <button className="relative h-12 overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6
            text-neutral-950 before:absolute before:bottom-0 before:left-0 before:block before:h-full before:w-full before:translate-x-full
              before:bg-neutral-100 before:transition-transform hover:before:translate-x-0 ml-8 flex-shrink-0">
              <span className="relative">Register as a Auctioneer</span>
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Brand Slider Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-red-500 font-medium">Find and win your favourite brand</p>
            <h2 className="text-3xl font-bold font-aldrich">Auction on Brands</h2>
          </div>

          {(() => {
            const brandSettings = {
              dots: false,
              infinite: true,
              speed: 600,
              slidesToShow: 4,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 2500,
              arrows: false,
              responsive: [
                { breakpoint: 1024, settings: { slidesToShow: 3 } },
                { breakpoint: 768, settings: { slidesToShow: 2 } },
                { breakpoint: 480, settings: { slidesToShow: 1 } },
              ],
            };

            const brands = [
              { name: "Toyota", img: Razer, link: "/auctions/toyota" },
              { name: "Honda", img: Logitech, link: "/auctions/honda" },
              { name: "BMW", img: Aorus, link: "/auctions/bmw" },
              { name: "KIA", img: AsusRog, link: "/auctions/kia" },
            ];

            return (
            <Slider {...brandSettings}>
              {brands.map((brand, index) => (
                <div key={index} className="px-4">
                  <a
                    href={brand.link}
                    className="block shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition h-40 w-60 relative"
                    style={{
                      backgroundImage: `url(${brand.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                  </a>
                </div>
              ))}
            </Slider>
            );
          })()}
        </div>
      </section>



    </div>

    <Footer/>
    </div>
  );
};

export default BiddingPage;