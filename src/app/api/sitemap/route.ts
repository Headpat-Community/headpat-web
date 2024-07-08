import { NextResponse } from 'next/server'
import { UserData } from '@/utils/types/models'
import { createSessionServerClient } from '@/app/appwrite-session'
import { Query } from 'node-appwrite'

export const runtime = 'edge'

export async function GET() {
  const { databases } = await createSessionServerClient()
  try {
    const users: UserData.UserDataType = await databases.listDocuments(
      'hp_db',
      'userdata'
    )

    const productsMapping = users.documents.map(
      (user: UserData.UserDataDocumentsType) => ({
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/user/${user.profileUrl}`,
        lastModified: user.$updatedAt,
        changeFrequency: 'weekly',
        priority: 0.5,
      })
    )

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`

    let currentYear = new Date().getFullYear()

    const mappings = [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}`,
        lastModified: currentYear + '-01-01T00:00:00.000+00:00',
        changeFrequency: 'yearly',
        priority: 1,
      },
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/gallery`,
        lastModified: currentYear + '-01-01T00:00:00.000+00:00',
        changeFrequency: 'yearly',
        priority: 1,
      },
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/pawcraft`,
        lastModified: currentYear + '-01-01T00:00:00.000+00:00',
        changeFrequency: 'yearly',
        priority: 1,
      },
      ...productsMapping,
    ]

    for (let mapping of mappings) {
      sitemap += '<url>\n'
      sitemap += `<loc>${mapping.url}</loc>\n`
      if (mapping['news']) {
        sitemap += '<news:news>\n'
        sitemap += '<news:publication>\n'
        sitemap += `<news:name>${mapping['news'].publication.name}</news:name>\n`
        sitemap += `<news:language>${mapping['news'].publication.language}</news:language>\n`
        sitemap += '</news:publication>\n'
        sitemap += `<news:publication_date>${mapping['news'].publication_date}</news:publication_date>\n`
        sitemap += `<news:title>${mapping['news'].title}</news:title>\n`
        sitemap += '</news:news>\n'
      }
      sitemap += `<lastmod>${mapping.lastModified}</lastmod>\n`
      sitemap += `<changefreq>${mapping.changeFrequency}</changefreq>\n`
      sitemap += `<priority>${mapping.priority}</priority>\n`
      sitemap += '</url>\n'
    }

    sitemap += '</urlset>'

    return new NextResponse(sitemap, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    })
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 })
  }
}
