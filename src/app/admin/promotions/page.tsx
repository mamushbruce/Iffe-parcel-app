
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit2, Plus, Trash2, Loader2, Tag, Percent } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { fetchPromotions, savePromotion, deletePromotion, type Promotion } from '@/lib/services/cms-service';
import { Badge } from '@/components/ui/badge';

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [editingPromo, setEditingPromo] = useState<Partial<Promotion> | null>(null);

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPromotions();
      setPromos(data);
    } catch (err) {
      toast({ title: "Failed to load promotions", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo) return;
    try {
      await savePromotion(editingPromo);
      toast({ title: editingPromo.id ? "Promotion Updated" : "Promotion Added" });
      setEditingPromo(null);
      loadPromos();
    } catch (err) {
      toast({ title: "Operation Failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;
    try {
      await deletePromotion(id);
      toast({ title: "Promotion Deleted" });
      loadPromos();
    } catch (err) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center">
          <Percent className="mr-3 h-8 w-8 text-accent" />
          Promotions & Special Offers
        </h1>
        <Button onClick={() => setEditingPromo({ title: '', code: '', discountType: 'percentage', value: 10, startDate: '', endDate: '', isActive: true })}>
          <Plus className="mr-2 h-4 w-4" /> New Promotion
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active & Upcoming Offers</CardTitle>
          <CardDescription>Manage your discount codes and seasonal tour promos.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promos.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-bold">{promo.title}</TableCell>
                  <TableCell><Badge variant="secondary" className="font-mono">{promo.code}</Badge></TableCell>
                  <TableCell>{promo.discountType === 'percentage' ? `${promo.value}%` : `$${promo.value}`}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{promo.endDate || 'No expiration'}</TableCell>
                  <TableCell>
                    <Badge variant={promo.isActive ? 'default' : 'outline'}>
                        {promo.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditingPromo(promo)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(promo.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {promos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No promotions found. Create your first offer!</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingPromo} onOpenChange={() => setEditingPromo(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPromo?.id ? 'Edit Promotion' : 'Create New Promotion'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Promotion Title</Label>
              <Input 
                value={editingPromo?.title || ''} 
                onChange={(e) => setEditingPromo(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Early Bird Summer Special"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Promo Code</Label>
                    <Input 
                        value={editingPromo?.code || ''} 
                        onChange={(e) => setEditingPromo(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="SUMMER24"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Discount Value</Label>
                    <Input 
                        type="number"
                        value={editingPromo?.value || 0} 
                        onChange={(e) => setEditingPromo(prev => ({ ...prev, value: parseInt(e.target.value) }))}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Discount Type</Label>
                    <select 
                        className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
                        value={editingPromo?.discountType || 'percentage'}
                        onChange={(e) => setEditingPromo(prev => ({ ...prev, discountType: e.target.value as any }))}
                    >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input 
                        type="date"
                        value={editingPromo?.endDate || ''} 
                        onChange={(e) => setEditingPromo(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingPromo(null)}>Cancel</Button>
              <Button type="submit">Save Promotion</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
