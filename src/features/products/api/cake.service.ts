import Papa from 'papaparse'
import { CakeProduct, CakeCategory } from '../types'

// Published Google Sheet CSV export link
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT5K76hN4tP8Wv7qZ1z2wZl7z_QGfW3v2qXw29w380zGvP4tZ8P6Xw29w380zGvP4tZ8P6Xw29w380z/pub?output=csv'

// Backup offline catalog in case of networking issues
export const MOCK_CAKES: CakeProduct[] = [
  {
    id: 'c1',
    name: 'Belgian Chocolate',
    slug: 'belgian-chocolate',
    description: 'A rich, decadent Belgian Chocolate cake, beautifully decorated with chocolate shards and a smooth chocolate ganache drip.',
    price: 799,
    priceByWeight: {
      '0.5kg': 799,
      '1kg': 1499,
      '2kg': 2899
    },
    rating: 4.9,
    category: 'chocolate',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApZkJY6QschRPOB3x6-l8poxgy8aQmmu6tGSdCweuEr9GNxx80MjOyL-V6aPDgzTXkEnt9bEzdyvHM3ga5_WHNlz99MLqqUyBTHztAdF_idQhxFek4LpY-SmLqxAfqyqVxVny-1zqHSV2-gzfj4fTrvflbGADllc3ezN69kDBRlwKBGK0zMgF6JYbTMKgXCd5-z5NpSN_aixjKyGNho7lOOpf1I9w80b4lx0UvbJtdmE8ScIVfKKtY',
    isBestseller: true,
    weightOptions: ['0.5kg', '1kg', '2kg']
  },
  {
    id: 'c2',
    name: 'Red Velvet Supreme',
    slug: 'red-velvet-supreme',
    description: 'A classic Red Velvet cake with perfectly smooth white cream cheese frosting, elegantly piped borders, and a sprinkle of red velvet crumbs.',
    price: 899,
    priceByWeight: {
      '0.5kg': 899,
      '1kg': 1699
    },
    rating: 4.8,
    category: 'classics',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRETRfPtfP-bA2VzWu7WPbBxbhNYY76Q1TcRPWK3-1uePZp3K7FTHbOseYXPGLtmZMnkanxiOD87rQA0RemZpgdYi97UuWcAQMXFt69fXeVf0vwG8PPIGcen0XTGcLPdyxQsTr0FEBRrLj8ol-Pb2sUfyZqju1v2Mp6HABFVwkXaygqIU4QCIwkGa1fet73QovnbVHj1zVI7GYgAx88F8cSF66dqKjwCzVW-meuvpmB1AhE_l5joSO',
    isBestseller: true,
    weightOptions: ['0.5kg', '1kg']
  },
  {
    id: 'c3',
    name: 'Butterscotch Crunch',
    slug: 'butterscotch-crunch',
    description: 'An exquisite Butterscotch Crunch cake featuring layers of moist cake, rich butterscotch sauce, and generous crunchy praline pieces.',
    price: 749,
    priceByWeight: {
      '0.5kg': 749,
      '1kg': 1399,
      '1.5kg': 1999
    },
    rating: 4.7,
    category: 'classics',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5SWy7Qb6lqjOSFNcx6Uwk_csTMEYN27Hz5UU6BNCYyyP9eRfO32aVA4mxwePVyXvwEL-KL-BieXmP_yx0xe2RKPhqF1PmkdNxqao4CSfuXuzomKbfs4i2FeC4wLa-eD7NcOD3iocw8XrmDUWJPumldtnptojchgKRsQOcKdNco4gjtJl2U3cg0kzrQBZi46c-wgkJWwY_spYT3BBCzCrSaXlni_8cKqA0UkGyD1np9xUDfGYhIwbE',
    weightOptions: ['0.5kg', '1kg', '1.5kg']
  },
  {
    id: 'c4',
    name: 'Blueberry Cheesecake',
    slug: 'blueberry-cheesecake',
    description: 'A visually stunning Blueberry Cheesecake with a perfect graham cracker crust, a creamy baked filling, and a glossy, deep purple blueberry compote.',
    price: 999,
    priceByWeight: {
      '0.5kg': 999,
      '1kg': 1899
    },
    rating: 4.9,
    category: 'cheesecakes',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdx960xx5hnckATCpxOit7JMiNmp3wfnsQCXlJK3sCQDEdDETTHq7li5kRsBZwgyE7xa0TNAGJFZTehhmbUVjEySFFC6lmT6nxjwpNxoGrRaTAnx4j9PJLIhvyiIPVpOGUdTtLUF7yFFCDH_4-V8AETSibCU4NLfEUbPRI7ls0Z8T_9FTeeXtHuUhivZDLAWikMSltarpEgZApbhwkjhuUA1499xI1Wz4PjgaVyDEsPB6Wd81lC_Mh',
    isBestseller: true,
    weightOptions: ['0.5kg', '1kg']
  },
  {
    id: 'c5',
    name: 'Fresh Mango Cream',
    slug: 'fresh-mango-cream',
    description: 'Seasonal golden mango slices layered with premium fresh whipped cream and soft light vanilla chiffon sponge cake.',
    price: 849,
    priceByWeight: {
      '0.5kg': 849,
      '1kg': 1599
    },
    rating: 4.6,
    category: 'fruit',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    weightOptions: ['0.5kg', '1kg']
  },
  {
    id: 'c6',
    name: 'Dark Chocolate Truffle',
    slug: 'dark-chocolate-truffle',
    description: 'Double chocolate sponge layered with bittersweet 70% dark chocolate ganache, finished with artisan cocoa glaze.',
    price: 899,
    priceByWeight: {
      '0.5kg': 899,
      '1kg': 1699,
      '2kg': 3199
    },
    rating: 4.9,
    category: 'chocolate',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
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
      // Fetch dynamic sheet data
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

                let parsedPriceByWeight: Record<string, number> = {
                  '0.5kg': Number(csvRow.price) || 799,
                  '1kg': (Number(csvRow.price) || 799) * 2 - 99
                }
                if (csvRow.priceByWeight) {
                  try {
                    parsedPriceByWeight = JSON.parse(csvRow.priceByWeight.trim())
                  } catch (err) {
                    console.warn('Failed parsing priceByWeight column:', csvRow.priceByWeight, err)
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
                  category: (csvRow.category || 'classics') as CakeCategory,
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
