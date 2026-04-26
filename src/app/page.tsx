import Navigation from '@/components/navigation'
import Hero from '@/components/hero'
import About from '@/components/about'
import Portfolio from '@/components/portfolio'
import Services from '@/components/services'
import Testimonials from '@/components/testimonials'
import Contact from '@/components/contact'
import Footer from '@/components/footer'
import ScrollProgress from '@/components/scroll-progress'
import Analytics from '@/components/analytics'
import {
  getSiteSettings,
  getProjects,
  getServices,
  getTestimonials,
} from '@/lib/queries'

export const revalidate = 60 // ISR — refresh data every minute

export default async function Home() {
  const [settings, projects, services, testimonials] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getServices(),
    getTestimonials(),
  ])

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning={true}>
      <ScrollProgress />
      <Navigation settings={settings} />
      <main id="main" className="flex-1">
        <Hero settings={settings} />
        <About settings={settings} />
        <Portfolio projects={projects} />
        <Services services={services} />
        <Testimonials testimonials={testimonials} />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
      <Analytics />
    </div>
  )
}
