import React, { useState } from "react";
import Navbar from "../components/Navbar";   
import Footer from "../components/Footer";  
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import WirelessMousemg1 from '../Asset/WirelessMouse.jpeg';
import WirelessKeyboardmg1 from '../Asset/WirelessKeyboard.jpeg';
import PortableMonitormg1 from '../Asset/PortableMonitor.jpeg';
import ExternalHardDrivemg1 from '../Asset/ExternalHardDrive.jpeg';
import USBCHubmg1 from '../Asset/USBCHub.jpeg';
import HpLaptopmg1 from '../Asset/HpLaptop.jpeg';
import MacBookmg1 from '../Asset/MacBook.jpeg';
import GamingMonitormg1 from '../Asset/GamingMonitor.jpeg';
import WiFiRoutermg1 from '../Asset/WiFiRouter.jpeg';
import NetworkSwitch8Portmg1 from '../Asset/NetworkSwitch8Port.jpeg';
import PowerlineAdaptermg1 from '../Asset/PowerlineAdapter.jpeg';
import USBCEthernetAdaptermg1 from '../Asset/USBCEthernetAdapter.jpeg';
import FlashDrives32GBmg1 from '../Asset/FlashDrives32GB.jpeg';
import FlashDrives128GBmg1 from '../Asset/FlashDrives128GB.jpeg';
import MemoryCardReadermg1 from '../Asset/MemoryCardReader.jpeg';
import PowerBank10000mAhmg1 from '../Asset/PowerBank10000mAh.jpeg';
import PortablePowerBank32000mAhmg1 from '../Asset/PortablePowerBank32000mAh.jpeg';
import USBChargingStationmg1 from '../Asset/USBChargingStation.jpeg';
import JBLbluetoothspeakermg1 from '../Asset/JBLbluetoothspeaker.jpeg';
import bluetoothheadphonesmg1 from '../Asset/bluetoothheadphones.jpeg';
import GamingMicrophonemg1 from '../Asset/GamingMicrophone.jpeg';
import Webcammg1 from '../Asset/Webcam.jpeg';
import gamingmotherboardmg1 from '../Asset/gamingmotherboard.jpg';
import GamingPCmg1 from '../Asset/GamingPC.jpg';
import BGimage01mg1 from '../Asset/BGimage01.jpeg';
import BGimage02mg1 from '../Asset/BGimage02.jpg';

const showcaseItems = [
  {
    name: "Wireless Mouse",
    img: WirelessMousemg1,
    category: "computing",
  },
  {
    name: "Wireless Keyboard",
    img: WirelessKeyboardmg1,
    category: "computing",
  },
  {
    name: "iMac Desktop Computer",
    img: PortableMonitormg1,
    category: "computing",
  },
  {
    name: "Gaming Motherboard",
    img: gamingmotherboardmg1,
    category: "computing",
  },
  {
    name: "Gaming PC",
    img: GamingPCmg1,
    category: "computing",
  },
   {
    name: "External Hard Drive (HDD)",
    img: ExternalHardDrivemg1,
    category: "computing",
  },
  {
    name: "Curved Gaming Monitor",
    img: GamingMonitormg1,
    category: "computing",
  },
  {
    name: "HP Pavilion Laptop",
    img: HpLaptopmg1,
    category: "computing",
  },
   {
    name: "Mac Book",
    img: MacBookmg1,
    category: "computing",
  },
   {
    name: "USB-C Hub",
    img: USBCHubmg1,
    category: "computing",
  },
  {
    name: "Wi-Fi Router",
    img: WiFiRoutermg1,
    category: "networking",
  },
  {
    name: "Network Switch 8-Port",
    img: NetworkSwitch8Portmg1,
    category: "networking",
  },
  {
    name: "Power line Adapter",
    img: PowerlineAdaptermg1,
    category: "networking",
  },
  {
    name: "USB-C Ethernet Adapter",
    img: USBCEthernetAdaptermg1,
    category: "networking",
  },
    {
    name: "Flash Drives 32GB",
    img: FlashDrives32GBmg1,
    category: "storage",
  },
  {
    name: "Flash Drives 128GB",
    img: FlashDrives128GBmg1,
    category: "storage",
  },
  {
    name: "Memory Card Reader",
    img: MemoryCardReadermg1,
    category: "storage",
  },
  {
    name: "Power Bank 10000mAh",
    img: PowerBank10000mAhmg1,
    category: "power",
  },
  {
    name: "PowerBank 32000mAh",
    img: PortablePowerBank32000mAhmg1,
    category: "power",
  },
  {
    name: "8 Ports USB Charging Station",
    img: USBChargingStationmg1,
    category: "power",
  },
  {
    name: "JBL bluetooth Speaker",
    img: JBLbluetoothspeakermg1,
    category: "others",
  },
  {
    name: "Bluetooth Headphones",
    img: bluetoothheadphonesmg1,
    category: "others",
  },
  {
    name: "Gaming Microphone",
    img: GamingMicrophonemg1,
    category: "others",
  },
  {
    name: "Web Cam",
    img: Webcammg1,
    category: "others",
  },
];

