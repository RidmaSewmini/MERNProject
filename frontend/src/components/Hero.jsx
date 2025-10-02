import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "ULTIMATE GAMING RIGS",
      subtitle: "POWERFUL CUSTOM BUILDS FOR SERIOUS GAMERS",
      cta: "Build Your Dream PC",
      bgImage: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      title: "EXPERT TECH SUPPORT",
      subtitle: "24/7 ASSISTANCE FOR ALL YOUR IT NEEDS",
      cta: "Get Support Now",
      bgImage: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ];

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleCtaClick = () => {
    // Button click handler without toast
    console.log(`CTA clicked: ${slides[currentSlide].cta}`);
  };

  return (
    <div className="relative w-full h-screen max-h-[900px] overflow-hidden px-4 py-4 font-titillium">
      <div className="relative w-full h-full rounded-2xl overflow-hidden">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              backgroundImage: `url(${slide.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80"></div>
            
            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col justify-center px-8">
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase mb-6 leading-tight animate-fade-in-down"
                style={{ 
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)',
                  animationDelay: '200ms'
                }}
              >
                {slide.title}
              </h1>
              
              <h2 
                className="text-xl md:text-2xl text-white mb-10 max-w-2xl animate-fade-in-down"
                style={{ 
                  textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)',
                  animationDelay: '400ms'
                }}
              >
                {slide.subtitle}
              </h2>
              
              <button 
                onClick={handleCtaClick}
                className="btn btn-primary px-8 py-4 text-lg font-semibold uppercase w-full max-w-xs animate-fade-in-up group flex items-center h-14"
                style={{ animationDelay: '600ms' }}
              >
                {slide.cta}
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full border-2 border-white transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-transparent'
              } hover:scale-110`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fade-in-down {
          opacity: 0;
          animation: fadeInDown 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Hero;