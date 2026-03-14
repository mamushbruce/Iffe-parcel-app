'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; 

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { toast } = useToast();
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('user');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@iffe-travels.com';
    const isAdminEmail = email.toLowerCase() === adminEmail.toLowerCase();

    try {
      // 1. For Travelers, try Firebase Auth first
      if (!isAdminEmail && activeTab === 'user') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (firebaseError: any) {
          console.error("Firebase Auth Error:", firebaseError);
          throw new Error("Invalid traveler credentials. Please check your email and password.");
        }
      }

      // 2. Sign in to NextAuth session
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error === 'CredentialsSignin' ? "Authentication failed. Please check your details." : result.error);
      }

      toast({
        title: "Login Successful!",
        description: isAdminEmail ? "Welcome to the Administrative Dashboard." : "Welcome back, Traveler!",
      });

      // Navigate based on role
      if (isAdminEmail) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }

      onOpenChange(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error("Login Error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (newTabValue: string) => {
    setActiveTab(newTabValue);
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
          <DialogTitle className="font-headline text-2xl text-primary">Login to iffe-travels</DialogTitle>
          <DialogDescription>
            Access your account to manage your trips and stories.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="user" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" disabled={isLoading}>Traveler</TabsTrigger>
            <TabsTrigger value="admin" disabled={isLoading}>Administrator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user">
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <Label htmlFor="user-email">Email</Label>
                <Input 
                  id="user-email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="user-password">Password</Label>
                <Input 
                  id="user-password" 
                  type="password" 
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Login as Traveler"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="admin">
             <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
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
              <div>
                <Label htmlFor="admin-password">Password</Label>
                <Input 
                  id="admin-password" 
                  type="password" 
                  placeholder="Enter admin password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90" disabled={isLoading}>
                {isLoading ? "Validating Admin..." : "Login to Admin Panel"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
