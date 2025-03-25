
import React from 'react';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/dashboard/StatsCard';
import MissionCard from '../components/dashboard/MissionCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import { FileText, Users, Calendar, ArrowRight, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Sample data
const stats = [
  { title: 'Missions actives', value: 8, change: 12, icon: <Users size={20} /> },
  { title: 'Documents partagés', value: 142, change: 8, icon: <FileText size={20} /> },
  { title: 'Événements à venir', value: 5, change: -3, icon: <Calendar size={20} /> },
  { title: 'Espaces de travail', value: 4, change: 0, icon: <FolderOpen size={20} /> },
];

const missions = [
  { id: '1', title: 'Audit financier du ministère de l\'Éducation', status: 'active' as const, members: 4, dueDate: '28 juin 2024', progress: 45 },
  { id: '2', title: 'Évaluation des politiques de santé publique', status: 'active' as const, members: 6, dueDate: '15 juil. 2024', progress: 30 },
  { id: '3', title: 'Revue des dépenses du projet d\'infrastructure', status: 'draft' as const, members: 3, progress: 15 },
  { id: '4', title: 'Analyse du programme de développement durable', status: 'completed' as const, members: 5, dueDate: '10 mai 2024', progress: 100 },
];

const recentActivities = [
  {
    id: '1',
    type: 'document' as const,
    title: 'Rapport financier Q2 2024 mis à jour',
    description: 'Le document a été mis à jour avec les dernières données financières.',
    user: { name: 'Alexandre Martin' },
    time: 'Il y a 20 minutes',
  },
  {
    id: '2',
    type: 'mission' as const,
    title: 'Nouvelle mission créée',
    description: 'Audit des programmes de recherche scientifique.',
    user: { name: 'Sophie Dubois' },
    time: 'Il y a 2 heures',
  },
  {
    id: '3',
    type: 'comment' as const,
    title: 'Commentaire sur le rapport préliminaire',
    description: 'Veuillez revoir les conclusions de la section 3.2 concernant les allocations budgétaires.',
    user: { name: 'Thomas Bernard' },
    time: 'Il y a 5 heures',
  },
  {
    id: '4',
    type: 'calendar' as const,
    title: 'Réunion planifiée',
    description: 'Revue de l\'avancement de la mission d\'audit financier du ministère de l\'Éducation.',
    user: { name: 'Marie Laurent' },
    time: 'Il y a 8 heures',
  },
];

const Dashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <header className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground mt-2">Bienvenue dans votre espace de travail</p>
        </header>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
            />
          ))}
        </div>
        
        {/* Missions Section */}
        <section className="pt-4">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Missions récentes</h2>
            <Button variant="ghost" size="sm" asChild className="text-sm">
              <Link to="/missions" className="flex items-center">
                Voir toutes <ArrowRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {missions.map((mission) => (
              <MissionCard key={mission.id} {...mission} />
            ))}
          </div>
        </section>
        
        {/* Activity Feed */}
        <section className="pt-4">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Activité récente</h2>
          </div>
          
          <RecentActivity activities={recentActivities} />
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
