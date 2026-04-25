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
  const scrollTo = (href: string) => {
    const el = document.getElementById(href.slice(1))
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 flex items-center justify-center border border-[#ffb005]/40">
                <span className="text-[#ffb005] font-bold text-sm tracking-wider">AR</span>
              </div>
              <div>
                <span className="font-semibold tracking-[0.2em] text-xs uppercase text-foreground">Alex Rivera</span>
                <span className="block text-[10px] text-[#ffb005] tracking-[0.3em] uppercase">Documentary</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Award-winning documentary filmmaker telling stories that illuminate, inspire, and drive change.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#ffb005] font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
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

          {/* Newsletter */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#ffb005] font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Behind-the-scenes updates and new film releases.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 px-3 py-2 text-sm bg-muted/30 border border-border/50 focus:outline-none focus:border-[#ffb005] placeholder:text-muted-foreground/40"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#ffb005] text-black text-[10px] font-semibold uppercase tracking-[0.15em] hover:bg-[#ffb005]/90 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground">
            &copy; {new Date().getFullYear()} Alex Rivera Films. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-[#ffb005] transition-colors group"
          >
            Back to top
            <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  )
}
