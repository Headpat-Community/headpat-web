import { createSessionServerClient } from "@/app/appwrite-session"
import type { UserDataDocumentsType, UserDataType } from "@/utils/types/models"
import { NextResponse } from "next/server"

// Cache sitemap for 10 minutes to lower memory/CPU pressure on bursts
export async function GET() {
  try {
    const { databases } = await createSessionServerClient()

    const users: UserDataType = await databases.listRows({
      databaseId: "hp_db",
      tableId: "userdata",
    })

    const productsMapping = users.rows.map((user: UserDataDocumentsType) => ({
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/user/${user.profileUrl}`,
      lastModified: user.$updatedAt,
      changeFrequency: "weekly",
      priority: 0.5,
    }))

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`

    const currentYear = new Date().getFullYear()

    const mappings = [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}`,
        lastModified: currentYear + "-01-01T00:00:00.000+00:00",
        changeFrequency: "yearly",
        priority: 1,
      },
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/gallery`,
        lastModified: currentYear + "-01-01T00:00:00.000+00:00",
        changeFrequency: "yearly",
        priority: 1,
      },
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/users`,
        lastModified: currentYear + "-01-01T00:00:00.000+00:00",
        changeFrequency: "yearly",
        priority: 1,
      },
      ...productsMapping,
    ]

    for (const mapping of mappings as any) {
      sitemap += "<url>\n"
      sitemap += `<loc>${mapping.url}</loc>\n`
      if (mapping["news"]) {
        sitemap += "<news:news>\n"
        sitemap += "<news:publication>\n"
        sitemap += `<news:name>${mapping["news"].publication.name}</news:name>\n`
        sitemap += `<news:language>${mapping["news"].publication.language}</news:language>\n`
        sitemap += "</news:publication>\n"
        sitemap += `<news:publication_date>${mapping["news"].publication_date}</news:publication_date>\n`
        sitemap += `<news:title>${mapping["news"].title}</news:title>\n`
        sitemap += "</news:news>\n"
      }
      sitemap += `<lastmod>${mapping.lastModified}</lastmod>\n`
      sitemap += `<changefreq>${mapping.changeFrequency}</changefreq>\n`
      sitemap += `<priority>${mapping.priority}</priority>\n`
      sitemap += "</url>\n"
    }

    sitemap += "</urlset>"

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
        "Cache-Control":
          "public, max-age=0, s-maxage=600, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Sitemap generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate sitemap" },
      { status: 500 }
    )
  }
}
