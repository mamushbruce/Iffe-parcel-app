
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2, Clock, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserDoc {
  id: string;
  title: string;
  type: 'Certificate' | 'Itinerary' | 'Invoice' | 'Other';
  createdAt: string;
  fileUrl: string;
}

export default function DashboardDocuments() {
  const [docs, setDocs] = useState<UserDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch - will be wired to Firestore restricted by userId
    setTimeout(() => {
      setDocs([
        {
          id: 'd1',
          title: 'Gorilla Trekking Certificate - alex_j.pdf',
          type: 'Certificate',
          createdAt: 'Oct 15, 2023',
          fileUrl: '#'
        },
        {
          id: 'd2',
          title: 'Detailed Itinerary: Serengeti Migration 2024.pdf',
          type: 'Itinerary',
          createdAt: 'Feb 01, 2024',
          fileUrl: '#'
        }
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-headline font-black text-primary uppercase">My Documents</h2>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <ShieldCheck className="w-3 h-3 mr-1" /> Secure Storage
        </Badge>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {docs.length > 0 ? (
          docs.map((doc) => (
            <Card key={doc.id} className="group hover:border-accent transition-colors overflow-hidden">
              <CardHeader className="p-4 bg-muted/30 border-b">
                <Badge variant="secondary" className="w-fit mb-2">{doc.type}</Badge>
                <CardTitle className="text-sm font-bold truncate">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Issued on {doc.createdAt}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-all">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="col-span-full bg-muted/30 border-dashed">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">You don't have any private documents yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
