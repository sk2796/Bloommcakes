import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/features/cart/store/useCartStore'

const PIN_CODES_DELIVERABLE = ['380001', '380009', '380015', '380054', '382481', '380058', '380021']

type OccasionType = 'birthday' | 'anniversary' | 'wedding' | 'engagement' | 'other'

// Mock promo codes database mapping
const MOCK_PROMO_CODES: Record<string, { type: 'percent' | 'flat'; value: number }> = {
  'BLOOM10': { type: 'percent', value: 10 },
  'SWEET50': { type: 'flat', value: 50 },
  'FESTIVE20': { type: 'percent', value: 20 }
}

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
    timeSlot: '12 PM - 3 PM',
    occasion: 'birthday' as OccasionType,
    customOccasion: ''
  })
  
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [whatsappLink, setWhatsappLink] = useState('')

  // Promo code states
  const [promoCodeInput, setPromoCodeInput] = useState('')
  const [activePromo, setActivePromo] = useState<string | null>(null)
  const [promoError, setPromoError] = useState('')

  const subtotal = getCartTotal()
  
  // Calculate discount
  let discountAmount = 0
  if (activePromo && MOCK_PROMO_CODES[activePromo]) {
    const promo = MOCK_PROMO_CODES[activePromo]
    if (promo.type === 'percent') {
      discountAmount = Math.round((subtotal * promo.value) / 100)
    } else if (promo.type === 'flat') {
      discountAmount = Math.min(promo.value, subtotal)
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discountAmount)
  const shipping = discountedSubtotal > 1500 || subtotal === 0 ? 0 : 99
  const total = discountedSubtotal + shipping

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

  const handleApplyPromo = () => {
    const normalized = promoCodeInput.trim().toUpperCase()
    if (MOCK_PROMO_CODES[normalized]) {
      setActivePromo(normalized)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code!')
      setActivePromo(null)
    }
  }

  const handleRemovePromo = () => {
    setActivePromo(null)
    setPromoCodeInput('')
    setPromoError('')
  }

  // Name validation: Must contain at least a first and last name (alphabetical, min 2 chars each)
  const isNameValid = () => {
    const trimmed = formData.name.trim()
    return /^[a-zA-Z]{2,}\s+[a-zA-Z]{2,}/.test(trimmed)
  }

  // Phone validation: Must match standard Indian 10-digit formats (optionally prefixed with +91 or 0)
  const isPhoneValid = () => {
    const trimmed = formData.phone.trim().replace(/[\s-]/g, '')
    return /^(?:\+91|0)?[6-9]\d{9}$/.test(trimmed)
  }

  const startPaymentCheckoutFlow = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Contact Backend API to create orders reference
    try {
      const response = await fetch('http://127.0.0.1:8000/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total * 100, // convert INR to paise
          currency: 'INR',
          // eslint-disable-next-line react-hooks/purity
          receipt: `rcpt_${Math.floor(Math.random() * 1000000)}`
        })
      })

      if (!response.ok) {
        throw new Error('Order creation failed on backend server.')
      }

      const orderData = await response.json()

      // 2. Configure Razorpay client checkout modal parameters
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TWKVpMlrWThBL5',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'BloomCakes',
        description: 'Premium Handcrafted Cakes Order',
        image: '/logo.jpg',
        order_id: orderData.order_id,
        handler: async function (paymentRes: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          // 3. Forward signature results validation details to verification endpoint
          try {
            const verifyRes = await fetch('http://127.0.0.1:8000/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentRes.razorpay_order_id,
                razorpay_payment_id: paymentRes.razorpay_payment_id,
                razorpay_signature: paymentRes.razorpay_signature
              })
            })

            if (verifyRes.ok) {
              // Proceed with order confirmation routing on successful signatures check
              handleConfirmOrder()
            } else {
              alert('Payment validation check failed. Transaction signatures mismatch.')
            }
          } catch (err) {
            console.error(err)
            alert('Unable to reach verification api server.')
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone,
          email: formData.email || undefined
        },
        theme: { color: '#E0A3B6' },
        modal: {
          ondismiss: function () {
            alert('Checkout payment modal dismissed by user.')
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as any).Razorpay(options)
        rzp.on('payment.failed', function (resp: { error: { description: string } }) {
          alert(`Payment transaction failed: ${resp.error.description}`)
        })
        rzp.open()
      } else {
        throw new Error('Razorpay SDK not loaded on window client.')
      }

    } catch (err: unknown) {
      console.error(err)
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      alert(`Checkout initialization failed: ${errorMsg}`)
    }
  }

  const handleConfirmOrder = () => {
    setOrderConfirmed(true)
    
    const fullAddress = `${formData.addressLine1}${formData.landmark ? `, Landmark: ${formData.landmark}` : ''}, ${formData.city} - ${pincode}`
    const occasionText = formData.occasion === 'other' 
      ? `Other (${formData.customOccasion})` 
      : formData.occasion.toUpperCase()

    // Auto compile WhatsApp details on confirmation
    const text = `*New Order Details (BloomCakes)*\n\n` +
      `*Customer details:*\n` +
      `- Name: ${formData.name}\n` +
      `- Phone: ${formData.phone}\n` +
      `- Occasion: ${occasionText}\n` +
      `- Address: ${fullAddress}\n\n` +
      `*Order summary:*\n` +
      items.map(item => `  - ${item.name} (${item.weight}) x${item.quantity} = ₹${item.price * item.quantity}`).join('\n') +
      `\n\n*Total amount:* ₹${total}` +
      (activePromo ? ` (Promo code applied: ${activePromo} - Saved ₹${discountAmount})` : '') +
      `\n\n*Delivery Schedule:*\n` +
      `- Date: ${formData.date}\n` +
      `- Slot: ${formData.timeSlot}`

    const encoded = encodeURIComponent(text)
    const whatsappUrl = `https://wa.me/918420271983?text=${encoded}`
    
    setWhatsappLink(whatsappUrl)
    try {
      window.open(whatsappUrl, '_blank')
    } catch (e) {
      console.error('Popup blocked:', e)
    }
    clearCart()
  }

  const isFormValid = isDeliverable && 
    isNameValid() && 
    isPhoneValid() && 
    formData.addressLine1.trim() && 
    formData.city.trim() && 
    formData.date &&
    (formData.occasion !== 'other' || formData.customOccasion.trim().length > 0)

  if (items.length === 0 && !orderConfirmed) {
    return (
      <div className="max-w-[1200px] mx-auto px-margin-desktop py-24 text-center animate-fade-in">
        <span className="material-symbols-outlined text-on-surface-variant/40 text-6xl mb-4">shopping_cart</span>
        <h2 className="text-3xl font-bold text-primary mb-3">Your cart is empty</h2>
        <p className="text-on-surface-variant max-w-md mx-auto mb-8 font-body-lg">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/shop" className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-md font-bold">
          GO TO SHOP
        </Link>
      </div>
    )
  }

  if (orderConfirmed) {
    return (
      <div className="max-w-container-max mx-auto px-margin-desktop py-24 text-center animate-fade-in flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-green-500 text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <h2 className="text-3xl font-bold text-primary mb-3">Order Confirmed!</h2>
        <p className="text-on-surface-variant max-w-md mx-auto mb-6 font-body-lg">
          Thank you, {formData.name}. Your payment has been received successfully.
        </p>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-8">
          Please click the button below to automatically send your order summary to us on WhatsApp to finalize your delivery slot.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 text-white px-8 py-3.5 rounded-full font-label-md text-label-md hover:bg-green-700 transition-colors shadow-md font-bold flex items-center gap-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.248 8.477 3.517 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.8.001-2.618-1.01-5.08-2.859-6.931C16.378 2.025 13.92 1.015 11.999 1.015c-5.412 0-9.816 4.404-9.82 9.81-.001 1.936.568 3.826 1.648 5.446l-.999 3.65 3.82-.967zm12.355-6.52c-.3-.15-1.77-.875-2.045-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-1.025-.512-1.745-.882-2.427-2.05-.181-.31.181-.287.519-.96.062-.125.031-.237-.015-.337-.046-.1-.476-1.144-.652-1.569-.172-.412-.344-.356-.476-.362-.125-.006-.268-.007-.412-.007s-.377.05-.575.268c-.198.219-.756.738-.756 1.8s.772 2.088.88 2.238c.108.15 1.517 2.316 3.675 3.248 1.25.541 1.9.619 2.583.518.775-.115 2.378-.973 2.712-1.916.335-.943.335-1.75.235-1.9-.1-.15-.4-.25-.7-.4z"/>
              </svg>
              SEND DETAILS ON WHATSAPP
            </a>
          )}
          <Link to="/shop" className="border border-outline px-8 py-3.5 rounded-full font-label-md text-label-md hover:bg-surface-container-low transition-colors shadow-sm font-bold">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-margin-desktop py-12 animate-fade-in text-left">
      <h2 className="font-headline-xl text-headline-xl text-primary font-bold mb-8">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left main forms columns */}
        <form onSubmit={startPaymentCheckoutFlow} className="lg:col-span-8 flex flex-col gap-6">
          
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
                    Delivery unavailable. Deliverable Pincodes: 380001, 380009, 380015, 380054, 382481, 380058, 380021
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Occasion Selection */}
          <div className={`bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-on-surface transition-opacity duration-300 ${
            !isDeliverable ? 'opacity-50 pointer-events-none' : ''
          }`}>
            <h3 className="font-bold text-base flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">celebration</span>
              2. Select Occasion
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Occasion Type</label>
                <select
                  value={formData.occasion}
                  onChange={(e) => handleInputChange('occasion', e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold cursor-pointer"
                >
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="wedding">Wedding</option>
                  <option value="engagement">Engagement</option>
                  <option value="other">Other Occasion</option>
                </select>
              </div>

              {formData.occasion === 'other' && (
                <div className="space-y-1 animate-fade-in">
                  <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Write custom occasion</label>
                  <input
                    required={formData.occasion === 'other'}
                    type="text"
                    placeholder="Enter custom occasion details"
                    value={formData.customOccasion}
                    onChange={(e) => handleInputChange('customOccasion', e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Contact & Address details */}
          <div className={`bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-on-surface transition-opacity duration-300 ${
            !isDeliverable ? 'opacity-50 pointer-events-none' : ''
          }`}>
            <h3 className="font-bold text-base flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">person</span>
              3. Delivery Address &amp; Customer details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Full Name (First and Last Name)</label>
                <input
                  required={isDeliverable}
                  type="text"
                  placeholder="Enter first & last name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold"
                />
                {formData.name.trim() && !isNameValid() && (
                  <span className="text-[10px] text-red-500 font-bold block uppercase tracking-wide">Please enter first &amp; last name (alphabets only, min 2 letters each).</span>
                )}
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
                {formData.phone.trim() && !isPhoneValid() && (
                  <span className="text-[10px] text-red-500 font-bold block uppercase tracking-wide">Please enter a valid 10-digit Indian phone number.</span>
                )}
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

          {/* Section 4: Delivery slots */}
          <div className={`bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-on-surface transition-opacity duration-300 ${
            !isDeliverable ? 'opacity-50 pointer-events-none' : ''
          }`}>
            <h3 className="font-bold text-base flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">schedule</span>
              4. Delivery Schedule &amp; Slots
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

          {/* Promo code application block */}
          <div className="border-t border-outline-variant/20 pt-4 flex flex-col gap-2">
            <label className="text-xs font-bold text-chocolate uppercase tracking-wider block text-left">Promo Code</label>
            {activePromo ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3 text-xs font-semibold text-green-800">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">local_offer</span>
                  {activePromo} Applied (Saved ₹{discountAmount})
                </span>
                <button 
                  onClick={handleRemovePromo}
                  type="button" 
                  className="text-red-500 hover:text-red-700 font-bold uppercase tracking-wider text-[10px]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter code (E.g. BLOOM10)"
                  value={promoCodeInput}
                  onChange={(e) => {
                    setPromoCodeInput(e.target.value)
                    setPromoError('')
                  }}
                  className="w-full px-3.5 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-xs font-semibold uppercase"
                />
                <button 
                  onClick={handleApplyPromo}
                  disabled={!promoCodeInput.trim()}
                  type="button"
                  className="bg-primary text-on-primary px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-on-primary-fixed-variant disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            )}
            {promoError && (
              <span className="text-[10px] text-red-500 font-bold text-left block uppercase tracking-wide">{promoError}</span>
            )}
            {!activePromo && !promoError && (
              <span className="text-[9px] text-on-surface-variant/70 text-left block">Try **BLOOM10** (10% off) or **SWEET50** (₹50 off)</span>
            )}
          </div>

          <div className="flex flex-col gap-3 text-sm border-t border-outline-variant/20 pt-4">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="font-bold">₹{subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-700 font-semibold">
                <span>Promo Discount</span>
                <span>- ₹{discountAmount}</span>
              </div>
            )}
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
                startPaymentCheckoutFlow(e)
              }
            }}
            disabled={!isFormValid}
            className={`w-full py-3.5 rounded-full font-label-md text-label-md transition-colors shadow-md font-bold text-center ${
              !isFormValid
                ? 'bg-on-surface-variant/20 text-on-surface-variant/40 cursor-not-allowed shadow-none'
                : 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant'
            }`}
          >
            PROCEED TO PAY
          </button>
        </div>
      </div>
    </div>
  )
}
