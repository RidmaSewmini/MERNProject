import { useState, useEffect } from "react";
import { Fuel, Wrench, Gauge, Cog, CheckCircle } from "lucide-react";

const product = {
  id: 1,
  title: "First Apollo GT Coupe / Spider 2.7 2015",
  description:
    "Worldwide is gearing up for another significant no-reserve private collection auction this October in Corpus Christi, Texas, with an exceptional offering of over...",
  price: 6000000,
  endTime: Date.now() + 30 * 60 * 60 * 1000,
  mainImage: "/cars/apollo-main.jpg",
  images: [
    "/cars/apollo-side.jpg",
    "/cars/apollo-front.jpg",
    "/cars/apollo-back.jpg",
  ],
  excise: "Paid",
  engine: "Petrol",
  condition: "8/10",
  gear: "Manual",
  registered: "Islamabad",
  bodyType: "Sports",
};

const Countdown = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(endTime - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className="font-semibold text-gray-700">
      {hours}h : {minutes}m : {seconds}s
    </span>
  );
};

const ProductDetails = () => {
  const [mainImage, setMainImage] = useState(product.mainImage);

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-titillium">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        Home &gt; Honda &gt;{" "}
        <span className="text-gray-800 font-medium">{product.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Images */}
        <div className="lg:w-2/3">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-[400px] object-cover rounded-lg shadow"
          />
          <div className="flex gap-4 mt-4">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                onClick={() => setMainImage(img)}
                className={`w-32 h-24 object-cover rounded-lg cursor-pointer border ${
                  mainImage === img ? "border-red-600" : "border-gray-200"
                }`}
              />
            ))}
            <div className="flex items-center justify-center w-32 h-24 rounded-lg bg-gray-200 text-gray-600 text-lg font-medium">
              44+
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:w-1/3 bg-white shadow rounded-lg p-6">
          <div className="flex flex-col space-y-4">
            <Countdown endTime={product.endTime} />
            <span className="text-2xl font-bold text-red-600">
              {product.price.toLocaleString()} PKR
            </span>
            <span className="text-green-600 font-medium">Reserve Met ✅</span>

            <input
              type="number"
              placeholder="Enter your bid"
              className="border p-2 rounded w-full"
            />
            <button className="bg-red-600 text-white py-2 rounded hover:bg-red-700">
              Place Bid
            </button>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Car Information</h3>
              <ul className="text-sm space-y-1">
                <li>
                  <span className="font-medium">Registered in:</span>{" "}
                  {product.registered}
                </li>
                <li>
                  <span className="font-medium">Body Type:</span>{" "}
                  {product.bodyType}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Description + Specs */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">{product.title}</h2>
        <p className="text-gray-600 mb-6">
          {product.description}{" "}
          <span className="text-blue-600 cursor-pointer">Read More</span>
        </p>

        {/* Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <CheckCircle className="mx-auto w-6 h-6 text-green-500" />
            <p className="font-medium">Excise Custom</p>
            <p className="text-gray-600">{product.excise}</p>
          </div>
          <div>
            <Fuel className="mx-auto w-6 h-6 text-red-600" />
            <p className="font-medium">Engine</p>
            <p className="text-gray-600">{product.engine}</p>
          </div>
          <div>
            <Gauge className="mx-auto w-6 h-6 text-red-600" />
            <p className="font-medium">Condition</p>
            <p className="text-gray-600">{product.condition}</p>
          </div>
          <div>
            <Cog className="mx-auto w-6 h-6 text-red-600" />
            <p className="font-medium">Gear</p>
            <p className="text-gray-600">{product.gear}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
