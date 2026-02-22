
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit2, Trash2, EyeOff, Flag, MessageSquare, Search, ShieldAlert, Loader2 } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchBlogPosts, deleteBlogPost, updatePostStatus, type BlogPost } from '@/lib/services/cms-service';

export default function AdminPostsPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTermPosts, setSearchTermPosts] = useState('');
  const [statusFilterPosts, setStatusFilterPosts] = useState('all');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBlogPosts();
      setPosts(data);
    } catch (error) {
      toast({ title: "Failed to load posts", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostAction = async (action: string, post: BlogPost) => {
    try {
      if (action === 'Delete') {
        if (!confirm(`Delete "${post.title}"?`)) return;
        await deleteBlogPost(post.id);
        toast({ title: "Post Deleted" });
      } else if (action === 'Hide') {
        await updatePostStatus(post.id, 'Hidden');
        toast({ title: "Post Hidden" });
      } else if (action === 'Unhide') {
        await updatePostStatus(post.id, 'Published');
        toast({ title: "Post Published" });
      }
      loadPosts();
    } catch (err) {
      toast({ title: "Action Failed", variant: "destructive" });
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTermPosts.toLowerCase()) || 
                          post.author.toLowerCase().includes(searchTermPosts.toLowerCase());
    const matchesStatus = statusFilterPosts === 'all' || post.status === statusFilterPosts;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: BlogPost['status']): "default" | "secondary" | "destructive" | "outline" => {
    if (status === 'Published') return 'default';
    if (status === 'Hidden') return 'secondary';
    if (status === 'Reported') return 'destructive';
    return 'outline';
  }

  return (
    <div className="space-y-6">
      <Card className="transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Content Moderation</CardTitle>
          <CardDescription>Manage your live blog posts directly from Firestore.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:max-w-md">
              <TabsTrigger value="posts">Manage Posts</TabsTrigger>
              <TabsTrigger value="comments" disabled>Manage Comments (Planned)</TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <Card className="mt-4 border-0 shadow-none">
                <CardHeader>
                  <CardTitle>Post List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative w-full sm:max-w-sm">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input 
                          placeholder="Search by title or author..." 
                          className="pl-9"
                          value={searchTermPosts}
                          onChange={(e) => setSearchTermPosts(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilterPosts} onValueChange={setStatusFilterPosts}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Hidden">Hidden</SelectItem>
                        <SelectItem value="Reported">Reported</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPosts.map((post) => (
                            <TableRow key={post.id}>
                              <TableCell className="font-medium">{post.title}</TableCell>
                              <TableCell>{post.author}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(post.status)}>{post.status}</Badge>
                              </TableCell>
                              <TableCell>{post.date}</TableCell>
                              <TableCell className="text-right space-x-1">
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/blog/${post.id}`} target="_blank"><Eye className="h-4 w-4" /></Link>
                                </Button>
                                {post.status === 'Hidden' ?
                                  <Button variant="ghost" size="icon" className="text-green-600" onClick={() => handlePostAction('Unhide', post)}><Eye className="h-4 w-4" /></Button>
                                  :
                                  <Button variant="ghost" size="icon" className="text-orange-500" onClick={() => handlePostAction('Hide', post)}><EyeOff className="h-4 w-4" /></Button>
                                }
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handlePostAction('Delete', post)}><Trash2 className="h-4 w-4" /></Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {filteredPosts.length === 0 && (
                             <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No posts found.</TableCell></TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
