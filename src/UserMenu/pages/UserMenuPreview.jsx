import React from "react";

const FEATURED_SECTIONS = [
  {
    title: "Featured Items",
    highlight: "Chef's Specials crafted for today",
    items: [
      {
        name: "Truffle Mushroom Soup",
        description: "Creamy wild mushroom soup with truffle oil and crispy croutons.",
        price: "₹420",
      },
      {
        name: "Heirloom Tomato Bruschetta",
        description: "Grilled sourdough topped with basil pesto and feta crumble.",
        price: "₹380",
      },
    ],
  },
  {
    title: "Mains",
    highlight: "Made-to-order plates served fresh",
    items: [
      {
        name: "Lemon Butter Salmon",
        description: "Pan-seared Norwegian salmon, asparagus, citrus butter sauce.",
        price: "₹920",
      },
      {
        name: "Tuscan Chicken Pasta",
        description: "Sun-dried tomatoes, roasted garlic cream, fresh tagliatelle.",
        price: "₹780",
      },
    ],
  },
];

export function UserMenuPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="relative isolate overflow-hidden px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            RB Theekshana · QR Dining
          </p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
            Scan, browse &amp; order — all from your table.
          </h1>
          <p className="mt-4 text-base text-slate-300">
            Digital menu crafted for a seamless dining experience. Explore chef recommendations,
            seasonal sips, and limited drops updated in real-time.
          </p>
        </div>
        <div className="pointer-events-none absolute inset-x-1/3 -bottom-12 h-40 rounded-full bg-emerald-400/40 blur-3xl" />
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 pb-16">
        {FEATURED_SECTIONS.map(({ title, highlight, items }) => (
          <section
            key={title}
            className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.4)] backdrop-blur"
          >
            <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{title}</p>
                <h2 className="text-2xl font-semibold">{highlight}</h2>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-200 hover:text-emerald-200"
              >
                View all
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {items.map(({ name, description, price }) => (
                <article
                  key={name}
                  className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 text-left sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="mt-1 text-sm text-slate-300">{description}</p>
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <span className="text-2xl font-semibold">{price}</span>
                    <button
                      type="button"
                      className="rounded-full bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
                    >
                      Add to cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-3xl border border-white/5 bg-gradient-to-r from-emerald-400/10 to-emerald-500/10 p-6 text-center shadow-inner">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">scan &amp; share</p>
          <h3 className="mt-3 text-2xl font-semibold">Your friends can access this menu via QR</h3>
          <p className="mt-2 text-sm text-slate-200">
            This preview showcases how diners will experience your digital menu. Items and branding
            update instantly from the owner dashboard.
          </p>
        </section>
      </main>
    </div>
  );
}

