'use client'

import { Instagram, Youtube, ArrowUp } from 'lucide-react'

const footerLinks = [
  {
    title: 'Navigation',
    links: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'Services', href: '#services' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Wedding Films', href: '#services' },
      { label: 'Commercial', href: '#services' },
      { label: 'Music Videos', href: '#services' },
      { label: 'Documentary', href: '#services' },
      { label: 'Aerial & Drone', href: '#services' },
    ],
  },
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollTo = (href: string) => {
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-sm bg-amber flex items-center justify-center">
                <span className="text-amber-foreground font-bold text-sm">AR</span>
              </div>
              <span className="font-semibold tracking-wider text-sm uppercase">
                Alex Rivera
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Award-winning cinematographer and visual storyteller crafting cinematic experiences that move hearts.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-amber hover:border-amber/30 transition-all duration-300"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-amber hover:border-amber/30 transition-all duration-300"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs uppercase tracking-[0.2em] text-amber font-semibold mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-amber font-semibold mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get behind-the-scenes content and updates on new projects.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 px-3 py-2 text-sm bg-muted/50 border border-border rounded-sm focus:outline-none focus:border-amber placeholder:text-muted-foreground/50"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-amber text-amber-foreground rounded-sm text-xs font-semibold uppercase tracking-wider hover:bg-amber/90 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Alex Rivera Films. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-amber transition-colors group"
          >
            Back to top
            <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  )
}
