import { useEffect } from "react";
import { Link, useRoute } from "wouter";

const POST_SEO: Partial<Record<string, { title: string; description: string; ogTitle: string; ogDescription: string }>> = {
  "the-first-signal": {
    title: "The First Signal — MootsFrame Field Notes",
    description:
      "MootsFrame is live. The Moots territory rep for Texas, Arkansas, and Oklahoma starts here. What this project is, what it means, and where it is going.",
    ogTitle: "The First Signal — MootsFrame Field Notes",
    ogDescription:
      "MootsFrame is live. The Moots territory rep for Texas, Arkansas, and Oklahoma starts here. What this project is, what it means, and where it is going.",
  },
  "grassroots-gravel-pueblo": {
    title: "Grassroots Gravel 2026 — Pueblo, CO — MootsFrame Field Notes",
    description:
      "Grassroots Gravel returns October 10, 2026 in Pueblo, CO. 15 to 110 miles of Colorado gravel. Why this race matters to riders in Texas, Arkansas, and Oklahoma.",
    ogTitle: "Grassroots Gravel 2026 — Pueblo, CO — MootsFrame Field Notes",
    ogDescription:
      "Grassroots Gravel returns October 10, 2026 in Pueblo, CO. 15 to 110 miles of Colorado gravel. Why this race matters to riders in Texas, Arkansas, and Oklahoma.",
  },
  "where-moots-meets-coffee-bentonville": {
    title: "Bentonville Gravel and Coffee — Where Moots Meets the Ride — MootsFrame",
    description:
      "The gravel scene in Bentonville, Arkansas runs deep. Where cyclists stop for coffee, what routes connect them, and why Moots fits here.",
    ogTitle: "Bentonville Gravel and Coffee — Where Moots Meets the Ride — MootsFrame",
    ogDescription:
      "The gravel scene in Bentonville, Arkansas runs deep. Where cyclists stop for coffee, what routes connect them, and why Moots fits here.",
  },
};

