import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/content/site";
import { getCollections } from "@/lib/commerce";
import { NewsletterForm } from "./NewsletterForm";
import { ReplayIntro } from "./ReplayIntro";

export async function Footer() {
  const collections = await getCollections();
  const groups = [
    {
      title: "Shop",
      links: [
        { label: "Shop all", href: "/shop" },
        { label: "New arrivals", href: "/new-arrivals" },
        { label: "Collections", href: "/collections" },
        { label: "Search", href: "/search" },
        { label: "Cart", href: "/cart" },
      ],
    },
    {
      title: "Collections",
      links: collections.map((c) => ({ label: c.title, href: `/collections/${c.handle}` })),
    },
    {
      title: "22SIDE",
      links: [
        { label: "About", href: "/about" },
        { label: "Instagram ↗", href: site.instagram, external: true },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-dirty/10 bg-obsidian text-dirty">
      <div className="px-gutter grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <p className="label text-concrete">Newsletter — The Side Letter</p>
          <p className="font-display mt-4 text-4xl md:text-5xl">Drops land here first.</p>
          <NewsletterForm />
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-6 md:col-start-7">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="label mb-4 text-concrete">{g.title}</p>
              <ul className="space-y-2.5 text-sm">
                {g.links.map((l) => (
                  <li key={l.href}>
                    {"external" in l && l.external ? (
                      <a href={l.href} target="_blank" rel="noreferrer" className="link-underline text-dirty/80 hover:text-dirty">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="link-underline text-dirty/80 hover:text-dirty">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="px-gutter label flex flex-col gap-3 border-t border-dirty/10 pb-16 pt-6 text-concrete md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Logo className="text-xl text-dirty" />
          <span>© {new Date().getFullYear()} 22SIDE — {site.positioning}</span>
          <ReplayIntro className="link-underline text-dirty hover:text-blood-bright" />
        </div>
        <span className="max-w-xl text-[0.6rem] leading-relaxed md:text-right">{site.demoNotice}</span>
      </div>
    </footer>
  );
}
