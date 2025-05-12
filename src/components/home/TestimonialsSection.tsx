
import { useState } from 'react';

const testimonials = [
  {
    quote: "BaseLine Academy transformed my game completely. The coaches understand how to push you to your limits while teaching proper technique.",
    name: "Rohan Kumar",
    title: "College Player",
    image: "/images/player1.jpg"
  },
  {
    quote: "The one-on-one coaching at BaseLine gave me the edge I needed to make it to the state team. Their attention to detail is unmatched.",
    name: "Priya Singh",
    title: "State Team Player",
    image: "/images/player2.jpg"
  },
  {
    quote: "I've been to many basketball camps, but none compare to the level of training and personal development I received at BaseLine.",
    name: "Arjun Mehta",
    title: "High School Player",
    image: "/images/player3.jpg"
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <section className="section-padding bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Player <span className="gradient-text">Stories</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Don't just take our word for it. Hear from the players who have transformed their game with BaseLine Academy.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Active Testimonial */}
          <div className="bg-black border border-gray-800 rounded-lg p-8 md:p-12 mb-8 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-baseline-yellow">
                <img 
                  src={testimonials[activeIndex].image} 
                  alt={testimonials[activeIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <div className="text-4xl text-baseline-yellow mb-4">"</div>
                <blockquote className="text-xl text-gray-100 mb-6">
                  {testimonials[activeIndex].quote}
                </blockquote>
                <div className="text-baseline-yellow font-bold">
                  {testimonials[activeIndex].name}
                </div>
                <div className="text-gray-400">
                  {testimonials[activeIndex].title}
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonial Navigation */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'bg-baseline-yellow scale-125' : 'bg-gray-600'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
