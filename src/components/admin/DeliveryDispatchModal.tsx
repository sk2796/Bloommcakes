import { useState, useEffect } from 'react'
import { X, Truck, MapPin, Package, Loader2, AlertCircle, CheckCircle2, Zap } from 'lucide-react'
import { adminService } from '@/features/admin/adminService'
import { AdminOrder, ShippingProvider, DeliveryQuote } from '@/features/admin/types'

interface Props {
  order: AdminOrder
  isOpen: boolean
  onClose: () => void
  onDispatched: () => void
}

export function DeliveryDispatchModal({ order, isOpen, onClose, onDispatched }: Props) {
  const [providers, setProviders] = useState<ShippingProvider[]>([])
  const [selectedProvider, setSelectedProvider] = useState('manual')
  const [quote, setQuote] = useState<DeliveryQuote | null>(null)
  const [loadingProviders, setLoadingProviders] = useState(true)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [dispatching, setDispatching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [packageNote, setPackageNote] = useState('')

  useEffect(() => {
    if (isOpen) {
      setError(null)
      setSuccess(false)
      setQuote(null)
      setPackageNote('')
      fetchProviders()
    }
  }, [isOpen])

  const fetchProviders = async () => {
    setLoadingProviders(true)
    try {
      const data = await adminService.getShippingProviders()
      setProviders(data)
      // Auto-select first configured provider, fallback to manual
      const configured = data.find(p => p.configured && p.id !== 'manual')
      setSelectedProvider(configured?.id || 'manual')
    } catch (err: any) {
      setError(err.message || 'Failed to load providers')
    } finally {
      setLoadingProviders(false)
    }
  }

  const fetchQuote = async (providerName: string) => {
    if (providerName === 'manual') {
      setQuote({ provider: 'manual', estimated_price: 0, currency: 'INR', vehicle_type: 'Self/Manual' })
      return
    }
    setLoadingQuote(true)
    setError(null)
    try {
      const q = await adminService.getDeliveryQuote(order.order_id, providerName)
      setQuote(q)
    } catch (err: any) {
      setError(err.message || 'Failed to get delivery quote')
      setQuote(null)
    } finally {
      setLoadingQuote(false)
    }
  }

  useEffect(() => {
    if (isOpen && selectedProvider) {
      fetchQuote(selectedProvider)
    }
  }, [selectedProvider, isOpen])

  const handleDispatch = async () => {
    setDispatching(true)
    setError(null)
    try {
      await adminService.dispatchDelivery(order.order_id, selectedProvider, packageNote || undefined)
      setSuccess(true)
      setTimeout(() => {
        onDispatched()
        onClose()
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch delivery')
    } finally {
      setDispatching(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#ebd8d0] overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4a1525] to-[#9f4122] p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <Truck size={20} />
              </div>
              <div>
                <h2 className="font-bold text-lg">Dispatch Delivery</h2>
                <p className="text-white/70 text-xs font-mono">{order.order_id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/15 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Success State */}
          {success && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg text-[#2d0e17]">Delivery Dispatched!</h3>
              <p className="text-sm text-[#735751] mt-1">Rider will be assigned shortly.</p>
            </div>
          )}

          {!success && (
            <>
              {/* Delivery Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#fdf8f5] rounded-xl p-3 border border-[#ebd8d0]">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#916b61] uppercase tracking-wider mb-1.5">
                    <Package size={12} /> Items
                  </div>
                  <p className="text-xs text-[#2d0e17] font-medium leading-relaxed">{order.items_summary}</p>
                </div>
                <div className="bg-[#fdf8f5] rounded-xl p-3 border border-[#ebd8d0]">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#916b61] uppercase tracking-wider mb-1.5">
                    <MapPin size={12} /> Deliver To
                  </div>
                  <p className="text-xs text-[#2d0e17] font-medium">{order.name}</p>
                  <p className="text-xs text-[#735751]">{order.addressLine1}</p>
                  <p className="text-xs text-[#735751]">{order.city} — {order.pincode}</p>
                </div>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="text-xs font-bold text-[#2d0e17] uppercase tracking-wider block mb-2">
                  Delivery Provider
                </label>
                {loadingProviders ? (
                  <div className="flex items-center gap-2 text-sm text-[#916b61] py-3">
                    <Loader2 size={16} className="animate-spin" /> Loading providers...
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {providers.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProvider(p.id)}
                        className={`
                          flex items-center justify-between p-3 rounded-xl border text-left transition-all
                          ${selectedProvider === p.id
                            ? 'border-[#e76f51] bg-[#fdf2ee] ring-1 ring-[#e76f51]/30'
                            : 'border-[#ebd8d0] bg-white hover:border-[#e5d5cf] hover:bg-[#fdf8f5]'
                          }
                          ${!p.configured && p.id !== 'manual' ? 'opacity-50' : ''}
                        `}
                        disabled={!p.configured && p.id !== 'manual'}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#2d0e17]">{p.name}</span>
                            {p.configured ? (
                              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">Ready</span>
                            ) : (
                              <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Not Configured</span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#735751] mt-0.5">{p.description}</p>
                        </div>
                        {selectedProvider === p.id && (
                          <div className="w-5 h-5 rounded-full bg-[#e76f51] flex items-center justify-center shrink-0">
                            <CheckCircle2 size={14} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quote Display */}
              {(loadingQuote || quote) && (
                <div className="bg-[#fdf8f5] rounded-xl p-4 border border-[#ebd8d0]">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#916b61] uppercase tracking-wider mb-2">
                    <Zap size={12} /> Delivery Estimate
                  </div>
                  {loadingQuote ? (
                    <div className="flex items-center gap-2 text-sm text-[#916b61]">
                      <Loader2 size={14} className="animate-spin" /> Calculating...
                    </div>
                  ) : quote && (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-[#2d0e17]">
                          {quote.estimated_price === 0 ? 'Free' : `₹${quote.estimated_price.toFixed(0)}`}
                        </div>
                        {quote.vehicle_type && (
                          <span className="text-[11px] text-[#735751]">via {quote.vehicle_type}</span>
                        )}
                      </div>
                      {quote.estimated_duration_minutes && (
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#2d0e17]">~{quote.estimated_duration_minutes} min</div>
                          <span className="text-[11px] text-[#735751]">est. delivery</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Package Note */}
              <div>
                <label className="text-xs font-bold text-[#2d0e17] uppercase tracking-wider block mb-1.5">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={packageNote}
                  onChange={(e) => setPackageNote(e.target.value)}
                  placeholder="e.g., Handle with care — fragile cake. Ring doorbell on arrival."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebd8d0] text-sm text-[#2d0e17] placeholder:text-[#c0a89e] focus:outline-none focus:ring-2 focus:ring-[#e76f51]/30 focus:border-[#e76f51] transition-all resize-none"
                  rows={2}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#ebd8d0] text-sm font-semibold text-[#735751] hover:bg-[#faeee8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDispatch}
                  disabled={dispatching || loadingQuote || !selectedProvider}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#e76f51] to-[#f4845f] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {dispatching ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Dispatching...
                    </>
                  ) : (
                    <>
                      <Truck size={15} />
                      Dispatch Now
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
