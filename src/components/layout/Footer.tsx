
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 px-4">
          {/* Logo & About */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/images/Logo-Baseline-copy.png" 
                alt="BaseLine Academy" 
                className="h-16 mb-4" 
              />
            </Link>
            <p className="text-gray-300">
              BaseLine Academy provides elite basketball training, developing athletes who want to excel in their game and reach professional levels.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-xl border-b-2 border-baseline-yellow pb-2 inline-block">
              Quick Links
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="hover:text-baseline-yellow transition-colors duration-200">Home</Link>
              <Link to="/about" className="hover:text-baseline-yellow transition-colors duration-200">About Us</Link>
              <Link to="/programs" className="hover:text-baseline-yellow transition-colors duration-200">Programs</Link>
              <Link to="/gallery" className="hover:text-baseline-yellow transition-colors duration-200">Gallery</Link>
              <Link to="/schedule" className="hover:text-baseline-yellow transition-colors duration-200">Schedule</Link>
              <Link to="/contact" className="hover:text-baseline-yellow transition-colors duration-200">Contact</Link>
            </nav>
          </div>
          
          {/* Programs */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-xl border-b-2 border-baseline-yellow pb-2 inline-block">
              Training Programs
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/programs" className="hover:text-baseline-yellow transition-colors duration-200">
                3-Day Batch
              </Link>
              <Link to="/programs" className="hover:text-baseline-yellow transition-colors duration-200">
                5-Day Batch
              </Link>
              <Link to="/programs" className="hover:text-baseline-yellow transition-colors duration-200">
                One-to-One Coaching
              </Link>
              <Link to="/programs" className="hover:text-baseline-yellow transition-colors duration-200">
                Elite Training
              </Link>
            </nav>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-xl border-b-2 border-baseline-yellow pb-2 inline-block">
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Phone className="text-baseline-yellow" size={20} />
                <span>+91 90000 00000</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="text-baseline-yellow" size={20} />
                <span>info@baselineacademy.com</span>
              </div>
              <div className="flex items-center gap-4">
                <Instagram className="text-baseline-yellow" size={20} />
                <span>@baselineacademy</span>
              </div>
              <div className="mt-6">
                <Link to="/contact" className="button-outline">
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom / Copyright */}
        <div className="border-t border-gray-800 py-8 px-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} BaseLine Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
