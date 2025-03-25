
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LogIn, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the destination from location state or default to dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté à votre compte.",
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Échec de la connexion",
        description: (error as Error).message || "Une erreur s'est produite lors de la connexion.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto flex items-center justify-center h-screen">
        <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg border border-border animate-fade-in">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Connexion</h1>
            <p className="text-muted-foreground mt-2">
              Connectez-vous à votre compte pour accéder à la plateforme
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-md text-sm mb-4">
            <div className="flex space-x-2">
              <AlertCircle size={18} className="text-primary" />
              <div>
                <p className="font-medium">Comptes de démonstration:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Chef de mission: chef@igfshare.fr</li>
                  <li>Membre: membre@igfshare.fr</li>
                  <li>Externe: externe@igfshare.fr</li>
                  <li>Admin: admin@igfshare.fr</li>
                </ul>
                <p className="mt-1">Mot de passe: n'importe lequel (mode démo)</p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.fr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    Connexion en cours...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <LogIn size={18} className="mr-2" />
                    Se connecter
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm mt-6">
            <p className="text-muted-foreground">
              Vous n'avez pas de compte ?{" "}
              <Link 
                to="/register" 
                className="text-primary hover:underline"
              >
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
