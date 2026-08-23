import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/features/cart/store/useCartStore'

const PIN_CODES_DELIVERABLE = ['380001', '380009', '380015', '380054', '382481']

export default function CheckoutPlaceholder() {
  const { items, getCartTotal, clearCart } = useCartStore()

  const [pincode, setPincode] = useState('')
  const [pinChecked, setPinChecked] = useState(false)
  const [isDeliverable, setIsDeliverable] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    addressLine1: '',
    landmark: '',
    city: 'Ahmedabad', // default to Ahmedabad since we only deliver there
    date: '',
    timeSlot: '12 PM - 3 PM'
  })
  
  const [orderConfirmed, setOrderConfirmed] = useState(false)

  const subtotal = getCartTotal()
  const shipping = subtotal > 1500 ? 0 : 99
  const total = subtotal + shipping

  // Calculate today's date formatted as YYYY-MM-DD for min date constraints
  const getMinDate = () => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const checkPincode = () => {
    setPinChecked(true)
    if (PIN_CODES_DELIVERABLE.includes(pincode.trim())) {
      setIsDeliverable(true)
    } else {
      setIsDeliverable(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setOrderConfirmed(true)
    
    const fullAddress = `${formData.addressLine1}${formData.landmark ? `, Landmark: ${formData.landmark}` : ''}, ${formData.city} - ${pincode}`
    
    // Auto compile WhatsApp details on confirmation
    const text = `*New Order Details (BloomCakes)*\n\n` +
      `*Customer details:*\n` +
      `- Name: ${formData.name}\n` +
      `- Phone: ${formData.phone}\n` +
      `- Address: ${fullAddress}\n\n` +
      `*Order summary:*\n` +
      items.map(item => `  - ${item.name} (${item.weight}) x${item.quantity} = ₹${item.price * item.quantity}`).join('\n') +
      `\n\n*Total amount:* ₹${total}\n\n` +
      `*Delivery Schedule:*\n` +
      `- Date: ${formData.date}\n` +
      `- Slot: ${formData.timeSlot}`

    const encoded = encodeURIComponent(text)
    const whatsappUrl = `https://wa.me/918793058057?text=${encoded}`
    
    window.open(whatsappUrl, '_blank')
    clearCart()
  }

  const isFormValid = isDeliverable && 
    formData.name.trim() && 
    formData.phone.trim() && 
    formData.addressLine1.trim() && 
    formData.city.trim() && 
    formData.date

  if (orderConfirmed) {
    return (
      <div className="max-w-container-max mx-auto px-margin-desktop py-24 text-center animate-fade-in">
        <span className="material-symbols-outlined text-green-500 text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <h2 className="text-3xl font-bold text-primary mb-3">Order Confirmed!</h2>
        <p className="text-on-surface-variant max-w-md mx-auto mb-4 font-body-lg">
          Thank you, {formData.name}. We have opened WhatsApp to automatically forward your cake order summary parameters.
        </p>
        <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-8">
          You can reach us directly for order confirmation or tracking queries at **+91 87930 58057**.
        </p>
        <Link to="/shop" className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-md font-bold">
          CONTINUE SHOPPING
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-margin-desktop py-12 animate-fade-in text-left">
      <h2 className="font-headline-xl text-headline-xl text-primary font-bold mb-8">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left main forms columns */}
        <form onSubmit={handleConfirmOrder} className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Section 1: Pincode Checker */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-on-surface">
            <h3 className="font-bold text-base flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">location_on</span>
              1. Delivery Pincode Validation
            </h3>
            <div className="flex gap-4">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Pincode (e.g. 380015)"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ''))
                  setPinChecked(false)
                }}
                className="w-full sm:w-64 px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold"
              />
              <button
                type="button"
                onClick={checkPincode}
                disabled={pincode.length !== 6}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border ${
                  pincode.length !== 6
                    ? 'border-outline-variant/20 text-on-surface-variant/30 cursor-not-allowed'
                    : 'bg-primary text-on-primary border-primary hover:bg-on-primary-fixed-variant'
                }`}
              >
                CHECK
              </button>
            </div>

            {pinChecked && (
              <div className="text-xs font-bold uppercase tracking-wider">
                {isDeliverable ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm leading-none">check_circle</span>
                    We deliver to your location!
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm leading-none">cancel</span>
                    Delivery unavailable. Deliverable Pincodes: 380001, 380009, 380015, 380054, 382481
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Contact & Address details */}
          <div className={`bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-on-surface transition-opacity duration-300 ${
            !isDeliverable ? 'opacity-50 pointer-events-none' : ''
          }`}>
            <h3 className="font-bold text-base flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">person</span>
              2. Delivery Address &amp; Customer details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Full Name</label>
                <input
                  required={isDeliverable}
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Phone Number</label>
                <input
                  required={isDeliverable}
                  type="tel"
                  placeholder="E.g., +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Flat / House no. / Street address</label>
                <input
                  required={isDeliverable}
                  type="text"
                  placeholder="Flat/House no., Floor, Building, Street details"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="E.g. near post office"
                  value={formData.landmark}
                  onChange={(e) => handleInputChange('landmark', e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">City</label>
                <input
                  required={isDeliverable}
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Delivery slots */}
          <div className={`bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-on-surface transition-opacity duration-300 ${
            !isDeliverable ? 'opacity-50 pointer-events-none' : ''
          }`}>
            <h3 className="font-bold text-base flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">schedule</span>
              3. Delivery Schedule &amp; Slots
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="delivery-date" className="text-xs font-bold text-chocolate uppercase tracking-wider block">Delivery Date</label>
                <input
                  id="delivery-date"
                  required={isDeliverable}
                  type="date"
                  min={getMinDate()}
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Select Time Slot</label>
                <select
                  value={formData.timeSlot}
                  onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold cursor-pointer"
                >
                  <option value="9 AM - 12 PM">Morning (9 AM - 12 PM)</option>
                  <option value="12 PM - 3 PM">Afternoon (12 PM - 3 PM)</option>
                  <option value="3 PM - 6 PM">Late Afternoon (3 PM - 6 PM)</option>
                  <option value="6 PM - 9 PM">Evening (6 PM - 9 PM)</option>
                </select>
              </div>
            </div>
          </div>

        </form>

        {/* Right sticky checkout details sidebar */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-md flex flex-col gap-6 text-on-surface">
          <h3 className="font-bold text-lg border-b border-outline-variant/20 pb-3">Review Items</h3>

          <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-1">
            {items.map(item => (
              <div key={item.id} className="flex gap-3 justify-between items-center text-xs border-b border-outline-variant/10 pb-3">
                <div className="flex flex-col text-left">
                  <span className="font-bold text-on-surface">{item.name}</span>
                  <span className="text-[10px] text-on-surface-variant">{item.weight} | Qty: {item.quantity}</span>
                </div>
                <span className="font-bold text-primary">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 text-sm border-t border-outline-variant/20 pt-4">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="font-bold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Shipping</span>
              <span className="font-bold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="border-t border-outline-variant/20 pt-3 mt-1 flex justify-between text-base font-bold">
              <span>Total amount</span>
              <span className="text-primary text-lg">₹{total}</span>
            </div>
          </div>

          <button
            type="submit"
            onClick={(e) => {
              if (isFormValid) {
                handleConfirmOrder(e)
              }
            }}
            disabled={!isFormValid}
            className={`w-full py-3.5 rounded-full font-label-md text-label-md transition-colors shadow-md font-bold text-center ${
              !isFormValid
                ? 'bg-on-surface-variant/20 text-on-surface-variant/40 cursor-not-allowed shadow-none'
                : 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant'
            }`}
          >
            PLACE ORDER VIA WHATSAPP
          </button>
        </div>
      </div>
    </div>
  )
}
