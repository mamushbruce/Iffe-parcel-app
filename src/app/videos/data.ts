
import placeholderImages from '@/app/lib/placeholder-images.json';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  dataAiHint: string;
  youtubeVideoId?: string; 
  category: string;
  duration?: string;
  previewVideoUrl?: string; 
}

const mockVideoData: VideoItem[] = [
  { id: 'v1', title: 'Sunrise Over the Serengeti', description: 'Witness the breathtaking beauty of a sunrise casting its golden hues over the vast plains of the Serengeti.', thumbnailUrl: placeholderImages.videoThumbConference.src, dataAiHint: 'Serengeti sunrise', youtubeVideoId: 'LXb3EKWsInQ', category: 'Destination Highlights', duration: '2:30', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
  { id: 'v2', title: 'Gorilla Trekking in Bwindi', description: 'An up-close and personal look at a family of mountain gorillas in Uganda\'s Bwindi Impenetrable Forest.', thumbnailUrl: placeholderImages.videoThumbTraining.src, dataAiHint: 'gorilla family', category: 'Expeditions', youtubeVideoId: 'LXb3EKWsInQ', duration: '5:45', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
  { id: 'v3', title: 'The Great Wildebeest Migration', description: 'Experience the thunderous river crossings of the Great Migration, a true wonder of the natural world.', thumbnailUrl: placeholderImages.videoThumbWater.src, dataAiHint: 'wildebeest river', youtubeVideoId: 'LXb3EKWsInQ', category: 'Nature & Wildlife', duration: '4:10', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
  { id: 'v4', title: 'Traveler Stories: My First Safari', description: 'Hear from a recent traveler about their unforgettable first safari experience with iffe-travels.', thumbnailUrl: placeholderImages.videoThumbTestimonial.src, dataAiHint: 'tourist testimonial', category: 'Testimonials', youtubeVideoId: 'LXb3EKWsInQ', duration: '6:22', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' },
  { id: 'v5', title: 'Packing for a Safari: Pro Tips', description: 'Our expert guides share their top tips on what to pack for the ultimate safari adventure.', thumbnailUrl: placeholderImages.videoThumbYouth.src, dataAiHint: 'safari packing', category: 'Travel Tips', youtubeVideoId: 'LXb3EKWsInQ', duration: '3:50', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  { id: 'v6', title: 'Okavango Delta Mokoro Trip', description: 'A serene journey through the waterways of the Okavango Delta in a traditional dugout canoe.', thumbnailUrl: placeholderImages.videoThumbPlanning.src, dataAiHint: 'mokoro canoe safari', category: 'Expeditions', youtubeVideoId: 'LXb3EKWsInQ', duration: '4:30', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
];

export function getMockVideoData() {
    return mockVideoData;
}
