export interface Brand {
  _id: string
  name: string
  slug: string
  logoUrl?: string
  country?: string
  description?: string
  websiteUrl?: string
}

export type BrandLite = Pick<Brand, '_id' | 'name' | 'slug' | 'logoUrl'>