'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; 
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { toast } = useToast();
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('user');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@iffe-travels.com';

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${res.user.email}`,
      });

      onOpenChange(false);
      
      // Role based redirection based on reference
      if (res.user.email?.toLowerCase() === adminEmail.toLowerCase()) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }

    } catch (err: any) {
      console.error("Auth Error:", err);
      setError("Login failed. Please check your credentials.");
      toast({
        title: "Login Failed",
        description: err.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (newTabValue: string) => {
    setActiveTab(newTabValue);
    setError(null);
    if (newTabValue === 'admin') {
      setEmail(process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@iffe-travels.com');
    } else {
      setEmail('');
    }
    setPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">Access Your Hub</DialogTitle>
          <DialogDescription>
            Log in to manage expeditions or view your personal travel dashboard.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="user" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="user" disabled={isLoading}>Traveler</TabsTrigger>
            <TabsTrigger value="admin" disabled={isLoading}>Administrator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-email">Email Address</Label>
                <Input 
                  id="user-email" 
                  type="email" 
                  placeholder="traveler@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-password">Password</Label>
                <Input 
                  id="user-password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...</> : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="admin" className="space-y-4">
             <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input 
                  id="admin-email" 
                  type="email" 
                  placeholder="admin@iffe-travels.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Administrative Password</Label>
                <Input 
                  id="admin-password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Unlocking Panel...</> : "Enter Admin Panel"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
