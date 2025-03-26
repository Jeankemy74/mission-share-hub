import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, FileText, MessageSquare, Users, AlertCircle, PenLine } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessControl } from '@/hooks/useAccessControl';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

// Sample data - in a real app, this would come from an API or context
const missionData = {
  '1': {
    id: '1',
    title: 'Audit financier du ministère de l\'Éducation',
    description: 'Examen approfondi des comptes et des pratiques financières du ministère de l\'Éducation nationale pour l\'exercice fiscal 2023.',
    status: 'active',
    members: [
      { id: '1', name: 'Admin IGF', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
      { id: '2', name: 'Thomas Bernard', role: 'mission_chief', avatar: 'https://i.pravatar.cc/150?u=chef' },
      { id: '3', name: 'Marie Laurent', role: 'member', avatar: 'https://i.pravatar.cc/150?u=membre' }
    ],
    dueDate: '28 juin 2024',
    startDate: '15 janvier 2024',
    progress: 45,
    documents: [
      { id: 'd1', name: 'Rapport préliminaire.pdf', type: 'pdf', size: '2.4 MB', updatedAt: '12 mai 2024', author: 'Thomas Bernard' },
      { id: 'd2', name: 'Données financières.xlsx', type: 'excel', size: '1.8 MB', updatedAt: '10 mai 2024', author: 'Marie Laurent' },
      { id: 'd3', name: 'Notes de réunion.docx', type: 'word', size: '850 KB', updatedAt: '5 mai 2024', author: 'Admin IGF' }
    ]
  },
  '2': {
    id: '2',
    title: 'Évaluation des politiques de santé publique',
    description: 'Analyse de l\'efficacité et de l\'efficience des politiques de santé publique mises en place depuis 2020, notamment dans le contexte post-pandémique.',
    status: 'active',
    members: [
      { id: '2', name: 'Thomas Bernard', role: 'mission_chief', avatar: 'https://i.pravatar.cc/150?u=chef' },
      { id: '3', name: 'Marie Laurent', role: 'member', avatar: 'https://i.pravatar.cc/150?u=membre' },
      { id: '4', name: 'Alexandre Martin', role: 'external', avatar: 'https://i.pravatar.cc/150?u=externe' }
    ],
    dueDate: '15 juil. 2024',
    startDate: '1 février 2024',
    progress: 30,
    documents: [
      { id: 'd4', name: 'Analyse comparative.pdf', type: 'pdf', size: '3.1 MB', updatedAt: '15 mai 2024', author: 'Alexandre Martin' },
      { id: 'd5', name: 'Statistiques sanitaires.xlsx', type: 'excel', size: '2.2 MB', updatedAt: '8 mai 2024', author: 'Marie Laurent' }
    ]
  },
  '3': {
    id: '3',
    title: 'Revue des dépenses du projet d\'infrastructure',
    description: 'Examen des dépenses et de l\'utilisation des fonds alloués au grand projet d\'infrastructure de transport urbain.',
    status: 'draft',
    members: [
      { id: '1', name: 'Admin IGF', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
      { id: '2', name: 'Thomas Bernard', role: 'mission_chief', avatar: 'https://i.pravatar.cc/150?u=chef' }
    ],
    startDate: '1 juin 2024',
    progress: 15,
    documents: [
      { id: 'd6', name: 'Plan d\'audit.docx', type: 'word', size: '720 KB', updatedAt: '20 mai 2024', author: 'Thomas Bernard' }
    ]
  },
  '4': {
    id: '4',
    title: 'Analyse du programme de développement durable',
    description: 'Évaluation de l\'impact et de l\'efficacité du programme national de développement durable dans le secteur agricole.',
    status: 'completed',
    members: [
      { id: '2', name: 'Thomas Bernard', role: 'mission_chief', avatar: 'https://i.pravatar.cc/150?u=chef' },
      { id: '3', name: 'Marie Laurent', role: 'member', avatar: 'https://i.pravatar.cc/150?u=membre' },
      { id: '4', name: 'Alexandre Martin', role: 'external', avatar: 'https://i.pravatar.cc/150?u=externe' }
    ],
    dueDate: '10 mai 2024',
    startDate: '15 décembre 2023',
    progress: 100,
    documents: [
      { id: 'd7', name: 'Rapport final.pdf', type: 'pdf', size: '4.8 MB', updatedAt: '8 mai 2024', author: 'Thomas Bernard' },
      { id: 'd8', name: 'Présentation des résultats.pptx', type: 'powerpoint', size: '3.5 MB', updatedAt: '5 mai 2024', author: 'Marie Laurent' },
      { id: 'd9', name: 'Données collectées.xlsx', type: 'excel', size: '2.9 MB', updatedAt: '1 mai 2024', author: 'Alexandre Martin' }
    ]
  }
};

// File type icons mapping
const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="text-red-500" />;
    case 'excel':
      return <FileText className="text-green-500" />;
    case 'word':
      return <FileText className="text-blue-500" />;
    case 'powerpoint':
      return <FileText className="text-orange-500" />;
    default:
      return <FileText className="text-gray-500" />;
  }
};

