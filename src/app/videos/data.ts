
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
  { id: 'v1', title: 'Sunrise Over the Serengeti', description: 'Witness the breathtaking beauty of a sunrise casting its golden hues over the vast plains of the Serengeti.', thumbnailUrl: 'https://i.ytimg.com/vi/mNCp-o-f3qA/maxresdefault.jpg', dataAiHint: 'Serengeti sunrise', youtubeVideoId: 'mNCp-o-f3qA', category: 'Destination Highlights', duration: '2:30', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
  { id: 'v2', title: 'Gorilla Trekking in Bwindi', description: 'An up-close and personal look at a family of mountain gorillas in Uganda\'s Bwindi Impenetrable Forest.', thumbnailUrl: 'https://i.ytimg.com/vi/s8ITbs0n-wA/maxresdefault.jpg', dataAiHint: 'gorilla family', category: 'Expeditions', youtubeVideoId: 's8ITbs0n-wA', duration: '5:45', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
  { id: 'v3', title: 'The Great Wildebeest Migration', description: 'Experience the thunderous river crossings of the Great Migration, a true wonder of the natural world.', thumbnailUrl: 'https://i.ytimg.com/vi/uP2gS-OD5-M/maxresdefault.jpg', dataAiHint: 'wildebeest river', youtubeVideoId: 'uP2gS-OD5-M', category: 'Nature & Wildlife', duration: '4:10', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
  { id: 'v4', title: 'Traveler Stories: My First Safari', description: 'Hear from a recent traveler about their unforgettable first safari experience with iffe-travels.', thumbnailUrl: 'https://i.ytimg.com/vi/yYnI2i02u5c/maxresdefault.jpg', dataAiHint: 'tourist testimonial', category: 'Testimonials', youtubeVideoId: 'yYnI2i02u5c', duration: '6:22', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' },
  { id: 'v5', title: 'Packing for a Safari: Pro Tips', description: 'Our expert guides share their top tips on what to pack for the ultimate safari adventure.', thumbnailUrl: 'https://i.ytimg.com/vi/O15A2O2s2i4/maxresdefault.jpg', dataAiHint: 'safari packing', category: 'Travel Tips', youtubeVideoId: 'O15A2O2s2i4', duration: '3:50', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  { id: 'v6', title: 'Okavango Delta Mokoro Trip', description: 'A serene journey through the waterways of the Okavango Delta in a traditional dugout canoe.', thumbnailUrl: 'https://i.ytimg.com/vi/zTfB3B5XpPA/maxresdefault.jpg', dataAiHint: 'mokoro canoe safari', category: 'Expeditions', youtubeVideoId: 'zTfB3B5XpPA', duration: '4:30', previewVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
];

export function getMockVideoData() {
    // To make thumbnails more relevant, we can generate them from the youtube id
    return mockVideoData.map(video => ({
        ...video,
        thumbnailUrl: video.youtubeVideoId ? `https://i3.ytimg.com/vi/${video.youtubeVideoId}/maxresdefault.jpg` : video.thumbnailUrl,
    }));
}
