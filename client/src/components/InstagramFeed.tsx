import { useEffect, useRef, useState } from 'react';
import Instafeed from 'instafeed.js';
import { Loader2 } from 'lucide-react';

interface InstagramFeedProps {
  accessToken?: string;
  limit?: number;
}

export function InstagramFeed({ accessToken, limit = 12 }: InstagramFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!feedRef.current) return;

    try {
      // Initialize Instafeed with the provided or environment access token
      const token = accessToken || import.meta.env.VITE_INSTAGRAM_TOKEN || '';

      if (!token) {
        setError('Instagram token not configured. Please add VITE_INSTAGRAM_TOKEN to your environment.');
        setLoading(false);
        return;
      }

      const instafeed = new Instafeed({
        accessToken: token,
        limit: limit,
        target: feedRef.current.id,
      } as any);

      // Build the feed
      (instafeed as any).build().then(() => {
        setLoading(false);
      }).catch((err: Error) => {
        console.error('Instagram feed error:', err);
        setError('Unable to load Instagram feed. Please try again later.');
        setLoading(false);
      });
    } catch (err) {
      console.error('Instagram feed initialization error:', err);
      setError('Failed to initialize Instagram feed.');
      setLoading(false);
    }
  }, [accessToken, limit]);

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold mb-2 text-foreground">
            Latest from @mootsframes
          </h2>
          <p className="text-muted-foreground mb-4">
            Follow our community on Instagram for daily inspiration and updates
          </p>
          <a
            href="https://www.instagram.com/mootsframes?igsh=MWJncDdsejFuMnIzNg=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Follow @mootsframes
          </a>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
              <p className="text-muted-foreground">Loading Instagram feed...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center mb-8">
            <p className="text-destructive font-medium">{error}</p>
            <p className="text-muted-foreground text-sm mt-2">
              Visit{' '}
              <a
                href="https://www.instagram.com/mootsframes?igsh=MWJncDdsejFuMnIzNg=="
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline text-accent"
              >
                @mootsframes on Instagram
              </a>{' '}
              directly to see our latest posts
            </p>
          </div>
        )}

        {/* Instagram Feed Grid */}
        <div
          id="instafeed"
          ref={feedRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {/* Instafeed.js will populate this div */}
        </div>

        {/* View More Link */}
        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/mootsframes?igsh=MWJncDdsejFuMnIzNg=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-accent hover:underline font-medium"
          >
            View more on Instagram →
          </a>
        </div>
      </div>

      <style>{`
        .instafeed {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        .instafeed a {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          aspect-ratio: 1;
          display: block;
        }

        .instafeed img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .instafeed a:hover img {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
