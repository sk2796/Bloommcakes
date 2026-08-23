import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CustomCakeOrder, OccasionType } from '@/features/custom-cake/types'

const STEP_METADATA = [
  { step: 1, title: 'Occasion', desc: 'Choose the occasion' },
  { step: 2, title: 'Cake Details', desc: 'Flavour, size & design' },
  { step: 3, title: 'Personalization', desc: 'Add message & extras' },
  { step: 4, title: 'Delivery Details', desc: 'Date, time & location' },
  { step: 5, title: 'Review & Confirm', desc: 'Review your order' }
]

const OCCASIONS: { type: OccasionType; label: string; icon: string }[] = [
  { type: 'birthday', label: 'Birthday', icon: 'cake' },
  { type: 'anniversary', label: 'Anniversary', icon: 'favorite' },
  { type: 'wedding', label: 'Wedding', icon: 'groups' },
  { type: 'kids', label: 'Kids Party', icon: 'mood' },
  { type: 'corporate', label: 'Corporate', icon: 'business_center' },
  { type: 'other', label: 'Other', icon: 'more_horiz' }
]

export default function CustomCakePlaceholder() {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<CustomCakeOrder>({
    occasion: 'birthday',
    occasionNotes: '',
    flavor: 'Belgian Chocolate',
    size: '1kg',
    shape: 'Round',
    customMessage: '',
    specialInstructions: '',
    deliveryDate: '',
    deliveryTimeSlot: '12 PM - 3 PM',
    deliveryAddress: '',
    customerName: '',
    customerPhone: '',
    customerEmail: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateField = (field: keyof CustomCakeOrder, value: string | OccasionType) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="max-w-container-max mx-auto px-margin-desktop py-24 text-center animate-fade-in">
        <span className="material-symbols-outlined text-green-500 text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <h2 className="text-3xl font-bold text-primary mb-3">Order Received!</h2>
        <p className="text-on-surface-variant max-w-md mx-auto mb-8 font-body-lg">
          Thank you, {formData.customerName}. Our artisanal baking team will review your custom configuration for the **{formData.occasion}** cake and reach out to you within 2 hours.
        </p>
        <Link to="/shop" className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-md font-bold">
          BACK TO MENU
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-margin-desktop py-12">
      {/* Title Header */}
      <div className="text-center mb-12">
        <h2 className="font-headline-xl text-headline-xl text-on-surface mb-2 font-bold">Custom Cake Order</h2>
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[10px] leading-none">chevron_right</span>
          <span className="text-primary">Custom Cakes</span>
        </div>
      </div>

      {/* Main split: Sidebar stepper vs configuration panel content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column sidebar: Stepper details & WhatsApp callout */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-container-low/30 rounded-2xl p-6 border border-outline-variant/20 flex flex-col gap-6">
            {STEP_METADATA.map((step) => {
              const isActive = currentStep === step.step
              const isCompleted = currentStep > step.step
              return (
                <div key={step.step} className="flex gap-4 items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                      isActive 
                        ? 'bg-primary text-on-primary border-primary shadow-sm ring-4 ring-primary/10' 
                        : isCompleted
                          ? 'bg-primary-container text-on-primary-container border-primary-container'
                          : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-sm leading-none font-bold">check</span>
                    ) : (
                      step.step
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`text-sm font-bold leading-none ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                      {step.title}
                    </span>
                    <span className="text-[10px] text-on-surface-variant mt-1 leading-none">
                      {step.desc}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* WhatsApp floating widget callout banner */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-primary-container/20 rounded-full flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">support_agent</span>
            </div>
            <div className="text-center">
              <h4 className="text-sm font-bold text-on-surface mb-1">Need help with your order?</h4>
              <p className="text-xs text-on-surface-variant">Chat with us on WhatsApp for quick help.</p>
            </div>
            <a 
              href="https://wa.me/919876543210" 
              target="_blank" 
              rel="noreferrer"
              className="w-full border border-primary text-primary px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
            >
              CHAT NOW
              <span className="material-symbols-outlined text-sm">chat</span>
            </a>
          </div>
        </div>

        {/* Right column: Form Content steps container panel */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/30 p-8 rounded-3xl soft-shadow min-h-[480px] flex flex-col justify-between">
          
          {/* Form Step Body components switcher */}
          <div className="text-left">
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-xl">celebration</span>
                  <h3 className="text-lg font-bold">Select Occasion</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {OCCASIONS.map((occ) => (
                    <button
                      key={occ.type}
                      onClick={() => updateField('occasion', occ.type)}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl border text-center transition-all ${
                        formData.occasion === occ.type
                          ? 'bg-surface-container border-primary shadow-sm text-primary font-bold'
                          : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary mb-3 shadow-sm border border-outline-variant/10">
                        <span className="material-symbols-outlined text-xl leading-none">{occ.icon}</span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wide">{occ.label}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-2 mt-6">
                  <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">
                    Tell us more about the occasion (Optional)
                  </label>
                  <textarea
                    placeholder="E.g., It's my parents' 50th Golden Anniversary..."
                    value={formData.occasionNotes}
                    onChange={(e) => updateField('occasionNotes', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-cream/30 border border-chocolate/20 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-xl">cake</span>
                  <h3 className="text-lg font-bold">Cake Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Select Flavor</label>
                    <select
                      value={formData.flavor}
                      onChange={(e) => updateField('flavor', e.target.value)}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold cursor-pointer"
                    >
                      <option value="Belgian Chocolate">Belgian Chocolate</option>
                      <option value="Red Velvet">Red Velvet</option>
                      <option value="Butterscotch Crunch">Butterscotch Crunch</option>
                      <option value="Blueberry Cheesecake">Blueberry Cheesecake</option>
                      <option value="Fresh Mango Cream">Fresh Mango Cream</option>
                      <option value="Classic Vanilla Bean">Classic Vanilla Bean</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Select Size</label>
                    <select
                      value={formData.size}
                      onChange={(e) => updateField('size', e.target.value)}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold cursor-pointer"
                    >
                      <option value="1kg">1kg (serves 8-10)</option>
                      <option value="2kg">2kg (serves 15-20)</option>
                      <option value="3kg">3kg (serves 25-30)</option>
                      <option value="5kg+">5kg+ (Wedding tier)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Cake Shape</label>
                    <select
                      value={formData.shape}
                      onChange={(e) => updateField('shape', e.target.value)}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold cursor-pointer"
                    >
                      <option value="Round">Round</option>
                      <option value="Square">Square</option>
                      <option value="Heart">Heart shaped</option>
                      <option value="Tiered">Tiered custom design</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-xl">edit_note</span>
                  <h3 className="text-lg font-bold">Personalization</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">
                    Message on Cake (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Happy 50th Anniversary Mom & Dad"
                    value={formData.customMessage}
                    onChange={(e) => updateField('customMessage', e.target.value)}
                    className="w-full px-4 py-3 bg-cream/30 border border-chocolate/20 rounded-xl focus:outline-none focus:border-primary text-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">
                    Special Baking Instructions & Design Requests
                  </label>
                  <textarea
                    placeholder="E.g., Please make it eggless, low on sugar, and add pink florals frosting details..."
                    value={formData.specialInstructions}
                    onChange={(e) => updateField('specialInstructions', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-cream/30 border border-chocolate/20 rounded-xl focus:outline-none focus:border-primary text-sm transition-all"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-xl">local_shipping</span>
                  <h3 className="text-lg font-bold">Delivery &amp; Contact Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Delivery Date</label>
                    <input
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => updateField('deliveryDate', e.target.value)}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Time Slot</label>
                    <select
                      value={formData.deliveryTimeSlot}
                      onChange={(e) => updateField('deliveryTimeSlot', e.target.value)}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold cursor-pointer"
                    >
                      <option value="9 AM - 12 PM">Morning (9 AM - 12 PM)</option>
                      <option value="12 PM - 3 PM">Afternoon (12 PM - 3 PM)</option>
                      <option value="3 PM - 6 PM">Late Afternoon (3 PM - 6 PM)</option>
                      <option value="6 PM - 9 PM">Evening (6 PM - 9 PM)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Delivery Address</label>
                    <input
                      type="text"
                      placeholder="Street address, Appt, Area, Ahmedabad"
                      value={formData.deliveryAddress}
                      onChange={(e) => updateField('deliveryAddress', e.target.value)}
                      className="w-full px-4 py-3 bg-cream/30 border border-chocolate/20 rounded-xl focus:outline-none focus:border-primary text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Contact Name</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={formData.customerName}
                      onChange={(e) => updateField('customerName', e.target.value)}
                      className="w-full px-4 py-3 bg-cream/30 border border-chocolate/20 rounded-xl focus:outline-none focus:border-primary text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="E.g., +91 98765 43210"
                      value={formData.customerPhone}
                      onChange={(e) => updateField('customerPhone', e.target.value)}
                      className="w-full px-4 py-3 bg-cream/30 border border-chocolate/20 rounded-xl focus:outline-none focus:border-primary text-sm transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6 animate-fade-in text-on-surface">
                <div className="flex items-center gap-2 text-primary border-b border-outline-variant/20 pb-3">
                  <span className="material-symbols-outlined text-xl">assignment_turned_in</span>
                  <h3 className="text-lg font-bold">Review Custom Order</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3 bg-surface-container-low/20 p-5 rounded-2xl border border-outline-variant/10">
                    <h4 className="font-bold text-chocolate uppercase tracking-wider text-xs">Cake Configuration</h4>
                    <p><span className="text-on-surface-variant font-medium">Occasion:</span> <span className="font-bold uppercase text-xs">{formData.occasion}</span></p>
                    <p><span className="text-on-surface-variant font-medium">Flavor:</span> <span className="font-bold">{formData.flavor}</span></p>
                    <p><span className="text-on-surface-variant font-medium">Size:</span> <span className="font-bold">{formData.size}</span></p>
                    <p><span className="text-on-surface-variant font-medium">Shape:</span> <span className="font-bold">{formData.shape}</span></p>
                    {formData.customMessage && (
                      <p><span className="text-on-surface-variant font-medium">Writing:</span> <span className="italic font-bold">"{formData.customMessage}"</span></p>
                    )}
                  </div>

                  <div className="space-y-3 bg-surface-container-low/20 p-5 rounded-2xl border border-outline-variant/10">
                    <h4 className="font-bold text-chocolate uppercase tracking-wider text-xs">Delivery &amp; Contact</h4>
                    <p><span className="text-on-surface-variant font-medium">Date:</span> <span className="font-bold">{formData.deliveryDate || 'Not specified'}</span></p>
                    <p><span className="text-on-surface-variant font-medium">Slot:</span> <span className="font-bold">{formData.deliveryTimeSlot}</span></p>
                    <p><span className="text-on-surface-variant font-medium">Address:</span> <span className="font-bold">{formData.deliveryAddress || 'Store Pickup'}</span></p>
                    <p><span className="text-on-surface-variant font-medium">Contact:</span> <span className="font-bold">{formData.customerName} ({formData.customerPhone})</span></p>
                  </div>
                </div>

                {formData.specialInstructions && (
                  <div className="bg-surface-container-low/10 p-5 rounded-2xl border border-outline-variant/10 text-sm">
                    <span className="font-bold text-chocolate uppercase tracking-wider text-xs block mb-1">Baking Directions</span>
                    <p className="text-on-surface-variant">{formData.specialInstructions}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons wrapper */}
          <div className="flex justify-between items-center border-t border-outline-variant/20 pt-6 mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                currentStep === 1
                  ? 'text-on-surface-variant/30 border border-outline-variant/10 cursor-not-allowed'
                  : 'text-on-surface border border-outline hover:bg-surface-container-low'
              }`}
            >
              Back
            </button>

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="bg-primary text-on-primary px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-on-primary-fixed-variant transition-colors shadow-md flex items-center gap-2"
              >
                NEXT STEP
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.customerName || !formData.customerPhone}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-md ${
                  !formData.customerName || !formData.customerPhone
                    ? 'bg-on-surface-variant/20 text-on-surface-variant/40 cursor-not-allowed shadow-none'
                    : 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant'
                }`}
              >
                CONFIRM CUSTOM CAKE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
