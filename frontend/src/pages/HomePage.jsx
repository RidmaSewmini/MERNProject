import  { useState, useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroImg1 from '../Asset/HeroImg1.jpg';
import Product1 from '../Asset/Product1.jpg';
import Product2 from '../Asset/Product2.jpg';
import Product3 from '../Asset/Product3.jpg';
import Product4 from '../Asset/Product4.jpg';
import Product5 from '../Asset/Product5.jpg';
import Product6 from '../Asset/Product6.jpg';
import Service1 from '../Asset/Service1.jpg';
import Service2 from '../Asset/Service2.jpg';
import Service3 from '../Asset/Service3.jpg';
import Service4 from '../Asset/Service4.jpg';
import TechService from '../Asset/TechService.jpg';
import Customer1 from '../Asset/Customer1.jpg';
import Customer2 from '../Asset/Customer2.jpg';
import Customer3 from '../Asset/Customer3.jpg';
import Component1 from '../Asset/Component1.png';
import Component2 from '../Asset/Component2.png';
import Component3 from '../Asset/Component3.png';
import Component4 from '../Asset/Component4.png';
import Component5 from '../Asset/Component5.png';
import Component6 from '../Asset/Component6.png';
import Component7 from '../Asset/Component7.png';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef(null);
  
const products = [
  {
    title: "Gaming Motherboards",
    img: Component1,
  },
  {
    title: "Premium Graphics Cards",
    img: Component2,
  },
  {
    title: "Gaming Laptops",
    img: Component3,
  },
  {
    title: "Gaming Monitors",
    img: Component4,
  },
  {
    title: "Desktop PC",
    img: Component5,
  },
  {
    title: "Gaming Peripherals",
    img: Component6,
  },
  {
    title: "Premium Components",
    img: Component7,
  },
];

  const services = [
    {
      title: "Upgrade & Trade-In Program",
      description: "When you buy from us, get exclusive access to upgrade your components through our bidding system – sell your old parts directly back to us!Level up your rig with seamless trade-ins and nonstop upgrade options.",
      image: Service1,
      icon: "🔄"
    },
    {
      title: "Component Insurance",
      description: "All purchases include our premium protection plan with accidental damage coverage and free technical support. Play without worry — from crashes to spills, we’ve got your gear covered so you can stay focused on victory.",
      image: Service2,
      icon: "🛡️"
    },
    {
      title: "High-End Rentals",
      description: "Need cutting-edge tech on demand? Rent top-tier GPUs, CPUs, and workstations for your projects—no long-term commitment required.Scale up instantly, pay only for what you use, and access the latest hardware anytime.Focus on your work, we handle the heavy tech.",
      image: Service3,
      icon: "⏳"
    },
    {
      title: "Pre-Order New Launches",
      description: "Be first in line for the latest tech! Pre-order cutting-edge components now and reserve them before they hit the market.Upgrade your setup without the wait and stay ahead in performance. Experience the future of computing before anyone else.",
      image: Service4,
      icon: "🚀"
    }
  ];

const feedbacks = [
  {
    name: "Sally H. McDuffie",
    text: "The controller has completely transformed my gaming experience. The precision and responsiveness are out of this world - I've noticed a dramatic improvement in my aim and overall performance.",
    img: Customer1,
  },
  {
    name: "Lindsay J. Ross",
    text: "The build quality and ergonomics of the gaming keyboards are truly next-level. I can game for hours without any discomfort or fatigue. It's clear the designers really understand the needs of hardcore players.",
    img: Customer2,
  },
  {
    name: "Timothy R. Clark",
    text: "As a pro gamer, I appreciate how intuitive the mouse feels. It's incredibly responsive and reliable during high-pressure matches. Highly recommended for anyone serious about gaming.",
    img: Customer3,
  },
];
  // Auto-rotate services every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [services.length]);

  // Auto slide every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % feedbacks.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);



  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 ">
        <div className="w-full">
          {/* Hero Section */}
          <div
            className="hero min-h-screen relative"
            style={{
              backgroundImage: `url(${HeroImg1})`,
            }}>
             <div className="hero-content pr-40 text-neutral-content text-center ml-auto justify-end">
                <div className="max-w-md text-white text-center">
                  <h2 className="mb-5 text-3xl font-bold font-aldrich">"Empower Your Tech Journey"</h2>
                  <p className="mb-5 text-xl ">
                    Your Tech Journey with TechSphere Lanka 
                    Upgrade effortlessly with our buyback program, rent high-end gear, or book expert repairs. 
                    We make cutting-edge technology accessible and affordable. Experience the future of tech ownership today.
                  </p>
                  <a href="#_" class="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-gray-300 transition duration-300 ease-out border-2 border-gray-300 rounded-full shadow-md group">
                      <span class="absolute inset-0 flex items-center justify-center w-full h-full text-black duration-300 -translate-x-full bg-gray-300 group-hover:translate-x-0 ease">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </span>
                      <span class="absolute flex items-center justify-center w-full h-full text-gray-300 transition-all duration-300 transform group-hover:translate-x-full ease">Shop the Collection</span>
                      <span class="relative invisible">Shop the Collection</span>
                  </a>
                </div>
              </div>
          </div>



          {/* Featured Builds Section */}
<section className="bg-base-200 text-black py-16">
      {/* Heading */}
      <h2 className="text-center text-3xl md:text-4xl font-bold font-aldrich tracking-wide mb-12">
        OUR PRODUCTS
      </h2>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-10 justify-items-center">
        {products.map((product, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <img
              src={product.img}
              alt={product.title}
              className="h-32 object-contain mb-4"
            />
            <p className="text-sm md:text-base">{product.title}</p>
          </div>
        ))}
      </div>
    </section>

          {/* Services Showcase */}
          <section className="py-20 px-8 bg-gradient-to-br from-base-300 to-base-200 relative overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-radial from-primary/10 to-transparent opacity-30"></div>
            
            <div className="text-center mb-12 max-w-4xl mx-auto relative z-10">
              <h2 className="text-4xl font-bold font-aldrich mb-4">Our Premium Services</h2>
              <p className="text-xl text-gray-600">Exceptional benefits for every customer!</p>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
              {/* Service Navigation Dots */}
              <div className="flex justify-center gap-4 mt-8 mb-12">
                {services.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === activeService ? 'bg-primary scale-125' : 'bg-gray-400'
                    } hover:scale-110`}
                    onClick={() => setActiveService(index)}
                    aria-label={`View ${services[index].title}`}
                  />
                ))}
              </div>

              {/* Main Service Display */}
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div 
                  className="w-full lg:w-1/2 h-96 rounded-2xl overflow-hidden shadow-2xl relative"
                  style={{ 
                    backgroundImage: `url(${services[activeService].image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                  <div className="absolute bottom-6 right-6 text-5xl animate-pulse">
                    {services[activeService].icon}
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2 p-6">
                  <h3 className="text-3xl font-bold font-aldrich mb-6 relative pb-3 after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-primary">
                    {services[activeService].title}
                  </h3>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {services[activeService].description}
                  </p>
                  <button className="btn btn-outline btn-gray-600 group">
                    Learn More 
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Tech Services Section */}
          <section className="py-24 px-8 bg-base-200">
            <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
              <div className="w-full lg:w-1/2" data-aos="fade-right">
                <h2 className="text-4xl font-bold font-aldrich mb-6">Expert Tech Services</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Whether you’re building a high-performance gaming rig, upgrading your workstation, or optimizing your system for peak efficiency, our certified technicians are here to provide premium support for all your tech needs. 
                  We combine expertise with precision to ensure your hardware and software run flawlessly. We offer:
                </p>
                <ul className="space-y-4 mb-8 text-lg">
                  {['Component Installation & Upgrades', 'System Diagnostics & Repairs', 
                    'Virus Removal & Security', 'Custom Water Cooling Setup', 'Data Recovery & Backup']
                    .map((service, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-3">→</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
                <button className="btn btn-primary px-8 py-3 text-lg">Book a Service</button>
              </div>
              <div className="w-full lg:w-1/2" data-aos="fade-left">
                <div className="rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105">
                  <img 
                    src={TechService} 
                    alt="Tech Support" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </section>
            
            {/*Customer feedback */}
            <div className="max-w-full bg-base-100 mx-auto py-16 px-4">
                  {/* Heading */}
                  <div className='px-20'>
                  <h2 className="text-3xl  font-bold mb-2 font-aldrich">
                    What Customers Say{" "}
                    <span className="text-purple-700">About Our Products</span>
                  </h2>
                  <p className="text-gray-500 mb-10 max-w-3xl">
                    Unequivocal Acclaim and Unwavering Endorsements from the World's Top
                    Esports Professionals, Renowned Streamers, and Hardcore PC Gaming
                    Enthusiasts
                  </p>

                  {/* Slider wrapper */}
                  <div className="relative overflow-hidden">
                    <div
                      className="flex transition-transform duration-700 ease-in-out"
                      style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                      {feedbacks.map((feedback, index) => (
                        <div
                          key={index}
                          className="min-w-full flex flex-col md:flex-row items-center gap-8 px-6"
                        >
                          <img
                            src={feedback.img}
                            alt={feedback.name}
                            className="w-80 h-80 rounded-xl object-cover shadow-md"
                          />
                          <div className="bg-base-100 w-80 h-80 p-6 rounded-xl shadow-md flex-1">
                            <Quote size={100} color="#7e22ce" />
                            <p className="text-gray-700 mt-6 italic">{feedback.text}</p>
                            <h3 className="mt-6 font-bold text-lg">{feedback.name}</h3>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center mt-6 gap-2">
                      {feedbacks.map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            idx === current ? "bg-purple-600" : "bg-gray-300"
                          }`}
                          onClick={() => setCurrent(idx)}
                        ></button>
                      ))}
                    </div>
                  </div>
                </div>
                </div>
          </div>
      </div>
      <Footer/>
    </div>
  );
}

export default HomePage;