
import React from 'react';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo size="sm" />
            <p className="mt-2 text-sm text-foreground/60">
              Plateforme de partage de documents collaborative
            </p>
          </div>
          
          <div className="text-sm text-foreground/60">
            &copy; {currentYear} Inspection Générale des Finances. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
