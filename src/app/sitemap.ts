export default function sitemap() {
  return [
    {
      url: `https://headpat.place`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1
    },
    {
      url: `https://headpat.place/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `https://headpat.place/events`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `https://headpat.place/users`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `https://headpat.place/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    }
  ]
}
