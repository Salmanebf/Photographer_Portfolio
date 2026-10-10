import Navigation from '@/shared/layout/navigation'
import Hero from '@/features/hero/hero'
import About from '@/features/about/about'
import Portfolio from '@/features/films/portfolio'
import Services from '@/features/services/services'
import Testimonials from '@/features/testimonials/testimonials'
import Contact from '@/features/contact/ui/contact'
import Footer from '@/shared/layout/footer'
import ScrollProgress from '@/shared/effects/scroll-progress'
import CustomCursor from '@/shared/effects/custom-cursor'
import AwardsMarquee from '@/features/awards/awards-marquee'
import {
  getSiteSettings,
  getProjects,
  getServices,
  getTestimonials,
} from '@/lib/queries'

export const revalidate = 60

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
      <CustomCursor />
      <Navigation settings={settings} />
      <main id="main" className="flex-1">
        <Hero settings={settings} />
        <About settings={settings} />
        <AwardsMarquee />
        <Portfolio projects={projects} />
        <Services services={services} />
        <Testimonials testimonials={testimonials} />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
    </div>
  )
}
