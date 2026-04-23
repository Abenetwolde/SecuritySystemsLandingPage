import { HeroSection } from '@/components/home/HeroSection'
import { ProductSections } from '@/components/home/ProductSections'
import { BlogSection } from '@/components/home/BlogSection'
import { FeedbackSection } from '@/components/home/FeedbackSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductSections />
      <BlogSection />
      <FeedbackSection />
    </>
  )
}
