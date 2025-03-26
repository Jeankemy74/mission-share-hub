
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MissionCard from '../components/dashboard/MissionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Plus, Search, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessControl } from '@/hooks/useAccessControl';

// Sample data
const allMissions = [
  { id: '1', title: 'Audit financier du ministère de l\'Éducation', status: 'active' as const, members: 4, dueDate: '28 juin 2024', progress: 45, memberIds: ['1', '2', '3'] },
  { id: '2', title: 'Évaluation des politiques de santé publique', status: 'active' as const, members: 6, dueDate: '15 juil. 2024', progress: 30, memberIds: ['2', '3', '4'] },
  { id: '3', title: 'Revue des dépenses du projet d\'infrastructure', status: 'draft' as const, members: 3, progress: 15, memberIds: ['1', '2'] },
  { id: '4', title: 'Analyse du programme de développement durable', status: 'completed' as const, members: 5, dueDate: '10 mai 2024', progress: 100, memberIds: ['2', '3', '4'] },
  { id: '5', title: 'Audit de conformité des marchés publics', status: 'active' as const, members: 4, dueDate: '5 août 2024', progress: 20, memberIds: ['1', '2', '3', '4'] },
  { id: '6', title: 'Évaluation de l\'efficacité des subventions agricoles', status: 'draft' as const, members: 3, progress: 5, memberIds: ['2', '3'] },
  { id: '7', title: 'Contrôle des comptes du secteur énergétique', status: 'completed' as const, members: 7, dueDate: '20 avril 2024', progress: 100, memberIds: ['1', '3'] },
  { id: '8', title: 'Revue stratégique du plan d\'investissement national', status: 'active' as const, members: 5, dueDate: '12 sept. 2024', progress: 60, memberIds: ['2', '4'] },
];

const Missions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasFullSystemAccess } = useAccessControl();
  
  // Filter missions based on search, status, and user access
  const filteredMissions = allMissions.filter((mission) => {
    const matchesSearch = mission.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === null || mission.status === statusFilter;
    
    // Admin can see all missions
    if (hasFullSystemAccess()) {
      return matchesSearch && matchesStatus;
    }
    
    // Regular users can only see missions they are part of
    const isUserMember = user && mission.memberIds.includes(user.id);
    return matchesSearch && matchesStatus && isUserMember;
  });
  
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Missions</h1>
              <p className="text-muted-foreground mt-2">Gérez vos missions et suivez leur progression</p>
            </div>
            <Button className="flex items-center" onClick={() => navigate('/missions/create')}>
              <Plus size={16} className="mr-2" />
              Nouvelle mission
            </Button>
          </div>
        </header>
        
        {/* Filters */}
        <div className="bg-card rounded-lg card-shadow p-4 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Rechercher une mission..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant={statusFilter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(null)}
              >
                Toutes
              </Button>
              <Button 
                variant={statusFilter === 'active' ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter('active')}
              >
                En cours
              </Button>
              <Button 
                variant={statusFilter === 'completed' ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter('completed')}
              >
                Terminées
              </Button>
              <Button 
                variant={statusFilter === 'draft' ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter('draft')}
              >
                Brouillons
              </Button>
            </div>
          </div>
        </div>
        
        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((mission) => (
            <MissionCard key={mission.id} {...mission} />
          ))}
        </div>
        
        {/* Empty State */}
        {filteredMissions.length === 0 && (
          <div className="text-center py-12 bg-card rounded-lg card-shadow animate-fade-in">
            {statusFilter || searchQuery ? (
              <>
                <Filter size={48} className="mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Aucune mission trouvée</h3>
                <p className="mt-2 text-muted-foreground">
                  Modifiez vos critères de recherche ou créez une nouvelle mission.
                </p>
              </>
            ) : (
              <>
                <AlertCircle size={48} className="mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Aucune mission disponible</h3>
                <p className="mt-2 text-muted-foreground">
                  Vous n'êtes pas encore affecté à une mission ou aucune mission n'a été créée.
                </p>
              </>
            )}
            <Button className="mt-6" onClick={() => navigate('/missions/create')}>
              <Plus size={16} className="mr-2" />
              Nouvelle mission
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Missions;
