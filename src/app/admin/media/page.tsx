
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Video as VideoIcon, Wand2, Film } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { generateVideo } from '@/ai/flows/generate-video-flow';
import RotarySpinner from '@/components/ui/rotary-spinner';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
  caption?: string;
  date?: string;
  tags: string[];
}

interface AdminVideoItem {
  id: string;
  url: string; 
  title: string;
  description?: string;
  tags: string[];
  submittedDate: string;
  thumbnailUrl?: string; 
  dataAiHint?: string; 
  sourceType?: 'url' | 'upload' | 'generated'; 
  videoDataUri?: string;
}

const imageMediaSchema = z.object({
  caption: z.string().max(100, "Caption cannot exceed 100 characters.").optional(),
  tags: z.string().optional(),
  imageUrl: z.string().min(1, 'Image is required.'),
  dataAiHint: z.string().max(50, 'Keywords cannot exceed 50 characters.').optional(),
});
type ImageMediaFormValues = z.infer<typeof imageMediaSchema>;

const videoMediaSchema = z.object({
  videoFile: z.custom<FileList>().optional(),
  videoUrl: z.string().url('Please enter a valid video URL.').optional().or(z.literal('')),
  title: z.string().min(3, 'Title is required.').max(100),
  description: z.string().max(500).optional(),
  tags: z.string().optional(),
}).superRefine((data, ctx) => {
  if ((!data.videoFile || data.videoFile.length === 0) && !data.videoUrl) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Either upload a video file or provide a URL.", path: ['videoFile'] });
  }
});
type VideoMediaFormValues = z.infer<typeof videoMediaSchema>;

const generateVideoSchema = z.object({
    prompt: z.string().min(10, 'Prompt must be at least 10 characters.'),
    title: z.string().min(3, 'Title is required.').max(100),
    description: z.string().max(500).optional(),
});
type GenerateVideoFormValues = z.infer<typeof generateVideoSchema>;

