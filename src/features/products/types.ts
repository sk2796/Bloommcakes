export type CakeCategory = 'all' | 'chocolate' | 'cheesecakes' | 'classics' | 'fruit'

export interface CakeProduct {
  id: string
  name: string
  slug: string
  description: string
  price: number // Base price for lowest weight
  priceByWeight: Record<string, number> // Map from weight string (e.g. '0.5kg') to explicit price
  rating: number
  category: CakeCategory
  imageUrl: string
  isBestseller?: boolean
  weightOptions: string[]
}
