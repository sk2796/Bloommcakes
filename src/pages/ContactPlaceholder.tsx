import { useState } from 'react'

export default function ContactPlaceholder() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

  const isFormValid = isNameValid() && isPhoneValid() && formData.message.trim().length > 5

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    // Build WhatsApp message content
    const text = `*New Contact Message (BloomCakes)*\n\n` +
      `*Contact Details:*\n` +
      `- Name: ${formData.name}\n` +
      `- Phone: ${formData.phone}\n` +
      `- Email: ${formData.email || 'N/A'}\n` +
      `- Subject: ${formData.subject || 'General Inquiry'}\n\n` +
      `*Message:*\n` +
      `${formData.message}`

    const encoded = encodeURIComponent(text)
    const whatsappUrl = `https://wa.me/918420271938?text=${encoded}`
    
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="max-w-[1200px] mx-auto px-margin-desktop py-12 animate-fade-in text-left">
      <div className="text-center mb-12">
        <h2 className="font-headline-lg text-headline-lg text-primary font-bold mb-2">Contact Us</h2>
        <p className="text-on-surface-variant font-body-md max-w-lg mx-auto">
          Have queries about custom orders, deliveries, or special celebrations? Reach out and we'll happily assist you!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Contact Information Details */}
        <div className="lg:col-span-5 flex flex-col gap-8 bg-surface-container-low rounded-3xl p-8 border border-outline-variant/30">
          <div>
            <h3 className="font-headline-md text-headline-md text-primary font-bold mb-4">Get in Touch</h3>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
              We operate purely vegetarian bakeries based out of Ahmedabad, Gujarat. Feel free to call us or drop a message via our WhatsApp channel for any immediate requests.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-2xl p-2 bg-primary/10 rounded-xl">call</span>
              <div>
                <h4 className="font-bold text-sm text-on-surface uppercase tracking-wider">Phone Call</h4>
                <p className="text-sm font-semibold text-on-surface-variant mt-0.5">+91 84202 71983</p>
                <p className="text-xs text-on-surface-variant/70 mt-0.5">Mon - Sun (9 AM - 9 PM)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-2xl p-2 bg-primary/10 rounded-xl">mail</span>
              <div>
                <h4 className="font-bold text-sm text-on-surface uppercase tracking-wider">Email Inquiry</h4>
                <p className="text-sm font-semibold text-on-surface-variant mt-0.5">hello@bloomcakes.co</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-2xl p-2 bg-primary/10 rounded-xl">location_on</span>
              <div>
                <h4 className="font-bold text-sm text-on-surface uppercase tracking-wider">Serviceable Area</h4>
                <p className="text-sm font-semibold text-on-surface-variant mt-0.5">Ahmedabad, Gujarat</p>
                <p className="text-xs text-on-surface-variant/70 mt-0.5">Deliveries within serviceable pincodes only.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form Section */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 animate-fade-in">
              <span className="material-symbols-outlined text-green-500 text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <h3 className="text-2xl font-bold text-primary mb-2">Message Sent!</h3>
              <p className="text-on-surface-variant max-w-md mx-auto mb-6 text-sm">
                Thank you for contacting us. We have opened WhatsApp to automatically forward your contact message details.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-on-primary-fixed-variant transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h3 className="font-headline-md text-headline-md text-primary font-bold mb-2">Send Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Enter first & last name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold"
                  />
                  {formData.name.trim() && !isNameValid() && (
                    <span className="text-[10px] text-red-500 font-bold block uppercase tracking-wide">Enter first & last name (alphabetical, min 2 letters each).</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Phone Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="E.g., +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold"
                  />
                  {formData.phone.trim() && !isPhoneValid() && (
                    <span className="text-[10px] text-red-500 font-bold block uppercase tracking-wide">Enter a valid 10-digit Indian phone number.</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Subject (Optional)</label>
                  <input
                    type="text"
                    placeholder="E.g. Custom cake inquiry"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-chocolate uppercase tracking-wider block">Your Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you are looking for..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3.5 rounded-full font-label-md text-label-md transition-colors shadow-md font-bold text-center uppercase tracking-wider mt-2 ${
                  !isFormValid
                    ? 'bg-on-surface-variant/20 text-on-surface-variant/40 cursor-not-allowed shadow-none'
                    : 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant'
                }`}
              >
                Send Message via WhatsApp
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
