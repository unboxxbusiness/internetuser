
const newsItems = [
  {
    title: "New 5G Network Expansion",
    description:
      "We're expanding our 5G network to bring faster speeds to more areas. Check our coverage map for updates.",
    image: {
      src: "https://picsum.photos/seed/news1/300/300",
      alt: "New 5G Network Expansion",
      hint: "network tower",
    },
  },
  {
    title: "Limited Time Offer: Free Installation",
    description:
      "Get free installation on all new plans for a limited time. Don't miss out on this great offer!",
    image: {
      src: "https://picsum.photos/seed/news2/300/300",
      alt: "Limited Time Offer: Free Installation",
      hint: "worker installing",
    },
  },
];

export function News() {
  return (
    <section id="news-offers" className="py-16 sm:py-24 bg-slate-100 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white text-center">
              Latest News & Offers
            </h2>

            <div className="mt-8 space-y-8">
              {newsItems.map((item) => (
                <div key={item.title} className="flex gap-6 items-start">
                  <div className="w-32 h-32 flex-shrink-0 relative">
                    <img
                      src={item.image.src}
                      alt={item.image.alt}
                      className="w-full h-full rounded-lg shadow-md object-cover"
                      data-ai-hint={item.image.hint}
                    />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {item.title}
                    </p>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
