import { useState, useRef, useEffect } from 'react'
import { useLocationStore } from '../store/useLocationStore'

export function LocationSelector() {
  const { location, isChecking, error, checkPincode, clearLocation } = useLocationStore()
  const [isOpen, setIsOpen] = useState(false)
  const [pincodeInput, setPincodeInput] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await checkPincode(pincodeInput)
    if (success) {
      setPincodeInput('')
      setIsOpen(false)
    }
  }

  return (
    <div className="relative inline-block" ref={modalRef}>
      {/* Trigger Button near cart */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-on-surface transition-all duration-200 shadow-sm"
        aria-label="Select delivery location"
        title={location ? `Delivering to ${location.city} (${location.pincode})` : 'Select delivery location'}
      >
        <span className={`material-symbols-outlined text-base leading-none ${location ? 'text-primary' : 'text-on-surface-variant'}`}>
          location_on
        </span>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">
            {location ? 'Deliver to' : 'Delivery Area'}
          </span>
          <span className="text-xs font-bold text-primary truncate max-w-[90px] sm:max-w-[120px]">
            {location ? `${location.city} (${location.pincode})` : 'Check Pincode'}
          </span>
        </div>
        <span className="material-symbols-outlined text-xs text-on-surface-variant leading-none">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Dropdown / Popover Modal */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-72 sm:w-80 bg-surface border border-outline-variant/30 rounded-2xl p-4 shadow-xl z-50 animate-fade-in text-left">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">distance</span>
              <h4 className="font-bold text-sm text-on-surface">Select Delivery Location</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-full transition-colors"
              aria-label="Close location selector"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          {location ? (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                  <div>
                    <p className="text-xs font-bold text-primary">Delivering to {location.city}</p>
                    <p className="text-[11px] text-on-surface-variant font-medium">Pincode: {location.pincode}</p>
                    <p className="text-[10px] text-green-700 font-semibold mt-0.5">✓ Service available in your area</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearLocation()
                  }}
                  className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
              Check delivery availability before selecting your cake to ensure fast, fresh delivery.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit Pincode"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => {
                  setPincodeInput(e.target.value.replace(/\D/g, ''))
                }}
                className="flex-1 px-3 py-2 text-xs font-semibold bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary text-on-surface"
                autoFocus
              />
              <button
                type="submit"
                disabled={pincodeInput.length !== 6 || isChecking}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm ${
                  pincodeInput.length !== 6 || isChecking
                    ? 'bg-outline-variant/20 text-on-surface-variant/40 cursor-not-allowed'
                    : 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant'
                }`}
              >
                {isChecking ? '...' : 'Check'}
              </button>
            </div>

            {error && (
              <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 pt-1">
                <span className="material-symbols-outlined text-xs">error</span>
                {error}
              </p>
            )}
          </form>

          <div className="mt-3 pt-2.5 border-t border-outline-variant/20 text-[10px] text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-primary">local_shipping</span>
            <span>Serving Ahmedabad &amp; surrounding areas</span>
          </div>
        </div>
      )}
    </div>
  )
}
