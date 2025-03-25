
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link 
      to="/" 
      className={`font-bold ${sizeClasses[size]} text-primary transition-all duration-300 hover:opacity-80`}
    >
      <span className="inline-block">IGF</span>
      <span className="text-foreground ml-1.5">Share</span>
    </Link>
  );
};

export default Logo;
