import Papa from 'papaparse'
import { CakeProduct, CakeCategory } from '../types'

// Sharing link based CSV export endpoint
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1RAZ5fhog6OtcBAXepYc57IYGLf-kz1-MUY87gj8vfEY/export?format=csv&gid=756144025'

export const MOCK_CAKES: CakeProduct[] = [
  {
    id: 'c1',
    name: 'Belgian Chocolate Cake',
    slug: 'belgian-chocolate',
    description: 'A rich, decadent Belgian Chocolate cake, beautifully decorated with chocolate shards and a smooth chocolate ganache drip.',
    price: 799,
    priceByWeight: {
      '0.5kg': 799,
      '1kg': 1499,
      '2kg': 2899
    },
    rating: 4.9,
    category: 'cakes',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApZkJY6QschRPOB3x6-l8poxgy8aQmmu6tGSdCweuEr9GNxx80MjOyL-V6aPDgzTXkEnt9bEzdyvHM3ga5_WHNlz99MLqqUyBTHztAdF_idQhxFek4LpY-SmLqxAfqyqVxVny-1zqHSV2-gzfj4fTrvflbGADllc3ezN69kDBRlwKBGK0zMgF6JYbTMKgXCd5-z5NpSN_aixjKyGNho7lOOpf1I9w80b4lx0UvbJtdmE8ScIVfKKtY',
    isBestseller: true,
    weightOptions: ['0.5kg', '1kg', '2kg']
  }
]

export class CakeService {
  static cachedProducts: CakeProduct[] | null = null

  static async getCakes(): Promise<CakeProduct[]> {
    if (this.cachedProducts) {
      return this.cachedProducts
    }

    try {
      const response = await fetch(GOOGLE_SHEET_CSV_URL)
      if (!response.ok) {
        throw new Error('Network error fetching sheet data.')
      }

      const csvText = await response.text()
      
      return new Promise<CakeProduct[]>((resolve) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const parsed = results.data.map((row: unknown) => {
                const csvRow = row as Record<string, string>
                let parsedWeights: string[] = ['0.5kg', '1kg']
                if (csvRow.weightOptions) {
                  parsedWeights = csvRow.weightOptions.split(',').map((w: string) => w.trim())
                }

                // Parse custom separator format: "0.5kg:799; 1kg:1499; 2kg:2899"
                let parsedPriceByWeight: Record<string, number> = {
                  '0.5kg': Number(csvRow.price) || 799,
                  '1kg': (Number(csvRow.price) || 799) * 2 - 99
                }
                if (csvRow.priceByWeight) {
                  const parts = csvRow.priceByWeight.split(';')
                  const tempObj: Record<string, number> = {}
                  parts.forEach(part => {
                    const match = part.trim().split(':')
                    if (match.length === 2) {
                      tempObj[match[0].trim()] = Number(match[1].trim())
                    }
                  })
                  if (Object.keys(tempObj).length > 0) {
                    parsedPriceByWeight = tempObj
                  }
                }

                return {
                  id: csvRow.id || `sheet-${Math.random()}`,
                  name: csvRow.name || 'Premium Cake',
                  slug: csvRow.slug || 'premium-cake',
                  description: csvRow.description || 'Artisan handmade fresh cake.',
                  price: Number(csvRow.price) || 799,
                  priceByWeight: parsedPriceByWeight,
                  rating: Number(csvRow.rating) || 4.8,
                  category: (csvRow.category || 'cakes') as CakeCategory,
                  imageUrl: csvRow.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
                  isBestseller: csvRow.isBestseller === 'TRUE' || csvRow.isBestseller === 'true',
                  weightOptions: parsedWeights
                }
              })
              
              if (parsed.length > 0) {
                this.cachedProducts = parsed
                resolve(parsed)
              } else {
                resolve(MOCK_CAKES)
              }
            } catch (err) {
              console.error('Error mapping sheet rows:', err)
              resolve(MOCK_CAKES)
            }
          },
          error: (err: Error) => {
            console.error('PapaParse error:', err)
            resolve(MOCK_CAKES)
          }
        })
      })
    } catch (err) {
      console.warn('Google Sheet fetch failed, falling back to local database.', err)
      return MOCK_CAKES
    }
  }

  static async getCakeBySlug(slug: string): Promise<CakeProduct | null> {
    const cakes = await this.getCakes()
    const cake = cakes.find(c => c.slug === slug)
    return cake || null
  }
}
