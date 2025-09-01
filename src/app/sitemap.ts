import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdminClient'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://openillust.com'

  // Static pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/popular`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/info/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/info/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/info/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/info/policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  try {
    // Get all visible illustrations
    const { data: illustrations } = await supabaseAdmin
      .from('illustrations')
      .select('id, created_at, updated_at')
      .eq('visible', true)
      .order('created_at', { ascending: false })

    if (illustrations) {
      const illustrationRoutes: MetadataRoute.Sitemap = illustrations.map((item) => ({
        url: `${baseUrl}/illustration/${item.id}`,
        lastModified: new Date(item.updated_at || item.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))

      routes.push(...illustrationRoutes)
    }

    // Get all categories
    const { data: categories } = await supabaseAdmin
      .from('categories')
      .select('id, name, updated_at')
      .eq('visible', true)

    if (categories) {
      const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
        url: `${baseUrl}/categories/${category.id}`,
        lastModified: new Date(category.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))

      routes.push(...categoryRoutes)
    }

    // Get all collections
    const { data: collections } = await supabaseAdmin
      .from('collections')
      .select('id, name, updated_at')
      .eq('visible', true)

    if (collections) {
      const collectionRoutes: MetadataRoute.Sitemap = collections.map((collection) => ({
        url: `${baseUrl}/collections/${collection.id}`,
        lastModified: new Date(collection.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))

      routes.push(...collectionRoutes)
    }

    // Get all tags
    const { data: tags } = await supabaseAdmin
      .from('tags')
      .select('name, updated_at')
      .eq('visible', true)

    if (tags) {
      const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
        url: `${baseUrl}/tags/${encodeURIComponent(tag.name)}`,
        lastModified: new Date(tag.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))

      routes.push(...tagRoutes)
    }

  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return routes
}