import { HeroSection } from '@/components/home/HeroSection'
import { ProductSections } from '@/components/home/ProductSections'
import { BlogSection } from '@/components/home/BlogSection'
import { FeedbackSection } from '@/components/home/FeedbackSection'
import { getHomepageData } from '@/lib/api'

export default async function HomePage() {
  const { products, settings, blogPosts } = await getHomepageData()

  return (
    <>
      <HeroSection products={products} settings={settings} />
      <ProductSections products={products} />
      <BlogSection posts={blogPosts} settings={settings} />
      <FeedbackSection settings={settings} />
    </>
  )
}
