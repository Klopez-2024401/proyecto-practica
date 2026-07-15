import { Navbar } from '../../../shared/components/layout/Navbar.jsx'
import { Footer } from '../../../shared/components/layout/Footer.jsx'
import { HeroSection } from '../components/HeroSection.jsx'
import { DashboardMockup } from '../components/DashboardMockup.jsx'
import { FeaturesSection } from '../components/FeaturesSection.jsx'

export const HomePage = () => {
  return (
    <div className="bg-dot-grid min-h-screen bg-surface selection:bg-primary/10 selection:text-primary">
      {/* Shared Header Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="relative overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32">
        {/* Glow decorative blurs */}
        <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-secondary/5 blur-3xl" />

        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Feature Local Components */}
            <HeroSection />
            <DashboardMockup />
          </div>
        </div>
      </main>

      {/* Feature local Features details grid */}
      <FeaturesSection />

      {/* Shared Footer */}
      <Footer />
    </div>
  )
}