export default function AdminMediaPage() {
  const [isUploadImageDialogOpen, setIsUploadImageDialogOpen] = useState(false);
  const [isAddVideoDialogOpen, setIsAddVideoDialogOpen] = useState(false);
  const [isGenerateVideoDialogOpen, setIsGenerateVideoDialogOpen] = useState(false);
  
  const [isSubmittingImage, setIsSubmittingImage] = useState(false);
  const [isSubmittingVideo, setIsSubmittingVideo] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const { toast } = useToast();
  const [adminGalleryImages, setAdminGalleryImages] = useState<GalleryImage[]>([]); 
  const [adminVideoItems, setAdminVideoItems] = useState<AdminVideoItem[]>([]);

  const imageForm = useForm<ImageMediaFormValues>({ resolver: zodResolver(imageMediaSchema), defaultValues: { caption: '', tags: '', imageUrl: '', dataAiHint: '' } });
  const videoForm = useForm<VideoMediaFormValues>({ resolver: zodResolver(videoMediaSchema), defaultValues: { videoUrl: '', title: '', description: '', tags: '' } });
  const generateVideoForm = useForm<GenerateVideoFormValues>({ resolver: zodResolver(generateVideoSchema), defaultValues: { prompt: '', title: '', description: '' } });

  const watchedImageUrl = imageForm.watch('imageUrl');

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageForm.setValue('imageUrl', reader.result as string, { shouldValidate: true }); 
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitImageMedia: SubmitHandler<ImageMediaFormValues> = async (data) => {
    setIsSubmittingImage(true);
    // ... submission logic
    setIsSubmittingImage(false);
    setIsUploadImageDialogOpen(false);
  };

  const onSubmitVideoMedia: SubmitHandler<VideoMediaFormValues> = async (data) => {
    setIsSubmittingVideo(true);
    // ... submission logic
    setIsSubmittingVideo(false);
    setIsAddVideoDialogOpen(false);
  };

  const onGenerateVideo: SubmitHandler<GenerateVideoFormValues> = async (data) => {
    setIsGeneratingVideo(true);
    toast({ title: "Video Generation Started", description: "This may take a minute or two. Please wait..." });
    try {
        const result = await generateVideo({ prompt: data.prompt });
        
        const newVideo: AdminVideoItem = {
          id: `admin-vid-${Date.now()}`,
          url: "AI Generated",
          title: data.title,
          description: data.description,
          tags: [`#AI`, `#${data.prompt.split(' ')[0]}`],
          submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          thumbnailUrl: placeholderImages.videoPlaceholder.src,
          dataAiHint: data.prompt,
          sourceType: 'generated',
          videoDataUri: result.videoDataUri,
        };
        setAdminVideoItems(prev => [newVideo, ...prev]);
        toast({ title: "Video Generated Successfully!", description: `Video for "${data.title}" has been added.` });
        generateVideoForm.reset();
        setIsGenerateVideoDialogOpen(false);
    } catch (error) {
        console.error("Video generation failed:", error);
        toast({ title: "Video Generation Failed", description: error instanceof Error ? error.message : "An unknown error occurred.", variant: "destructive" });
    } finally {
        setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Media Library Management</CardTitle>
          <CardDescription>Manage images and videos. Upload, link, or generate new media.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* IMAGE SECTION */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Image Gallery</h3>
            <div className="flex gap-2">
              <Dialog open={isUploadImageDialogOpen} onOpenChange={setIsUploadImageDialogOpen}>
                <DialogTrigger asChild><Button><UploadCloud className="mr-2 h-4 w-4" /> Upload Image</Button></DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  {/* Image Upload Form */}
                </DialogContent>
              </Dialog>
            </div>
            {adminGalleryImages.length > 0 && <div className="mt-6 border-t pt-4">...</div>}
          </div>

          <hr className="my-6"/>

          {/* VIDEO SECTION */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Video Library</h3>
            <div className="flex gap-2">
              <Dialog open={isAddVideoDialogOpen} onOpenChange={setIsAddVideoDialogOpen}>
                <DialogTrigger asChild><Button><VideoIcon className="mr-2 h-4 w-4" /> Add Video</Button></DialogTrigger>
                <DialogContent className="sm:max-w-xl">{/* Video Upload/Link Form */}</DialogContent>
              </Dialog>
              <Dialog open={isGenerateVideoDialogOpen} onOpenChange={setIsGenerateVideoDialogOpen}>
                <DialogTrigger asChild><Button variant="outline"><Wand2 className="mr-2 h-4 w-4" /> Generate Video</Button></DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                   <DialogHeader>
                      <DialogTitle className="font-headline text-2xl text-primary">Generate Video with AI</DialogTitle>
                      <DialogDescription>Describe the video you want to create. This process can take up to 2 minutes.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={generateVideoForm.handleSubmit(onGenerateVideo)} className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="video-gen-title" className="font-semibold">Video Title</Label>
                            <Input id="video-gen-title" {...generateVideoForm.register('title')} placeholder="e.g., Majestic Lion Roar" disabled={isGeneratingVideo} />
                            {generateVideoForm.formState.errors.title && <p className="text-sm text-destructive mt-1">{generateVideoForm.formState.errors.title.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="video-gen-prompt" className="font-semibold">Video Prompt</Label>
                            <Textarea id="video-gen-prompt" {...generateVideoForm.register('prompt')} placeholder="e.g., A cinematic, ultra-realistic video of a majestic lion roaring on a rock at sunset" rows={4} disabled={isGeneratingVideo} />
                            {generateVideoForm.formState.errors.prompt && <p className="text-sm text-destructive mt-1">{generateVideoForm.formState.errors.prompt.message}</p>}
                        </div>
                         <div>
                            <Label htmlFor="video-gen-desc" className="font-semibold">Description (Optional)</Label>
                            <Textarea id="video-gen-desc" {...generateVideoForm.register('description')} placeholder="A brief summary of the video" rows={2} disabled={isGeneratingVideo} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsGenerateVideoDialogOpen(false)} disabled={isGeneratingVideo}>Cancel</Button>
                            <Button type="submit" disabled={isGeneratingVideo} className="bg-primary hover:bg-primary/90">
                                {isGeneratingVideo ? <><RotarySpinner size={16} className="mr-2"/>Generating...</> : <><Wand2 className="mr-2 h-4 w-4"/>Generate</>}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
              </Dialog>
            </div>
            
            {adminVideoItems.length > 0 && (
                <div className="mt-6 border-t pt-4">
                    <h4 className="font-semibold text-md mb-3">Added Videos:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {adminVideoItems.map(video => (
                            <Card key={video.id} className="overflow-hidden">
                                <div className="relative w-full aspect-video bg-muted">
                                    {video.sourceType === 'generated' && video.videoDataUri ? (
                                        <video controls src={video.videoDataUri} className="w-full h-full object-cover" />
                                    ) : (
                                        <Image src={video.thumbnailUrl || placeholderImages.videoPlaceholder.src} alt={video.title} fill objectFit="cover" data-ai-hint={video.dataAiHint || 'video content'} />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-2 pointer-events-none">
                                      <Film className="h-5 w-5 text-white/80 mr-1" />
                                      <p className="text-white text-xs font-medium truncate" title={video.title}>{video.title}</p>
                                    </div>
                                    <Badge variant="secondary" className="absolute top-2 left-2 text-xs capitalize">{video.sourceType}</Badge>
                                </div>
                                <CardContent className="p-3 text-xs">
                                    {video.sourceType === 'url' ? (
                                        <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block" title={video.url}>{video.url}</a>
                                    ) : (
                                        <p className="text-muted-foreground truncate block" title={video.url}>{video.url}</p>
                                    )}
                                    <p className="text-muted-foreground mt-1 line-clamp-2" title={video.description}>{video.description || 'No description.'}</p>
                                    {video.tags.length > 0 && (
                                      <div className="mt-1.5 flex flex-wrap gap-1">
                                        {video.tags.map(tag => <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0.5">{tag}</Badge>)}
                                      </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            {adminVideoItems.length === 0 && <p className="text-sm text-muted-foreground mt-4">No videos added by admin yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
