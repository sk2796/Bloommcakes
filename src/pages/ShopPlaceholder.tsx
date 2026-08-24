import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCakes } from '@/features/products/hooks/useCakes'
import { CakeCategory } from '@/features/products/types'

const CATEGORIES: { value: CakeCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Delights' },
  { value: 'cakes', label: 'Cakes' },
  { value: 'muffins', label: 'Muffins' },
  { value: 'pastries', label: 'Pastries' },
  { value: 'cupcakes', label: 'Cupcakes' },
  { value: 'brownies', label: 'Brownies' },
  { value: 'fruit-pies', label: 'Fruit Pies' },
  { value: 'cookies', label: 'Cookies' }
]

export default function ShopPlaceholder() {
  const { data: cakes, isLoading, isError } = useCakes()
  const [activeCategory, setActiveCategory] = useState<CakeCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating')

  if (isLoading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-desktop py-24 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-on-surface-variant font-medium">Baking our menu fresh for you...</p>
      </div>
    )
  }

  if (isError || !cakes) {
    return (
      <div className="max-w-container-max mx-auto px-margin-desktop py-24 text-center">
        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
        <h3 className="text-xl font-bold mb-2">Oops! Failed to load cakes</h3>
        <p className="text-on-surface-variant">Please check your network and try again.</p>
      </div>
    )
  }

  // Filter and sort items (Simplified to exclude eggless toggles since all products are eggless)
  const filteredCakes = cakes
    .filter((cake) => {
      const matchesCategory = activeCategory === 'all' || cake.category === activeCategory
      const matchesSearch = cake.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            cake.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return b.rating - a.rating // default rating sort
    })

  return (
    <div className="max-w-container-max mx-auto px-margin-desktop py-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="font-headline-xl text-headline-xl text-primary mb-3">Our Menu</h2>
        <p className="text-on-surface-variant font-body-lg">
          Browse through our signature collection of handcrafted cakes. Freshly baked, premium ingredients, custom configurations.
        </p>
        <div className="flex items-center justify-center gap-2 text-primary mt-4">
          <div className="h-px w-12 bg-primary/30"></div>
          <span className="material-symbols-outlined text-sm">favorite</span>
          <div className="h-px w-12 bg-primary/30"></div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col gap-6 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
            <input
              type="text"
              placeholder="Search cakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
            />
          </div>

          {/* Sort selection */}
          <div className="flex flex-wrap gap-4 items-center justify-end w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'price-asc' | 'price-desc')}
              className="px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-full text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="rating">Sort by Rating</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2 border-t border-outline-variant/20 pt-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat.value
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {filteredCakes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCakes.map((cake) => (
            <div
              key={cake.id}
              className="bg-surface-container-lowest rounded-2xl p-4 soft-shadow hover:shadow-lg transition-all duration-300 group border border-outline-variant/10 flex flex-col justify-between"
            >
              <div>
                <Link to={`/product/${cake.slug}`} className="aspect-square rounded-xl overflow-hidden mb-4 bg-surface-container flex items-center justify-center p-4 relative block">
                  {cake.isBestseller && (
                    <span className="absolute top-4 right-4 bg-primary text-on-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider z-10">
                      Bestseller
                    </span>
                  )}
                  <img
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                    alt={cake.name}
                    src={cake.imageUrl}
                  />
                </Link>
                <div className="flex items-center gap-1.5 mb-1.5 justify-center">
                  <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-xs font-bold text-on-surface">{cake.rating}</span>
                </div>
                <Link to={`/product/${cake.slug}`} className="font-label-md text-label-md text-on-surface text-center mb-1 group-hover:text-primary transition-colors block font-semibold">{cake.name}</Link>
                <p className="text-xs text-on-surface-variant text-center line-clamp-2 px-2 mb-4 leading-relaxed">{cake.description}</p>
              </div>
              <div className="border-t border-outline-variant/10 pt-4 flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Starting at</span>
                  <span className="text-primary font-bold text-lg">₹{cake.price}</span>
                </div>
                <Link to={`/product/${cake.slug}`} className="bg-primary text-on-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-on-primary-fixed-variant transition-colors shadow-sm text-center">
                  Configure
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30">
          <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-4">search_off</span>
          <h3 className="text-lg font-bold mb-1">No cakes found</h3>
          <p className="text-on-surface-variant text-sm">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  )
}
