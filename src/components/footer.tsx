'use client'

import { ArrowUp } from 'lucide-react'
import Image from 'next/image'
import type { SiteSettings } from '@/lib/queries'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Films', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

interface FooterProps {
  settings: SiteSettings
}

export default function Footer({ settings }: FooterProps) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const scrollTo = (href: string) =>
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })

  const socials = settings.contact.socials
  const hasSocials = Object.values(socials).some(Boolean)

  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 flex items-center justify-center border border-gold/30 relative overflow-hidden">
                {settings.brand.logoImage ? (
                  <Image
                    src={settings.brand.logoImage}
                    alt={settings.brand.name}
                    fill
                    sizes="32px"
                    className="object-contain p-1"
                  />
                ) : (
                  <span className="text-gold font-bold text-xs tracking-widest">
                    {settings.brand.logoMark}
                  </span>
                )}
              </div>
              <div className="leading-none">
                <div className="text-foreground text-[11px] font-semibold tracking-[0.25em] uppercase">
                  {settings.brand.name}
                </div>
                <div className="text-gold text-[9px] tracking-[0.4em] uppercase mt-0.5">
                  {settings.brand.discipline}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
              {settings.footer.tagline}
            </p>

            {hasSocials && (
              <div className="flex items-center gap-4 mt-5">
                {socials.instagram && (
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-gold transition-colors"
                  >
                    Instagram
                  </a>
                )}
                {socials.vimeo && (
                  <a
                    href={socials.vimeo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-gold transition-colors"
                  >
                    Vimeo
                  </a>
                )}
                {socials.letterboxd && (
                  <a
                    href={socials.letterboxd}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-gold transition-colors"
                  >
                    Letterboxd
                  </a>
                )}
                {socials.twitter && (
                  <a
                    href={socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-gold transition-colors"
                  >
                    Twitter
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-[9px] uppercase tracking-[0.4em] text-gold font-medium mb-5">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-xs text-muted-foreground hover:text-foreground hover-underline transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {settings.footer.newsletter.enabled && (
            <div>
              <h3 className="text-[9px] uppercase tracking-[0.4em] text-gold font-medium mb-5">
                {settings.footer.newsletter.headline}
              </h3>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                {settings.footer.newsletter.description}
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 px-3 py-2 text-xs bg-muted/20 border border-border/40 border-r-0 focus:outline-none focus:border-gold/50 placeholder:text-muted-foreground/30 transition-colors text-foreground"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold text-background text-[9px] font-bold uppercase tracking-[0.25em] hover:bg-gold/90 transition-colors shrink-0"
                >
                  Join
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="py-5 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground tracking-wide">
            © {new Date().getFullYear()} {settings.brand.name}. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-gold transition-colors group"
          >
            Back to top
            <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  )
}
