'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#portfolio', label: 'Films' },
  { href: '#services', label: 'Services' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      const sections = navLinks.map(link => link.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(sections[i])
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href: string) => {
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setIsMobileOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? 'bg-background/70 backdrop-blur-2xl border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollTo('#home') }}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-[#ffb005]/40 group-hover:border-[#ffb005] transition-colors duration-300">
              <span className="text-[#ffb005] font-bold text-sm sm:text-base tracking-wider">AR</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-foreground font-semibold tracking-[0.2em] text-xs uppercase">
                Alex Rivera
              </span>
              <span className="block text-[10px] text-[#ffb005] tracking-[0.3em] uppercase">Documentary</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`relative px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-300 ${
                  activeSection === link.href.slice(1)
                    ? 'text-[#ffb005]'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <motion.div
                    layoutId="activeNavDoc"
                    className="absolute bottom-0 left-4 right-4 h-px bg-[#ffb005]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <Button
              onClick={() => scrollTo('#contact')}
              className="bg-[#ffb005] text-black hover:bg-[#ffb005]/90 text-[11px] uppercase tracking-[0.2em] font-semibold h-10 px-6 transition-all duration-300"
            >
              Start a Project
            </Button>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-foreground hover:text-[#ffb005] transition-colors"
            aria-label="Toggle navigation"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-border/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(link.href)}
                  className={`block w-full text-left px-4 py-3 text-sm uppercase tracking-[0.2em] font-medium transition-colors rounded-sm ${
                    activeSection === link.href.slice(1)
                      ? 'text-[#ffb005] bg-[#ffb005]/5'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
              <div className="pt-3">
                <Button
                  onClick={() => scrollTo('#contact')}
                  className="w-full bg-[#ffb005] text-black hover:bg-[#ffb005]/90 text-[11px] uppercase tracking-[0.2em] font-semibold h-11"
                >
                  Start a Project
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
