'use client'

import Navigation from '@/components/navigation'
import Hero from '@/components/hero'
import About from '@/components/about'
import Portfolio from '@/components/portfolio'
import Services from '@/components/services'
import Testimonials from '@/components/testimonials'
import Contact from '@/components/contact'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <div className="section-divider max-w-7xl mx-auto" />
        <About />
        <div className="section-divider max-w-7xl mx-auto" />
        <Portfolio />
        <div className="section-divider max-w-7xl mx-auto" />
        <Services />
        <div className="section-divider max-w-7xl mx-auto" />
        <Testimonials />
        <div className="section-divider max-w-7xl mx-auto" />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
