
import { Link } from 'react-router-dom';

interface NavigationScrollLinksProps {
  className?: string;
  onLinkClick?: () => void;
}

const NavigationScrollLinks = ({ className = "", onLinkClick }: NavigationScrollLinksProps) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    if (onLinkClick) onLinkClick();
  };

  const navLinks = [
    { name: 'Home', action: () => scrollToSection('hero') },
    { name: 'About', action: () => scrollToSection('features') },
    { name: 'Programs', path: '/programs' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Tournaments', path: '/tournaments' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {navLinks.map((link) => (
        link.path ? (
          <Link 
            key={link.name}
            to={link.path}
            className={className}
            onClick={onLinkClick}
          >
            {link.name}
          </Link>
        ) : (
          <button
            key={link.name}
            onClick={link.action}
            className={className}
          >
            {link.name}
          </button>
        )
      ))}
    </>
  );
};

export default NavigationScrollLinks;
