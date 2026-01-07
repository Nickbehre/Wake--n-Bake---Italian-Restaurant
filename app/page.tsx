import HeroSection from '@/components/home/HeroSection'
import USPSection from '@/components/home/USPSection'
import StorySection from '@/components/home/StorySection'
import MenuSection from '@/components/home/MenuSection'
import ReviewsSection from '@/components/home/ReviewsSection'
import LocationSection from '@/components/home/LocationSection'
import CTASection from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <USPSection />
      <MenuSection />
      <ReviewsSection />
      <LocationSection />
      <CTASection />
    </>
  )
}
