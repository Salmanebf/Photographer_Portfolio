'use client'

import { useState } from 'react'
import Navigation from '@/components/navigation'
import Hero from '@/components/hero'
import About from '@/components/about'
import Portfolio from '@/components/portfolio'
import Services from '@/components/services'
import Testimonials from '@/components/testimonials'
import Contact from '@/components/contact'
import Footer from '@/components/footer'
import ProjectDetail from '@/components/project-detail'
import ScrollProgress from '@/components/scroll-progress'
import { DocumentaryProject } from '@/lib/data'

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<DocumentaryProject | null>(null)

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Navigation />
      <main className="flex-1">
        <Hero />
        <About />
        <Portfolio onSelectProject={setSelectedProject} />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ProjectDetail
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  )
}
