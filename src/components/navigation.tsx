'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#portfolio', label: 'Portfolio' },
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

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href: string) => {
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('#home')
            }}
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm bg-amber flex items-center justify-center">
              <span className="text-amber-foreground font-bold text-sm sm:text-lg">AR</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-foreground font-semibold tracking-wider text-sm uppercase">
                Alex Rivera
              </span>
            </div>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`relative px-4 py-2 text-xs uppercase tracking-widest font-medium transition-colors duration-300 ${
                  activeSection === link.href.slice(1)
                    ? 'text-amber'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-amber"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              onClick={() => scrollTo('#contact')}
              variant="outline"
              className="border-amber text-amber hover:bg-amber hover:text-amber-foreground text-xs uppercase tracking-widest font-medium transition-all duration-300"
            >
              Hire Me
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-foreground hover:text-amber transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(link.href)}
                  className={`block w-full text-left px-4 py-3 text-sm uppercase tracking-widest font-medium transition-colors rounded-md ${
                    activeSection === link.href.slice(1)
                      ? 'text-amber bg-amber/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
              <div className="pt-2">
                <Button
                  onClick={() => scrollTo('#contact')}
                  className="w-full border-amber text-amber hover:bg-amber hover:text-amber-foreground text-xs uppercase tracking-widest font-medium"
                  variant="outline"
                >
                  Hire Me
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
