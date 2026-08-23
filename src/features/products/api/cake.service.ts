import { CakeProduct } from '../types'

// Mock premium cakes database entries matching trust specifications with weight pricing
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
    isEggless: true,
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
    isEggless: true,
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
    isEggless: true,
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
    isEggless: true,
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
    isEggless: true,
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
    isEggless: true,
    weightOptions: ['0.5kg', '1kg', '2kg']
  }
]

export class CakeService {
  static async getCakes(): Promise<CakeProduct[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CAKES)
      }, 200)
    })
  }

  static async getCakeBySlug(slug: string): Promise<CakeProduct | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cake = MOCK_CAKES.find(c => c.slug === slug)
        resolve(cake || null)
      }, 200)
    })
  }
}
