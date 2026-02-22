
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getBlogPost, type BlogPost } from '@/lib/services/cms-service';

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ref, isVisible] = useScrollAnimation();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBlogPost(id as string);
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <Button variant="link" asChild className="mt-4"><Link href="/blog">Back to Journal</Link></Button>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn('space-y-6 scroll-animate', isVisible && 'scroll-animate-in')}>
      <Button variant="ghost" asChild>
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Journal
        </Link>
      </Button>
      <Card className="shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">{post.title}</CardTitle>
          <CardDescription>
            By {post.author} on {post.date}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {post.imageUrl && (
            <div className="relative w-full mb-6 rounded-lg overflow-hidden aspect-[2/1]">
              <Image 
                src={post.imageUrl} 
                alt={post.title} 
                className="object-cover" 
                fill
                data-ai-hint={post.dataAiHint} 
                priority
              />
            </div>
          )}
          <div className="prose dark:prose-invert max-w-none whitespace-pre-line leading-relaxed">
            <p>{post.content}</p>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Link key={tag} href={`/blog?tag=${tag.replace('#', '')}`}>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full hover:bg-secondary/80 transition-colors">{tag}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
