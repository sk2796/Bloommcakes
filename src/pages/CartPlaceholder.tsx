import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '@/features/cart/store/useCartStore'

export default function CartPlaceholder() {
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore()
  const navigate = useNavigate()
  
  const subtotal = getCartTotal()
  const shipping = subtotal > 1500 ? 0 : 99
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="max-w-container-max mx-auto px-margin-desktop py-24 text-center animate-fade-in">
        <span className="material-symbols-outlined text-on-surface-variant text-6xl mb-4">shopping_bag</span>
        <h2 className="text-2xl font-bold text-primary mb-2">Your Cart is Empty</h2>
        <p className="text-on-surface-variant mb-8 max-w-sm mx-auto">
          Add some delicious handcrafted artisanal cakes to start celebrating!
        </p>
        <Link to="/shop" className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-md">
          EXPLORE MENU
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-margin-desktop py-12 animate-fade-in text-left">
      <h2 className="font-headline-xl text-headline-xl text-primary font-bold mb-8">Your Cart</h2>

      {/* Cart Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left items list */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 flex gap-4 items-center justify-between shadow-sm"
            >
              {/* Product Image and Config details */}
              <div className="flex gap-4 items-center flex-1">
                <div className="w-20 h-20 bg-surface-container rounded-xl overflow-hidden flex-shrink-0 border border-outline-variant/20">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col text-left">
                  <h4 className="font-bold text-on-surface text-base hover:text-primary transition-colors">
                    <Link to={`/product/${item.slug}`}>{item.name}</Link>
                  </h4>
                  <div className="flex flex-wrap gap-2 items-center mt-1">
                    <span className="text-xs bg-surface-container-high px-2 py-0.5 rounded-full font-bold text-on-surface-variant">
                      {item.weight}
                    </span>
                    <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold border border-green-200">
                      100% Veg
                    </span>
                  </div>
                </div>
              </div>

              {/* Price, Quantity, and Remove details */}
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-outline-variant/40 rounded-full bg-surface-container-low shadow-sm">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 hover:bg-surface-container-high text-on-surface font-bold text-base leading-none"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-bold text-xs select-none min-w-[28px] text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-surface-container-high text-on-surface font-bold text-base leading-none"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-col text-right min-w-[80px]">
                  <span className="text-primary font-bold text-base">₹{item.price * item.quantity}</span>
                  <span className="text-[10px] text-on-surface-variant">₹{item.price} each</span>
                </div>

                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-on-surface-variant hover:text-red-500 p-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right order summary card sidebar */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-md flex flex-col gap-6 text-on-surface">
          <h3 className="font-bold text-lg border-b border-outline-variant/20 pb-3">Order Summary</h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Bag Subtotal</span>
              <span className="font-bold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Shipping &amp; Delivery</span>
              <span className="font-bold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-[10px] text-on-surface-variant bg-surface-container-low p-2 rounded border border-outline-variant/10 text-center">
                Add ₹{1500 - subtotal} more for **FREE Delivery**!
              </p>
            )}
            <div className="border-t border-outline-variant/20 pt-3 mt-1 flex justify-between text-base font-bold">
              <span>Total amount</span>
              <span className="text-primary text-lg">₹{total}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-primary text-on-primary py-3.5 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-md font-bold text-center"
          >
            PROCEED TO CHECKOUT
          </button>
          
          <Link to="/shop" className="text-xs text-on-surface-variant hover:text-primary font-bold text-center uppercase tracking-wider block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
