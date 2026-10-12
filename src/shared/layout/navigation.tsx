'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { dirOf } from '@/i18n/config'
import type { SiteSettings } from '@/shared/content/types'
import Magnetic from '@/shared/effects/magnetic'
import LanguageSwitcher from './language-switcher'

const navLinks = [
  { href: '#home', key: 'home' },
  { href: '#about', key: 'about' },
  { href: '#portfolio', key: 'projects' },
  { href: '#services', key: 'services' },
  { href: '#timeline', key: 'timeline' },
  { href: '#testimonials', key: 'testimonials' },
  { href: '#contact', key: 'contact' },
] as const

interface NavigationProps {
  settings: SiteSettings
}

export default function Navigation({ settings }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const router = useRouter()
  const t = useTranslations('nav')
  const rtl = dirOf(useLocale()) === 'rtl'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60)
      const sections = navLinks.map((l) => l.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 160) {
          setActiveSection(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href: string) => {
    const el = document.getElementById(href.slice(1))
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else router.push(`/${href}`) // not on the home page (e.g. a film page)
    setIsMobileOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-2xl border-b border-border/40'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <button
              onClick={() => scrollTo('#home')}
              className="flex items-center gap-3 group"
              aria-label={t('backToTop')}
            >
              <span className="w-8 h-8 flex items-center justify-center border border-gold/30 group-hover:border-gold transition-colors duration-500 relative overflow-hidden">
                {settings.brand.logoImage ? (
                  <Image
                    src={settings.brand.logoImage}
                    alt={settings.brand.name}
                    fill
                    sizes="32px"
                    className="object-contain p-1"
                  />
                ) : (
                  <span className="text-gold text-xs font-bold tracking-widest">
                    {settings.brand.logoMark}
                  </span>
                )}
              </span>
              <div className="hidden sm:block leading-none text-start">
                <div className="text-foreground text-[11px] font-semibold tracking-[0.25em] uppercase">
                  {settings.brand.name}
                </div>
                <div className="text-gold text-[9px] tracking-[0.4em] uppercase mt-0.5">
                  {settings.brand.discipline}
                </div>
              </div>
            </button>

            <nav className="hidden lg:flex items-center gap-0.5" aria-label={t('primary')}>
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  aria-current={activeSection === link.href.slice(1) ? 'true' : undefined}
                  className={`relative px-4 py-2 text-[10px] uppercase tracking-[0.25em] font-medium transition-colors duration-300 ${
                    activeSection === link.href.slice(1)
                      ? 'text-gold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t(link.key)}
                  {activeSection === link.href.slice(1) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 inset-x-4 h-px bg-gold"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            <Magnetic className="hidden xl:inline-block">
              <button
                onClick={() => scrollTo('#contact')}
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gold border border-gold/30 hover:border-gold hover:bg-gold hover:text-background px-5 py-2.5 transition-all duration-400"
                data-cursor="hover"
              >
                {t('collaborate')}
              </button>
            </Magnetic>

            <LanguageSwitcher className="hidden lg:flex" />

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 text-foreground hover:text-gold transition-colors"
              aria-label={isMobileOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: rtl ? '-100%' : '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: rtl ? '-100%' : '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-background flex flex-col justify-center px-8"
          >
            <nav className="space-y-1" aria-label={t('mobilePrimary')}>
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: rtl ? -40 : 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => scrollTo(link.href)}
                  className="flex items-baseline gap-4 w-full text-start py-4 border-b border-border/30 last:border-0 group"
                >
                  <span className="text-gold text-xs tracking-[0.3em] font-medium">
                    0{i + 1}
                  </span>
                  <span className="text-3xl font-bold text-foreground group-hover:text-gold transition-colors">
                    {t(link.key)}
                  </span>
                </motion.button>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <button
                onClick={() => scrollTo('#contact')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-background font-semibold text-xs uppercase tracking-[0.25em] hover:bg-gold/90 transition-colors"
              >
                {t('startProject')}
              </button>
              <LanguageSwitcher className="mt-8" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
