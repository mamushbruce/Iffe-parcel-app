
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default function WatchPage({ params }: Props) {
  const videoId = params.id;

  if (!videoId) {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          title="YouTube video player"
        />
      </div>
      {/* I can add more details about the video here later if needed */}
    </main>
  );
}
