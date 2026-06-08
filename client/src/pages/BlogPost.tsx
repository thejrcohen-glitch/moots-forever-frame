import { useEffect } from "react";
import { Link, useRoute } from "wouter";

const POSTS = [
  {
    slug: "the-first-signal",
    title: "The First Signal",
    date: "June 6, 2026",
    category: "Dispatch",
    body: [
      "MootsFrame is live.",
      "Not finished. Not polished into something it is not. Just live.",
      "That matters.",
      "This project exists to give riders, shops, and local cycling communities across Texas, Arkansas, and Oklahoma a clear path into Moots. Not a noisy one. Not a hard-sell one. A real one.",
      "Ian Zakrocki is the territory point for Moots across Texas, Arkansas, and Oklahoma. Dealer conversations, rider inquiries, pop-up requests, event interest, and individual order paths need to move through a clean structure. The goal is not to create more noise around the brand. The goal is to make sure real interest gets handled the right way.",
      "MootsFrame is the front door for that work.",
      "A signal is not a sale.",
      "A rider asking about a demo is a signal. A shop asking about an event is a signal. A gravel race drawing the right crowd is a signal. A local route becoming a regular gathering point is a signal.",
      "The system decides what happens next.",
      "Texas has its long roads, heat, wind, fast groups, and quiet Hill Country miles. Arkansas has Bentonville, Northwest Arkansas gravel, and a cycling culture that keeps getting deeper. Oklahoma has Stillwater, Tulsa, OKC, and a kind of riding that rewards patience and strength.",
      "Moots has never needed hype to matter. The bikes already carry their own weight. Titanium is quiet that way. It does not beg for attention. It stays.",
      "This is the first signal. The frame is live. The work starts here.",
    ],
  },
  {
    slug: "grassroots-gravel-pueblo",
    title: "Grassroots Gravel: Pueblo, October 10",
    date: "June 6, 2026",
    category: "Events",
    body: [
      "Grassroots Gravel is not in Texas, Arkansas, or Oklahoma.",
      "That is part of why it matters.",
      "Some races sit outside the territory but still say something about the riders inside it. Pueblo is one of those places. Dry roads. Open country. Long views. Enough edge to make the day honest.",
      "Grassroots Gravel returns to Pueblo, Colorado on October 10, 2026, with route options at 15, 40, 75, and 110 miles. The event is built as a gravel race, ride, and festival with a two-day expo, live music, and a community-first feel.",
      "That kind of event draws the same rider MootsFrame is built to serve. Not someone chasing noise. Someone looking for a bike that feels settled after the first hour. Someone who understands that long days reveal what matters.",
      "For riders coming from Texas, Arkansas, or Oklahoma, Pueblo is a good October target. Late enough in the year to feel like a season marker. Far enough away to feel like a trip. Close enough to build a real plan.",
      "Ride the bike you trust when the pavement ends and the day gets long. Something stable. Something quiet. Something that does not ask to be managed every mile.",
      "A Moots gravel bike makes sense here because Pueblo rewards durability, composure, and patience. Not flash.",
      "Driving gives you control. If flying, Pueblo Memorial Airport is closest. Colorado Springs is another option with broader access.",
      "Some events are races. Some are signals. Pueblo feels like both.",
    ],
  },
  {
    slug: "where-moots-meets-coffee-bentonville",
    title: "Where Moots Meets Coffee: Bentonville",
    date: "June 6, 2026",
    category: "Routes",
    body: [
      "Bentonville has become one of the places cyclists talk about for a reason.",
      "The riding is close. The routes stack together. The town understands bikes without needing to explain itself every five minutes.",
      "Most people think of Bentonville as a mountain bike town first. That is fair. But the gravel scene around Northwest Arkansas has its own pull. Quiet county roads. Rolling terrain. Dirt that can turn from friendly to serious without much warning.",
      "For MootsFrame, Bentonville matters because it has the right mix. Riders. Shops. Coffee. Routes. A culture that actually rides.",
      "Airship Coffee at Coler sits inside the Coler Mountain Bike Preserve. A trail-access coffee stop riders reach by bike or on foot. The ride is part of the stop.",
      "The Meteor in Bentonville is another anchor. A cafe and bike shop built around coffee, food, beer, service, bikes, and the cycling community. Less like a retail stop. More like a front porch for riders.",
      "Other local stops matter too. The HUB, Onyx Coffee, Ozark Mountain Bagel, and Sunny's are all part of how a Bentonville riding weekend shapes up.",
      "You ride. You stop. You talk. You find out who is building what. You hear where the next route is. You see the bikes people actually trust.",
      "A Moots fits naturally into that setting. Not because it needs attention. Because Bentonville rewards equipment that disappears under the rider and keeps showing up.",
      "Start near downtown. Roll toward the edge of town. Let the surface change. Keep the stop simple. Coffee before. Coffee after. Maybe both.",
      "Bentonville is not just a place to visit. It is a place to listen.",
    ],
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
              <div className="mb-10">
                {post.body.map((paragraph, index) => (
                  <p key={`${post.slug}-${index}`} className="font-mono-custom text-base leading-loose mb-4" style={{ color: "oklch(0.78 0.03 70)" }}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <a
                href="/#book-a-pop-up"
                className="inline-block font-label text-xs tracking-[0.2em] uppercase px-6 py-3 transition-opacity hover:opacity-80"
                style={{ background: "oklch(0.72 0.14 65)", color: "oklch(0.22 0.01 60)" }}
              >
                Request a pop-up in your city →
              </a>
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
