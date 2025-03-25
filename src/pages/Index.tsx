
import React from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { FileText, Users, Calendar, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: <FileText size={24} />,
    title: 'Gestion de documents',
    description: 'Partagez et organisez facilement vos documents de mission avec votre équipe.',
  },
  {
    icon: <Users size={24} />,
    title: 'Attribution d\'équipe',
    description: 'Créez des missions et attribuez des membres avec des rôles et permissions spécifiques.',
  },
  {
    icon: <Calendar size={24} />,
    title: 'Planification',
    description: 'Gardez une vue d\'ensemble des échéances et des événements importants de vos missions.',
  },
  {
    icon: <Share2 size={24} />,
    title: 'Collaboration',
    description: 'Commentez et collaborez sur les documents en temps réel avec votre équipe.',
  },
];

const Index = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold">
              Simplifiez la gestion de vos missions
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Une plateforme collaborative pour l'Inspection Générale des Finances permettant 
              de créer des missions, d'attribuer des membres et de partager des documents.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/dashboard">Accéder au tableau de bord</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="rounded-full">
                    <Link to="/login">Se connecter</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full">
                    <Link to="/register">S'inscrire</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Fonctionnalités clés</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Des outils puissants pour simplifier la gestion de vos missions et améliorer la collaboration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-card rounded-lg p-6 card-shadow flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold">Prêt à commencer?</h2>
            <p className="mt-4 text-muted-foreground">
              Rejoignez la plateforme et améliorez la collaboration de votre équipe dès aujourd'hui.
            </p>
            <div className="mt-8">
              {user ? (
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/dashboard">Accéder au tableau de bord</Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/login">Se connecter</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
