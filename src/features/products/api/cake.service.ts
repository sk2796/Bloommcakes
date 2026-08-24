import { CakeProduct } from '../types'

// Mock premium cakes database entries matching trust specifications with weight pricing
export const MOCK_CAKES: CakeProduct[] = [
  // Cakes Category
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
  },
  {
    id: 'c2',
    name: 'Red Velvet Supreme Cake',
    slug: 'red-velvet-supreme',
    description: 'A classic Red Velvet cake with perfectly smooth white cream cheese frosting, elegantly piped borders, and a sprinkle of red velvet crumbs.',
    price: 899,
    priceByWeight: {
      '0.5kg': 899,
      '1kg': 1699
    },
    rating: 4.8,
    category: 'cakes',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRETRfPtfP-bA2VzWu7WPbBxbhNYY76Q1TcRPWK3-1uePZp3K7FTHbOseYXPGLtmZMnkanxiOD87rQA0RemZpgdYi97UuWcAQMXFt69fXeVf0vwG8PPIGcen0XTGcLPdyxQsTr0FEBRrLj8ol-Pb2sUfyZqju1v2Mp6HABFVwkXaygqIU4QCIwkGa1fet73QovnbVHj1zVI7GYgAx88F8cSF66dqKjwCzVW-meuvpmB1AhE_l5joSO',
    isBestseller: true,
    weightOptions: ['0.5kg', '1kg']
  },
  {
    id: 'c3',
    name: 'Butterscotch Crunch Cake',
    slug: 'butterscotch-crunch',
    description: 'An exquisite Butterscotch Crunch cake featuring layers of moist cake, rich butterscotch sauce, and generous crunchy praline pieces.',
    price: 749,
    priceByWeight: {
      '0.5kg': 749,
      '1kg': 1399,
      '1.5kg': 1999
    },
    rating: 4.7,
    category: 'cakes',
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
    category: 'cakes',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdx960xx5hnckATCpxOit7JMiNmp3wfnsQCXlJK3sCQDEdDETTHq7li5kRsBZwgyE7xa0TNAGJFZTehhmbUVjEySFFC6lmT6nxjwpNxoGrRaTAnx4j9PJLIhvyiIPVpOGUdTtLUF7yFFCDH_4-V8AETSibCU4NLfEUbPRI7ls0Z8T_9FTeeXtHuUhivZDLAWikMSltarpEgZApbhwkjhuUA1499xI1Wz4PjgaVyDEsPB6Wd81lC_Mh',
    isBestseller: true,
    weightOptions: ['0.5kg', '1kg']
  },

  // Muffins Category
  {
    id: 'm1',
    name: 'Double Chocolate Muffin',
    slug: 'double-chocolate-muffin',
    description: 'Rich chocolate muffins loaded with premium dark chocolate chips and a soft, moist center.',
    price: 149,
    priceByWeight: {
      '1 pc': 149,
      'Pack of 4': 499
    },
    rating: 4.8,
    category: 'muffins',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    weightOptions: ['1 pc', 'Pack of 4']
  },
  {
    id: 'm2',
    name: 'Blueberry Streusel Muffin',
    slug: 'blueberry-streusel-muffin',
    description: 'Bursting with fresh blueberries and topped with a crunchy, sweet cinnamon streusel crumble.',
    price: 159,
    priceByWeight: {
      '1 pc': 159,
      'Pack of 4': 549
    },
    rating: 4.7,
    category: 'muffins',
    imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80',
    weightOptions: ['1 pc', 'Pack of 4']
  },

  // Pastries Category
  {
    id: 'p1',
    name: 'Chocolate Truffle Pastry Slice',
    slug: 'chocolate-truffle-pastry',
    description: 'A decadent slice of dark chocolate truffle cake layered with velvety cocoa ganache.',
    price: 120,
    priceByWeight: {
      '1 Slice': 120,
      '2 Slices': 220
    },
    rating: 4.9,
    category: 'pastries',
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
    weightOptions: ['1 Slice', '2 Slices']
  },

  // Cupcakes Category
  {
    id: 'cp1',
    name: 'Red Velvet Cupcake',
    slug: 'red-velvet-cupcake',
    description: 'Fluffy red velvet cupcake base topped with a smooth, swirl of cream cheese frosting.',
    price: 99,
    priceByWeight: {
      '1 pc': 99,
      'Box of 6': 499
    },
    rating: 4.8,
    category: 'cupcakes',
    imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80',
    weightOptions: ['1 pc', 'Box of 6']
  },

  // Brownies Category
  {
    id: 'b1',
    name: 'Fudgy Walnut Brownie',
    slug: 'fudgy-walnut-brownie',
    description: 'Decadent chocolate brownie with a cracked top crust, rich fudgy center, and crunch walnuts.',
    price: 129,
    priceByWeight: {
      '1 pc': 129,
      'Box of 4': 449
    },
    rating: 4.9,
    category: 'brownies',
    imageUrl: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=600&q=80',
    weightOptions: ['1 pc', 'Box of 4']
  },

  // Fruit Pies Category
  {
    id: 'fp1',
    name: 'Classic Apple Pie',
    slug: 'classic-apple-pie',
    description: 'Flaky pastry crust stuffed with warm spiced apples, cinnamon, and caramel glaze.',
    price: 699,
    priceByWeight: {
      'Whole Pie': 699
    },
    rating: 4.7,
    category: 'fruit-pies',
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80',
    weightOptions: ['Whole Pie']
  },

  // Cookies Category
  {
    id: 'ck1',
    name: 'Chocochip Cookies Pack',
    slug: 'chocochip-cookies-pack',
    description: 'Crispy edges with soft centers, loaded heavily with semi-sweet chocolate chunks.',
    price: 199,
    priceByWeight: {
      'Pack of 6': 199,
      'Pack of 12': 349
    },
    rating: 4.8,
    category: 'cookies',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
    weightOptions: ['Pack of 6', 'Pack of 12']
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
