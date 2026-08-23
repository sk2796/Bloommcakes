import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCakeDetail } from '@/features/products/hooks/useCakeDetail'

export default function ProductPlaceholder() {
  const { slug } = useParams<{ slug: string }>()
  const { data: cake, isLoading, isError } = useCakeDetail(slug || '')
  const [selectedWeight, setSelectedWeight] = useState<string>('')
  const [isEggless, setIsEggless] = useState<boolean>(true)
  const [quantity, setQuantity] = useState<number>(1)

  // Initialize selected weight when cake data is loaded
  if (cake && !selectedWeight && cake.weightOptions.length > 0) {
    setSelectedWeight(cake.weightOptions[0])
  }

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

  return (
    <div className="max-w-container-max mx-auto px-margin-desktop py-12 animate-fade-in">
      {/* Breadcrumb path navigation */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-8">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to="/shop" className="hover:text-primary transition-colors">Menu</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-primary">{cake.name}</span>
      </div>

      {/* Main split details panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
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
    </div>
  )
}
