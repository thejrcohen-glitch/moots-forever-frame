import { useEffect } from "react";
import { Link, useRoute } from "wouter";

const POSTS = [
  {
    slug: "the-first-signal",
    title: "The First Signal",
    date: "June 6, 2026",
    category: "Dispatch",
    body: "Full post coming soon.",
  },
  {
    slug: "grassroots-gravel-pueblo",
    title: "Grassroots Gravel: Pueblo, October 10",
    date: "June 6, 2026",
    category: "Events",
    body: "Full post coming soon.",
  },
  {
    slug: "where-moots-meets-coffee-bentonville",
    title: "Where Moots Meets Coffee: Bentonville",
    date: "June 6, 2026",
    category: "Routes",
    body: "Full post coming soon.",
  },
];

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const post = POSTS.find((item) => item.slug === params?.slug);
  const title = post ? `${post.title} — Field Notes` : "Field Notes — Moots Forever Frame";
  const description = post ? `${post.category} from the Moots Forever Frame field notes.` : "Field notes from the Moots TX, AR, and OK territory.";

  useEffect(() => {
    const url = post ? `https://mootsframe.com/blog/${post.slug}` : "https://mootsframe.com/blog";
    const setMetaContent = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', url);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
  }, [description, post, title]);

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <article className="py-24">
        <div className="container max-w-3xl">
          <Link href="/blog">
            <a className="font-mono-custom text-xs hover:underline" style={{ color: "oklch(0.72 0.14 65)" }}>
              ← Field Notes
            </a>
          </Link>

          {post ? (
            <>
              <p className="font-label text-xs tracking-[0.35em] uppercase mt-10 mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>
                {post.category}
              </p>
              <h1 className="font-display text-5xl md:text-6xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
                {post.title}
              </h1>
              <p className="font-mono-custom text-xs mb-10" style={{ color: "oklch(0.52 0.04 65)" }}>
                {post.date}
              </p>
              <p className="font-mono-custom text-base leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
                {post.body}
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-5xl md:text-6xl font-bold mt-10 mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
                Note not found.
              </h1>
              <p className="font-mono-custom text-sm leading-loose" style={{ color: "oklch(0.78 0.03 70)" }}>
                That field note is not on the board.
              </p>
            </>
          )}
        </div>
      </article>
    </main>
  );
}
