
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, FileText, FileImage, FilePlus, FolderOpen, Download, MoreVertical, Trash2, Users, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useAccessControl } from '@/hooks/useAccessControl';

// Sample missions data for cross-checking permissions
const missions = [
  { id: '1', title: 'Audit financier du ministère de l\'Éducation', memberIds: ['1', '2', '3'] },
  { id: '2', title: 'Évaluation des politiques de santé publique', memberIds: ['2', '3', '4'] },
  { id: '3', title: 'Revue des dépenses du projet d\'infrastructure', memberIds: ['1', '2'] },
  { id: '4', title: 'Analyse du programme de développement durable', memberIds: ['2', '3', '4'] },
  { id: '5', title: 'Audit de conformité des marchés publics', memberIds: ['1', '2', '3', '4'] }
];

// Sample data for documents
const documents = [
  { 
    id: '1', 
    name: 'Rapport financier Q2 2024.pdf', 
    type: 'pdf', 
    size: '4.2 MB', 
    updatedAt: '28 mai 2024', 
    mission: 'Audit financier du ministère de l\'Éducation',
    missionId: '1',
    sharedWith: 4
  },
  { 
    id: '2', 
    name: 'Analyse des budgets opérationnels.xlsx', 
    type: 'excel', 
    size: '2.8 MB', 
    updatedAt: '24 mai 2024', 
    mission: 'Revue des dépenses du projet d\'infrastructure',
    sharedWith: 3
  },
  { 
    id: '3', 
    name: 'Présentation synthèse politique de santé.pptx', 
    type: 'powerpoint', 
    size: '6.5 MB', 
    updatedAt: '20 mai 2024', 
    mission: 'Évaluation des politiques de santé publique',
    sharedWith: 6
  },
  { 
    id: '4', 
    name: 'Photos du projet d\'infrastructure.zip', 
    type: 'zip', 
    size: '24.1 MB', 
    updatedAt: '18 mai 2024', 
    mission: 'Revue des dépenses du projet d\'infrastructure',
    sharedWith: 3
  },
  { 
    id: '5', 
    name: 'Notes de réunion - Comité de pilotage.docx', 
    type: 'word', 
    size: '1.2 MB', 
    updatedAt: '15 mai 2024', 
    mission: 'Analyse du programme de développement durable',
    sharedWith: 5
  },
  { 
    id: '6', 
    name: 'Plan d\'action 2024-2025.pdf', 
    type: 'pdf', 
    size: '3.7 MB', 
    updatedAt: '10 mai 2024', 
    mission: 'Analyse du programme de développement durable',
    sharedWith: 5
  },
];

const getFileIcon = (type: string) => {
  switch(type) {
    case 'pdf':
      return <FileText className="text-red-500" size={20} />;
    case 'excel':
      return <FileText className="text-green-500" size={20} />;
    case 'word':
      return <FileText className="text-blue-500" size={20} />;
    case 'powerpoint':
      return <FileText className="text-orange-500" size={20} />;
    case 'zip':
      return <FileText className="text-purple-500" size={20} />;
    default:
      return <FileText className="text-gray-500" size={20} />;
  }
};

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { hasFullSystemAccess } = useAccessControl();
  
  // Get the missions that the user is a member of
  const userMissionIds = missions
    .filter(mission => hasFullSystemAccess() || (user && mission.memberIds.includes(user.id)))
    .map(mission => mission.id);
  
  // Filter documents based on search query and user's mission membership
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.mission.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Admin can see all documents
    if (hasFullSystemAccess()) {
      return matchesSearch;
    }
    
    // Regular users can only see documents from their missions
    return matchesSearch && userMissionIds.includes(doc.missionId);
  });
  
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Documents</h1>
              <p className="text-muted-foreground mt-2">Gérez et partagez vos documents de mission</p>
            </div>
            <Button className="flex items-center">
              <FilePlus size={16} className="mr-2" />
              Ajouter un document
            </Button>
          </div>
        </header>
        
        {/* Filters */}
        <div className="bg-card rounded-lg card-shadow p-4 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Rechercher un document ou une mission..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Documents Table */}
        <div className="bg-card rounded-lg card-shadow overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Mission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Taille</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Mis à jour</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Partagé avec</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/30 transition-all-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon(doc.type)}
                        <span className="ml-3 font-medium">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FolderOpen size={16} className="text-muted-foreground mr-2" />
                        <span className="text-sm">{doc.mission}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{doc.size}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{doc.updatedAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users size={16} className="text-muted-foreground mr-2" />
                        <span className="text-sm">{doc.sharedWith} personnes</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon">
                          <Download size={16} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                            <DropdownMenuItem>Partager</DropdownMenuItem>
                            <DropdownMenuItem>Renommer</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 size={16} className="mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State */}
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              {searchQuery ? (
                <>
                  <Filter size={48} className="mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Aucun document trouvé</h3>
                  <p className="mt-2 text-muted-foreground">
                    Modifiez vos critères de recherche ou ajoutez un nouveau document.
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle size={48} className="mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Aucun document disponible</h3>
                  <p className="mt-2 text-muted-foreground">
                    Vous n'avez pas accès à des documents ou aucun document n'existe encore.
                  </p>
                </>
              )}
              <Button className="mt-6">
                <FilePlus size={16} className="mr-2" />
                Ajouter un document
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Documents;
