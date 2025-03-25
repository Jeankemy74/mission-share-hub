
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, BellRing } from 'lucide-react';
import Logo from '../ui/Logo';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const links = [
    { name: 'Accueil', path: '/' },
    { name: 'Tableau de bord', path: '/dashboard' },
    { name: 'Missions', path: '/missions' },
    { name: 'Documents', path: '/documents' },
    { name: 'Calendrier', path: '/calendar' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-all-200 text-sm font-medium ${
                    isActive(link.path)
                      ? 'text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full'
                      : 'text-foreground/80 hover:text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* User actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-full text-foreground/80 hover:text-foreground transition-all-200">
              <BellRing size={20} />
            </button>
            <button className="p-2 rounded-full text-foreground/80 hover:text-foreground transition-all-200">
              <User size={20} />
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground/80 hover:text-foreground transition-all-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'animate-fade-in block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-background shadow-lg border-b border-border">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all-200 ${
                isActive(link.path)
                  ? 'text-primary'
                  : 'text-foreground/80 hover:text-foreground'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex space-x-4 px-3 py-2">
            <button className="p-2 rounded-full text-foreground/80 hover:text-foreground transition-all-200">
              <BellRing size={20} />
            </button>
            <button className="p-2 rounded-full text-foreground/80 hover:text-foreground transition-all-200">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
