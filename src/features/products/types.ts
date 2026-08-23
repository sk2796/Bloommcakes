export type CakeCategory = 'all' | 'chocolate' | 'cheesecakes' | 'classics' | 'fruit'

export interface CakeProduct {
  id: string
  name: string
  slug: string
  description: string
  price: number
  rating: number
  category: CakeCategory
  imageUrl: string
  isEggless: boolean
  isBestseller?: boolean
  weightOptions: string[]
}
