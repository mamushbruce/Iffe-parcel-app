
'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Add states for other forms if they have different fields or logic

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    // For this example, we'll use the 'user-login-form' values
    // In a real app, you might have different state or handlers for each tab
    const currentEmail = email;
    const currentPassword = password;

    try {
      const result = await signIn('credentials', {
        redirect: false, // Prevent NextAuth from redirecting automatically
        email: currentEmail,
        password: currentPassword,
      });

      if (result?.error) {
        toast({
          title: "Login Failed",
          description: result.error === "CredentialsSignin" ? "Invalid email or password." : result.error,
          variant: "destructive",
        });
      } else if (result?.ok) {
        toast({
          title: "Login Successful!",
          description: "Welcome back!",
        });
        onOpenChange(false); // Close modal on successful login
        setEmail(''); // Clear fields
        setPassword('');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">Login to e-Rotary Hub</DialogTitle>
          <DialogDescription>
            Access your account or log in as a community member/admin.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user" disabled={isLoading}>User</TabsTrigger>
            <TabsTrigger value="community" disabled={true || isLoading}>Community</TabsTrigger> 
            <TabsTrigger value="admin" disabled={isLoading}>Admin</TabsTrigger>
          </TabsList>
          
          {/* User Login Form */}
          <TabsContent value="user">
            <form id="user-login-form" onSubmit={handleSubmit} className="space-y-4 py-4">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login as User"}
              </Button>
            </form>
          </TabsContent>
          
          {/* Community Login Form (Placeholder/Disabled for now) */}
          <TabsContent value="community">
             <div className="py-4 text-center text-muted-foreground">
              Community member login is currently under development.
            </div>
          </TabsContent>
          
          {/* Admin Login Form */}
          <TabsContent value="admin">
             <form id="admin-login-form" onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input 
                  id="admin-email" 
                  type="email" 
                  placeholder="admin@example.com" 
                  value={email} // Re-using state for simplicity, ideally separate state
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
                  value={password} // Re-using state for simplicity
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login as Admin"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