// Hero slides
const heroSlides = [
  {
    title: "Discover the Best Tech Rentals",
    description:
      "Rent top-quality devices and software tools for your projects and events.",
    bgImg: BGimage01mg1,
  },
  {
    title: "Affordable & Flexible Plans",
    description: "Choose rental options that match your budget and timeline.",
    bgImg: BGimage02mg1,
  },
];

const RentalPage = () => {
  const [activeTab, setActiveTab] = useState("computing");
  

  const heroSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  //Filter items by active tab (show all if "all")
const filteredItems =
  activeTab === "all"
    ? showcaseItems
    : showcaseItems.filter((item) => item.category === activeTab);


  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Navbar */}
      <Navbar />

      {/* Hero Slider */}
      <section className="relative w-full h-[100vh] text-white overflow-hidden">
        <Slider {...heroSettings} className="h-full">
          {heroSlides.map((slide, index) => (
            <div key={index} className="relative h-[100vh]">
              {/* Background */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${slide.bgImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-black/60" />

              {/* Content */}
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full px-12 lg:px-24">
                <div className="flex-1 max-w-xl space-y-6">
                  <h1 className="text-4xl md:text-5xl font-bold leading-snug">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-gray-300">{slide.description}</p>
                </div>
                <div className="flex-1 flex justify-end"></div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Main content */}
      <main className="flex-grow px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Rental Showcase</h1>
        <p className="text-lg text-center max-w-2xl mx-auto mb-12">
          Browse tech products available for rent. Click to view more details.
        </p>
        
        {/*Tabs Section*/}
<div className="flex justify-center space-x-8 mb-12 text-xl font-semibold pt-16">
  <button
    onClick={() => setActiveTab("all")}
    className={`pb-2 ${
      activeTab === "all"
        ? "text-black border-b-2 border-black"
        : "text-gray-400"
    }`}
  >
    All
  </button>

  <button
    onClick={() => setActiveTab("computing")}
    className={`pb-2 ${
      activeTab === "computing"
        ? "text-black border-b-2 border-black"
        : "text-gray-400"
    }`}
  >
    Computing & Productivity
  </button>

  <button
    onClick={() => setActiveTab("networking")}
    className={`pb-2 ${
      activeTab === "networking"
        ? "text-black border-b-2 border-black"
        : "text-gray-400"
    }`}
  >
    Networking & Connectivity
  </button>

  <button
    onClick={() => setActiveTab("storage")}
    className={`pb-2 ${
      activeTab === "storage"
        ? "text-black border-b-2 border-black"
        : "text-gray-400"
    }`}
  >
    Storage & Backup
  </button>

  <button
    onClick={() => setActiveTab("power")}
    className={`pb-2 ${
      activeTab === "power"
        ? "text-black border-b-2 border-black"
        : "text-gray-400"
    }`}
  >
    Power & Accessories
  </button>

  <button
    onClick={() => setActiveTab("others")}
    className={`pb-2 ${
      activeTab === "others"
        ? "text-black border-b-2 border-black"
        : "text-gray-400"
    }`}
  >
    Others
  </button>

</div>


        {/* Grid of showcase items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredItems.map((item, index) => (
             <div
              key={index}
              className="relative rounded-2xl overflow-hidden border border-gray-300 shadow-md hover:shadow-lg transition-transform hover:scale-95">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-60 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
         <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{item.name}</h2>
        
        {/* Purple to Pink Gradient Button */}
        <div className="flex justify-end mt-2">
          <button 
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200"
            onClick={() => navigate("/rental-form", { state: { product: item.name } })}>
            <span className="relative px-3 py-1.5 transition-all ease-in duration-75 bg-gray-200 rounded-md group-hover:bg-transparent">
              Rent Now
            </span>
          </button>
          </div>
        </div>
      </div>
    </div>
          ))}
        </div>
      </main>

      {/* View all */}
      <div className="text-center mt-8 mb-16">
        <button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg shadow">
          View all products
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RentalPage;
