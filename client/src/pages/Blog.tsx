import { useEffect } from "react";
import { Link } from "wouter";

const POSTS = [
  {
    slug: "the-first-signal",
    title: "The First Signal",
    date: "June 6, 2026",
    category: "Dispatch",
  },
  {
    slug: "grassroots-gravel-pueblo",
    title: "Grassroots Gravel: Pueblo, October 10",
    date: "June 6, 2026",
    category: "Events",
  },
  {
    slug: "where-moots-meets-coffee-bentonville",
    title: "Where Moots Meets Coffee: Bentonville",
    date: "June 6, 2026",
    category: "Routes",
  },
];

export default function Blog() {
  useEffect(() => {
    const title = "Field Notes — Moots Forever Frame";
    const description = "Field notes from the Moots TX, AR, and OK territory. Dispatches, events, and routes from the road.";
    const setMetaContent = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', "https://mootsframe.com/blog");
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <section className="py-24">
        <div className="container">
          <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>
            Moots Forever Frame
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
            Field Notes
          </h1>
          <p className="font-mono-custom text-sm leading-loose max-w-2xl" style={{ color: "oklch(0.78 0.03 70)" }}>
            Dispatches from the territory. Short notes. Real routes. No gloss.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-12">
            {POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <a className="block p-5 border transition-opacity hover:opacity-80" style={{ borderColor: "oklch(0.38 0.015 60)", background: "oklch(0.25 0.008 60)" }}>
                  <p className="font-label text-xs tracking-[0.25em] uppercase mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>
                    {post.category}
                  </p>
                  <h2 className="font-display text-2xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>
                    {post.title}
                  </h2>
                  <p className="font-mono-custom text-xs" style={{ color: "oklch(0.52 0.04 65)" }}>
                    {post.date}
                  </p>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
