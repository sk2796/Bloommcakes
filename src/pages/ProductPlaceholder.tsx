import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCakeDetail } from '@/features/products/hooks/useCakeDetail'
import { useCakes } from '@/features/products/hooks/useCakes'

export default function ProductPlaceholder() {
  const { slug } = useParams<{ slug: string }>()
  const { data: cake, isLoading, isError } = useCakeDetail(slug || '')
  const { data: allCakes } = useCakes()
  
  const [selectedWeight, setSelectedWeight] = useState<string>('')
  const [isEggless, setIsEggless] = useState<boolean>(true)
  const [quantity, setQuantity] = useState<number>(1)

  // Reset page parameters when routing to a new product details slug using set timeout to escape cascading renders rule
  useEffect(() => {
    if (cake) {
      const timer = setTimeout(() => {
        setSelectedWeight(cake.weightOptions[0] || '')
        setQuantity(1)
        setIsEggless(cake.isEggless)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [cake])

  if (isLoading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-desktop py-24 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-on-surface-variant font-medium">Preparing cake details...</p>
      </div>
    )
  }

  if (isError || !cake) {
    return (
      <div className="max-w-container-max mx-auto px-margin-desktop py-24 text-center">
        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
        <h3 className="text-xl font-bold mb-2">Cake not found</h3>
        <p className="text-on-surface-variant mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-md text-label-md">
          Back to Menu
        </Link>
      </div>
    )
  }

  // Calculate dynamic price based on selection
  const currentPrice = cake.priceByWeight[selectedWeight] || cake.price
  const totalPrice = currentPrice * quantity

  // Filter recommendations (other cakes excluding the active selection, max 3)
  const suggestions = allCakes
    ? allCakes.filter(item => item.id !== cake.id).slice(0, 3)
    : []

  return (
    <div className="max-w-container-max mx-auto px-margin-desktop py-12 animate-fade-in">
      {/* Breadcrumb path navigation */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-8 text-left">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to="/shop" className="hover:text-primary transition-colors">Menu</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-primary">{cake.name}</span>
      </div>

      {/* Main split details panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
        {/* Product Image Section */}
        <div className="relative aspect-square w-full max-w-lg mx-auto bg-surface-container rounded-3xl overflow-hidden p-6 soft-shadow border border-outline-variant/10">
          <img
            src={cake.imageUrl}
            alt={cake.name}
            className="w-full h-full object-cover rounded-2xl"
          />
          {cake.isBestseller && (
            <span className="absolute top-8 right-8 bg-primary text-on-primary text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider z-10">
              Bestseller
            </span>
          )}
        </div>

        {/* Product Configuration panel */}
        <div className="flex flex-col gap-6 text-left max-w-xl mx-auto lg:mx-0">
          <div>
            <h2 className="font-headline-xl text-headline-xl text-primary leading-tight mb-2">
              {cake.name}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-sm font-bold text-on-surface">{cake.rating}</span>
              </div>
              <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider bg-cream-dark px-3 py-1 rounded-full">
                {cake.category}
              </span>
            </div>
          </div>

          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed pb-4 border-b border-outline-variant/20">
            {cake.description}
          </p>

          {/* Configuration Forms */}
          <div className="flex flex-col gap-6 py-2">
            {/* Weight Options */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-chocolate uppercase tracking-wider block">
                Select Weight (Price updates dynamically)
              </span>
              <div className="flex flex-wrap gap-3">
                {cake.weightOptions.map((weight) => (
                  <button
                    key={weight}
                    onClick={() => setSelectedWeight(weight)}
                    className={`px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all border ${
                      selectedWeight === weight
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-low'
                    }`}
                  >
                    {weight} — ₹{cake.priceByWeight[weight] || cake.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Dietary option (Eggless Selector) */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-chocolate uppercase tracking-wider block">
                Dietary Preference
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/30 px-5 py-3 rounded-xl cursor-pointer select-none">
                  <input
                    type="radio"
                    name="eggPreference"
                    checked={isEggless}
                    onChange={() => setIsEggless(true)}
                    className="w-4 h-4 text-primary focus:ring-primary border-outline-variant/50 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-on-surface">100% Eggless</span>
                </label>
                <label className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/30 px-5 py-3 rounded-xl cursor-pointer select-none">
                  <input
                    type="radio"
                    name="eggPreference"
                    checked={!isEggless}
                    onChange={() => setIsEggless(false)}
                    className="w-4 h-4 text-primary focus:ring-primary border-outline-variant/50 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-on-surface">Contains Egg</span>
                </label>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex flex-col sm:flex-row gap-6 items-center border-t border-outline-variant/20 pt-6 mt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-chocolate uppercase tracking-wider">Qty</span>
                <div className="flex items-center border border-outline-variant/40 rounded-full overflow-hidden bg-surface-container-lowest shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-surface-container-low text-on-surface font-bold text-lg leading-none"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-sm select-none min-w-[40px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-surface-container-low text-on-surface font-bold text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Dynamic Price Display & Cart Button */}
              <div className="flex-1 flex items-center justify-between gap-6 w-full">
                <div className="flex flex-col">
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider">Total Price</span>
                  <span className="text-primary font-bold text-2xl">₹{totalPrice}</span>
                </div>
                <button className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-md flex-1 text-center font-bold">
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Products Shelf */}
      {suggestions.length > 0 && (
        <div className="border-t border-outline-variant/20 pt-16 text-left">
          <div className="flex flex-col gap-2 mb-8">
            <span className="font-headline-md text-headline-md text-primary font-bold">Recommended For You</span>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">You may also love these fresh delicacies</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {suggestions.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-2xl p-4 soft-shadow hover:shadow-lg transition-all duration-300 group border border-outline-variant/10 flex flex-col justify-between"
              >
                <div>
                  <Link to={`/product/${item.slug}`} className="aspect-square rounded-xl overflow-hidden mb-4 bg-surface-container flex items-center justify-center p-4 relative block">
                    {item.isBestseller && (
                      <span className="absolute top-4 right-4 bg-primary text-on-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider z-10">
                        Bestseller
                      </span>
                    )}
                    {item.isEggless && (
                      <span className="absolute top-4 left-4 bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider z-10 border border-green-200">
                        Eggless
                      </span>
                    )}
                    <img
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                      alt={item.name}
                      src={item.imageUrl}
                    />
                  </Link>
                  <div className="flex items-center gap-1.5 mb-1.5 justify-center">
                    <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-xs font-bold text-on-surface">{item.rating}</span>
                  </div>
                  <Link to={`/product/${item.slug}`} className="font-label-md text-label-md text-on-surface text-center mb-1 group-hover:text-primary transition-colors block font-semibold">{item.name}</Link>
                  <p className="text-xs text-on-surface-variant text-center line-clamp-2 px-2 mb-4 leading-relaxed">{item.description}</p>
                </div>
                <div className="border-t border-outline-variant/10 pt-4 flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Starting at</span>
                    <span className="text-primary font-bold text-lg">₹{item.price}</span>
                  </div>
                  <Link to={`/product/${item.slug}`} className="bg-primary text-on-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-on-primary-fixed-variant transition-colors shadow-sm text-center">
                    Configure
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
