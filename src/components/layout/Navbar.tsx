
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    
    // Handle scroll for transparent header
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]); // Re-check when route changes
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Tournament', path: '/tournaments' },
    { name: 'Contact', path: '/contact' },
  ];
  
  const handleJoinClick = () => {
    navigate('/programs');
  };
  
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleDashboardClick = () => {
    if (userRole === 'coach') {
      navigate('/coach-dashboard');
    } else if (userRole === 'parent') {
      navigate('/parent-dashboard');
    }
  };
  
  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/images/Logo-Baseline-copy.png" 
            alt="BaseLine Academy" 
            className="h-12 md:h-16"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path}
              className="text-white hover:text-baseline-yellow font-medium transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center space-x-4">
            {userRole ? (
              <Button className="button-outline" onClick={handleDashboardClick}>
                Dashboard
              </Button>
            ) : (
              <Button className="button-outline" onClick={handleLoginClick}>
                Login
              </Button>
            )}
            <Button className="button-primary" onClick={handleJoinClick}>
              Join Now
            </Button>
          </div>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-baseline-yellow"
        >
          {isOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 top-[72px] bg-black z-40 flex flex-col md:hidden animate-fade-in">
          <div className="container mx-auto py-8 px-4 flex flex-col space-y-6">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-white hover:text-baseline-yellow text-2xl font-semibold transition-all duration-300 ${
                  isOpen ? 'animate-slide-in' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-4 mt-8">
              {userRole ? (
                <Button 
                  className="button-outline w-full" 
                  onClick={() => {
                    setIsOpen(false);
                    handleDashboardClick();
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="button-outline w-full">Login</Button>
                </Link>
              )}
              <Button 
                className="button-primary w-full"
                onClick={() => {
                  setIsOpen(false);
                  handleJoinClick();
                }}
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