// Status colors mapping
const statusColors = {
  active: 'bg-green-500/10 text-green-600',
  completed: 'bg-blue-500/10 text-blue-600',
  draft: 'bg-amber-500/10 text-amber-600',
};

const statusLabels = {
  active: 'En cours',
  completed: 'Terminée',
  draft: 'Brouillon',
};

interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'draft';
  members: {
    id: string;
    name: string;
    role: 'admin' | 'mission_chief' | 'member' | 'external';
    avatar: string;
  }[];
  startDate: string;
  progress: number;
  documents: {
    id: string;
    name: string;
    type: string;
    size: string;
    updatedAt: string;
    author: string;
  }[];
  dueDate?: string;
}

const MissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  
  // Access control hook to manage permissions
  const { getMissionAccess, hasFullSystemAccess } = useAccessControl();
  
  // Get mission data based on ID
  const mission = missionData[id as keyof typeof missionData] as Mission;
  
  if (!mission) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 bg-card rounded-lg card-shadow animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Mission non trouvée</h2>
            <p className="text-muted-foreground mb-6">
              La mission recherchée n'existe pas ou a été supprimée.
            </p>
            <Button onClick={() => navigate('/missions')}>
              Retour à la liste des missions
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Determine user access permissions for this mission
  const access = getMissionAccess(mission.members);
  
  // If user doesn't have access and is not an admin, show access denied
  if (!access.canView && !hasFullSystemAccess()) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 bg-card rounded-lg card-shadow animate-fade-in">
            <AlertCircle size={48} className="mx-auto text-destructive" />
            <h2 className="text-2xl font-bold mb-4 mt-4">Accès refusé</h2>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas accès à cette mission. Veuillez contacter un administrateur ou un chef de mission.
            </p>
            <Button onClick={() => navigate('/missions')}>
              Retour à la liste des missions
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Convert string date to Date object for the calendar
  const parseDueDate = () => {
    if (!mission.dueDate) return null;
    
    // Simple parsing for the example format "28 juin 2024"
    const parts = mission.dueDate.split(' ');
    const day = parseInt(parts[0]);
    const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    const month = monthNames.indexOf(parts[1]);
    const year = parseInt(parts[2]);
    
    return new Date(year, month, day);
  };
  
  // Set initial date when component mounts
  React.useEffect(() => {
    if (mission.dueDate) {
      setSelectedDate(parseDueDate());
    }
  }, [mission.dueDate]);
  
  const handleUpdateDueDate = () => {
    if (!selectedDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would update the mission date in a real app
    // For this example, we'll just show a toast
    toast({
      title: "Date d'échéance mise à jour",
      description: `La date d'échéance a été modifiée au ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}.`,
    });
    
    setIsDateDialogOpen(false);
  };
  
  const handleAddDocument = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'ajout de documents sera disponible prochainement.",
    });
  };
  
  const handleAddMember = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'ajout de membres sera disponible prochainement.",
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Header with back button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4" 
            onClick={() => navigate('/missions')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour aux missions
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{mission.title}</h1>
              <div className="flex items-center mt-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[mission.status as keyof typeof statusColors]}`}>
                  {statusLabels[mission.status as keyof typeof statusLabels]}
                </span>
                {mission.dueDate && (
                  <div className="ml-4 text-sm text-muted-foreground flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>Échéance: {mission.dueDate}</span>
                    
                    {/* Due date modification button for chiefs and admins */}
                    {access.canModifyDueDate && mission.status !== 'completed' && (
                      <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                            <PenLine size={12} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Modifier la date d'échéance</DialogTitle>
                            <DialogDescription>
                              Changez la date d'échéance pour cette mission.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="py-4">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {selectedDate ? (
                                    format(selectedDate, 'PPP', { locale: fr })
                                  ) : (
                                    <span>Sélectionner une date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarPicker
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDateDialogOpen(false)}>
                              Annuler
                            </Button>
                            <Button onClick={handleUpdateDueDate}>
                              Mettre à jour
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {mission.status !== 'completed' && access.canEdit && (
              <Button>
                {mission.status === 'draft' ? 'Démarrer la mission' : 'Modifier la mission'}
              </Button>
            )}
          </div>
        </div>
        
        {/* Mission details in tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="team">Équipe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{mission.description}</p>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Progression</h3>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{mission.progress}%</span>
                          {mission.dueDate && (
                            <span className="text-sm text-muted-foreground">
                              Échéance: {mission.dueDate}
                            </span>
                          )}
                        </div>
                        <Progress value={mission.progress} className="h-2" />
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Dates</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Date de début</p>
                              <p className="text-sm text-muted-foreground">{mission.startDate}</p>
                            </div>
                          </div>
                          {mission.dueDate && (
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Date d'échéance</p>
                                <p className="text-sm text-muted-foreground">
                                  {mission.dueDate}
                                  {access.canModifyDueDate && mission.status !== 'completed' && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="ml-1 h-5 w-5"
                                      onClick={() => setIsDateDialogOpen(true)}
                                    >
                                      <PenLine size={12} />
                                    </Button>
                                  )}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Documents récents</CardTitle>
                    <CardDescription>
                      Les {Math.min(3, mission.documents.length)} documents les plus récents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mission.documents.slice(0, 3).map((doc) => (
                        <div key={doc.id} className="flex items-center p-3 rounded-md hover:bg-muted transition-colors">
                          {getFileIcon(doc.type)}
                          <div className="ml-4 flex-grow">
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Mis à jour le {doc.updatedAt} • {doc.size}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Voir
                          </Button>
                        </div>
                      ))}
                    </div>
                    {mission.documents.length > 3 && (
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => setActiveTab("documents")}
                      >
                        Voir tous les documents
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Équipe</CardTitle>
                    <CardDescription>
                      {mission.members.length} membres
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mission.members.map((member) => (
                        <div key={member.id} className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <p className="font-medium">{member.name}</p>
                            <Badge variant="outline" className="mt-1">
                              {member.role === 'admin' ? 'Administrateur' : 
                                member.role === 'mission_chief' ? 'Chef de mission' : 
                                member.role === 'member' ? 'Membre' : 'Externe'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    {mission.status !== 'completed' && access.canManageMembers && (
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={handleAddMember}
                      >
                        <Users size={16} className="mr-2" />
                        Ajouter un membre
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>
                      Tous les documents de la mission
                    </CardDescription>
                  </div>
                  {mission.status !== 'completed' && access.canEdit && (
                    <Button onClick={handleAddDocument}>
                      <FileText size={16} className="mr-2" />
                      Ajouter un document
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {mission.documents.length > 0 ? (
                  <div className="space-y-4">
                    {mission.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center p-3 rounded-md hover:bg-muted transition-colors">
                        {getFileIcon(doc.type)}
                        <div className="ml-4 flex-grow">
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Mis à jour le {doc.updatedAt} • {doc.size} • Par {doc.author}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Télécharger
                          </Button>
                          {mission.status !== 'completed' && access.canEdit && (
                            <Button variant="ghost" size="sm">
                              Gérer
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Aucun document</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Cette mission ne contient pas encore de documents.
                    </p>
                    {mission.status !== 'completed' && access.canEdit && (
                      <Button 
                        className="mt-4"
                        onClick={handleAddDocument}
                      >
                        Ajouter un document
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Équipe</CardTitle>
                    <CardDescription>
                      Membres de la mission
                    </CardDescription>
                  </div>
                  {mission.status !== 'completed' && access.canManageMembers && (
                    <Button onClick={handleAddMember}>
                      <Users size={16} className="mr-2" />
                      Ajouter un membre
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mission.members.map((member) => (
                    <div key={member.id} className="flex items-center p-4 rounded-md hover:bg-muted transition-colors">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 flex-grow">
                        <p className="font-medium">{member.name}</p>
                        <Badge variant="outline" className="mt-1">
                          {member.role === 'admin' ? 'Administrateur' : 
                            member.role === 'mission_chief' ? 'Chef de mission' : 
                            member.role === 'member' ? 'Membre' : 'Externe'}
                        </Badge>
                      </div>
                      {mission.status !== 'completed' && access.canManageMembers && member.role !== 'mission_chief' && (
                        <Button variant="ghost" size="sm">
                          Gérer
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MissionDetail;
