'use client'

import { ArrowUp } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Films', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const scrollTo = (href: string) =>
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 flex items-center justify-center border border-gold/30">
                <span className="text-gold font-bold text-xs tracking-widest">AR</span>
              </div>
              <div className="leading-none">
                <div className="text-foreground text-[11px] font-semibold tracking-[0.25em] uppercase">
                  Alex Rivera
                </div>
                <div className="text-gold text-[9px] tracking-[0.4em] uppercase mt-0.5">
                  Documentary
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
              Award-winning documentary filmmaker telling stories that illuminate, inspire,
              and drive change.
            </p>
          </div>

          {/* Navigation */}
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

          {/* Newsletter */}
          <div>
            <h3 className="text-[9px] uppercase tracking-[0.4em] text-gold font-medium mb-5">
              Stay Updated
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Behind-the-scenes updates and new film releases.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
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
        </div>

        {/* Bottom row */}
        <div className="py-5 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground tracking-wide">
            © {new Date().getFullYear()} Alex Rivera Films. All rights reserved.
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