const POSTS = [
  {
    slug: "sbt-grvl-steamboat",
    title: "Steamboat",
    subtitle: "Four years to the finish line. Why SBT GRVL matters, and why it happens to be in the town where Moots was born.",
    author: "J.R. Cohen",
    date: "2026-06-24",
    category: "Field Note",
    tags: ["SBT GRVL", "Steamboat Springs", "Moots", "gravel", "field note"],
    body: [
      "\"Ready to ride some bikes with some friends.\"",
      "That's the first line of the documentary. It's also the truest thing anyone has said about what SBT GRVL actually is, once you get past the distance and the elevation and the clock.",
      "I had less than a minute left when I crossed the finish line. One hundred forty-two miles, close to ten thousand feet of climbing, and the cutoff running. I kept pedaling. That's the only way through.",
      "The town",
      "Steamboat Springs, Colorado, is where Moots Cycles has built titanium frames since 1981. That's the short version. The longer one starts with my brother.",
      "Steamboat was his favorite town in Colorado. He had a beat-up old Steamboat hat he wore until it fell apart. I didn't know then that the place he loved would end up being the place that changed my life.",
      "In July of 2016, I got a phone call from my father. I knew what it was before he said it. My brother had been struggling for a long time, and he took his own life. My mother said something to me that day I've carried ever since: I can't lose another son.",
      "Three years later, I was the one she might lose. My weight had climbed past 430 pounds. A doctor told me I was a type 2 diabetic, with an A1C near 12. Sitting in that office, my mother's words came back to me. I made a decision to change everything.",
      "It started small",
      "I took a mountain bike out to the seawall in Galveston, where my family was staying, and told myself I'd ride to the end and stop. I got to the end and kept going. One more water tower, then another, until I'd ridden the length of the island. The wind on the way back nearly broke me. I could have called someone to pick me up. I didn't want to. I wanted to finish what I started.",
      "That ride became the next ride, and the next, and eventually it became a different life. Riding wasn't about losing weight, not really. It was about proving to myself, over and over, that I could keep going when it would have been easier to stop.",
      "Four years to the finish line",
      "It took four years to get to that champagne finish.",
      "The first year, COVID had upended the event. The closest I could get to SBT GRVL was a ride of my own making just outside Houston — same distance, same spirit, none of the mountains.",
      "The next year, a friend and I drove from Houston to Steamboat, not to race, but to volunteer. We worked every hour they'd let us. Volunteering turned out to be the surest way in — it earned us a guaranteed spot the following year.",
      "That third year was my first time actually racing in Steamboat. I finished the Blue course, just over a hundred miles. One of the first real tests is a long, steep climb early in the race. That year, I had to get off my bike a couple of times to walk it. I'd intended to push for the Black, but I knew the math at the last checkpoint. I let it go and finished what I'd come to finish.",
      "The fourth year, I went back for the Black: 142 miles, around ten thousand feet of climbing. That same climb — I never got off my bike. Not once, except for a pit stop for water and fuel. I crossed the finish line with less than a minute to spare. A champagne finish. The kind they pour for everyone who makes it under the wire.",
      "Steamboat, again",
      "A few years into that new life, I started traveling to Steamboat regularly — not for cycling at first, but to help a friend in real estate cook for his clients during the season. Two years of that, back and forth to a town I didn't yet know was tied to my family's history.",
      "On one of those trips, I ended up at a bike shop called Orange Peel — the same shop where Moots got its start. I pointed at a bike. Just pointed, the way you do when something catches your eye and you don't expect anything to come of it.",
      "Four months later, that exact bike showed up at my door. A gift.",
      "I didn't choose Moots because of a spec sheet. I ended up on a Moots because of a friend, a shop in a town my brother loved, and a bike I pointed at without thinking too hard about it. Riding it, posting the miles — that's how I met Ian. We raced together. He and Moots gave me a Vamoots RCS, built for road but capable on cobbles and gravel. They saw what I was doing. What I was becoming. That's a story for another post, but it's part of this one.",
      "Why I keep telling this story",
      "I couldn't save my brother. If telling this honestly helps even one person decide to keep going on a hard day, that matters more to me than any finish time.",
      "SBT GRVL takes place each year in Steamboat Springs, Colorado. Race facts and dates are on our races page. Riders, clubs, and signals connected to the event are on our Strava Signals page.",
      "Titanium remembers where it's from. So do we.",
    ],
  },
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
  const postSeo = post ? POST_SEO[post.slug] : undefined;
  const title = postSeo?.title ?? (post ? `${post.title} — Field Notes` : "Field Notes — Moots Forever Frame");
  const description = postSeo?.description ?? (post ? `${post.category} from the Moots Forever Frame field notes.` : "Field notes from the Moots TX, AR, and OK territory.");
  const ogTitle = postSeo?.ogTitle ?? title;
  const ogDescription = postSeo?.ogDescription ?? description;
  const linkStyle = { color: "oklch(0.72 0.14 65)" };
  const relatedInternalLinks = [
    { href: "/races", label: "Races" },
    { href: "/strava", label: "Strava Signals" },
    { href: "/blog", label: "Field Notes" },
  ];
  const relatedExternalLinks = [
    { href: "https://www.strava.com/clubs/2216534", label: "MootsFrame Strava Club" },
    { href: "https://www.strava.com/clubs/476249", label: "SBT GRVL Strava Club" },
    { href: "https://sbtgrvl.com/", label: "SBT GRVL" },
  ];

  const renderBodyParagraph = (paragraph: string, index: number) => {
    const className = "font-mono-custom text-base leading-loose mb-4";
    const style = { color: "oklch(0.78 0.03 70)" };

    if (post?.slug === "sbt-grvl-steamboat" && paragraph.startsWith("SBT GRVL takes place")) {
      return (
        <p key={`${post.slug}-${index}`} className={className} style={style}>
          SBT GRVL takes place each year in Steamboat Springs, Colorado. Race facts and dates are on our{" "}
          <Link href="/races">
            <a className="hover:underline" style={linkStyle}>races page</a>
          </Link>
          . Riders, clubs, and signals connected to the event are on our{" "}
          <Link href="/strava">
            <a className="hover:underline" style={linkStyle}>Strava Signals page</a>
          </Link>
          .
        </p>
      );
    }

    return (
      <p key={`${post?.slug ?? "missing"}-${index}`} className={className} style={style}>
        {paragraph}
      </p>
    );
  };

  useEffect(() => {
    const url = post ? `https://mootsframe.com/blog/${post.slug}` : "https://mootsframe.com/blog";
    const setMetaContent = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };

    const canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalEl) canonicalEl.href = url;

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', ogTitle);
    setMetaContent('meta[property="og:description"]', ogDescription);
    setMetaContent('meta[property="og:url"]', url);
    setMetaContent('meta[name="twitter:title"]', ogTitle);
    setMetaContent('meta[name="twitter:description"]', ogDescription);

    if (!post || !postSeo) return;

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description,
      datePublished: "2026-06-07",
      dateModified: "2026-06-07",
      author: { "@type": "Person", name: "Ian Zakrocki" },
      publisher: { "@type": "Organization", name: "MootsFrame", url: "https://mootsframe.com" },
      mainEntityOfPage: url,
    };
    const articleSchemaScript = document.createElement("script");
    articleSchemaScript.type = "application/ld+json";
    articleSchemaScript.textContent = JSON.stringify(articleSchema);
    document.head.appendChild(articleSchemaScript);

    return () => {
      articleSchemaScript.remove();
    };
  }, [description, ogDescription, ogTitle, post, title]);

  return (
    <main className="min-h-screen" style={{ background: "oklch(0.22 0.01 60)" }}>
      <article className="py-24">
        <div className="container max-w-3xl">
          <Link href="/blog">
            <a className="font-mono-custom text-xs hover:underline" style={{ color: "oklch(0.72 0.14 65)" }}>
              ← Field Notes (Blog)
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
              {"subtitle" in post && post.subtitle && (
                <p className="font-mono-custom text-base leading-loose mb-5" style={{ color: "oklch(0.78 0.03 70)" }}>
                  {post.subtitle}
                </p>
              )}
              <p className="font-mono-custom text-xs mb-4" style={{ color: "oklch(0.52 0.04 65)" }}>
                {"author" in post && post.author ? `${post.author} · ` : ""}
                {post.date}
              </p>
              {"tags" in post && post.tags && (
                <div className="flex flex-wrap gap-2 mb-10">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-label text-[10px] tracking-[0.18em] uppercase px-2 py-1"
                      style={{ color: "oklch(0.88 0.025 75)", background: "oklch(0.30 0.01 60)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mb-10">
                {post.body.map((paragraph, index) => renderBodyParagraph(paragraph, index))}
              </div>
              {post.slug === "sbt-grvl-steamboat" && (
                <section className="mb-10 p-6" style={{ background: "oklch(0.24 0.01 60)", border: "1px solid oklch(0.38 0.015 60 / 0.5)" }}>
                  <p className="font-label text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "oklch(0.72 0.14 65)" }}>
                    Related Signals
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-5" style={{ color: "oklch(0.945 0.018 78)" }}>
                    Read More
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {relatedInternalLinks.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <a className="font-label text-xs tracking-[0.18em] uppercase p-4 transition-opacity hover:opacity-70" style={{ color: "oklch(0.88 0.025 75)", background: "oklch(0.30 0.01 60)" }}>
                          {item.label} →
                        </a>
                      </Link>
                    ))}
                    {relatedExternalLinks.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-label text-xs tracking-[0.18em] uppercase p-4 transition-opacity hover:opacity-70"
                        style={{ color: "oklch(0.88 0.025 75)", background: "oklch(0.30 0.01 60)" }}
                      >
                        {item.label} →
                      </a>
                    ))}
                  </div>
                </section>
              )}
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
