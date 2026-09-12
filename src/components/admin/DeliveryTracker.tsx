import { useState, useEffect } from 'react'
import { 
  X, Truck, Phone, User, ExternalLink, 
  RefreshCw, XCircle, Loader2, ChevronDown, CheckCircle2,
  Clock, Package, Navigation
} from 'lucide-react'
import { adminService } from '@/features/admin/adminService'
import { DeliveryInfo, DELIVERY_STATUS_LABELS } from '@/features/admin/types'

interface Props {
  orderId: string
  isOpen: boolean
  onClose: () => void
  onStatusChanged?: () => void
}

const TIMELINE_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'accepted', label: 'Accepted', icon: CheckCircle2 },
  { key: 'rider_assigned', label: 'Rider Assigned', icon: User },
  { key: 'picked_up', label: 'Picked Up', icon: Navigation },
  { key: 'in_transit', label: 'In Transit', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
]

const STATUS_ORDER: Record<string, number> = {
  pending: 0,
  accepted: 1,
  rider_assigned: 2,
  picked_up: 3,
  in_transit: 4,
  delivered: 5,
  cancelled: -1,
  failed: -1,
}

export function DeliveryTracker({ orderId, isOpen, onClose, onStatusChanged }: Props) {
  const [delivery, setDelivery] = useState<DeliveryInfo | null>(null)
  const [hasDelivery, setHasDelivery] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showManualUpdate, setShowManualUpdate] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const fetchDelivery = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.getDeliveryInfo(orderId)
      setHasDelivery(data.has_delivery)
      setDelivery(data.delivery)
    } catch (err: any) {
      setError(err.message || 'Failed to load delivery info')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchDelivery()
    }
  }, [isOpen, orderId])

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this delivery?')) return
    setCancelling(true)
    try {
      await adminService.cancelDelivery(orderId)
      await fetchDelivery()
      onStatusChanged?.()
    } catch (err: any) {
      setError(err.message || 'Failed to cancel delivery')
    } finally {
      setCancelling(false)
    }
  }

  const handleManualStatusUpdate = async (newStatus: string) => {
    if (!delivery) return
    setUpdatingStatus(true)
    try {
      await adminService.updateDeliveryStatus(delivery.delivery_id, newStatus)
      await fetchDelivery()
      onStatusChanged?.()
      setShowManualUpdate(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (!isOpen) return null

  const currentStep = delivery ? (STATUS_ORDER[delivery.status] ?? -1) : -1
  const isTerminal = delivery?.status === 'delivered' || delivery?.status === 'cancelled' || delivery?.status === 'failed'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#ebd8d0] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2d0e17] to-[#4a1525] p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <Truck size={20} />
              </div>
              <div>
                <h2 className="font-bold text-lg">Delivery Tracking</h2>
                <p className="text-white/70 text-xs font-mono">{orderId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchDelivery}
                className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/15 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center py-8 text-[#916b61]">
              <Loader2 size={28} className="animate-spin mb-3" />
              <span className="text-sm">Loading delivery information...</span>
            </div>
          ) : !hasDelivery ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Truck size={28} className="text-gray-400" />
              </div>
              <h3 className="font-bold text-[#2d0e17]">No Delivery Dispatched</h3>
              <p className="text-sm text-[#735751] mt-1">Use the "Dispatch" button to assign a delivery provider.</p>
            </div>
          ) : delivery && (
            <>
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider
                  ${delivery.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                    delivery.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                    delivery.status === 'failed' ? 'bg-red-100 text-red-800' :
                    delivery.status === 'in_transit' || delivery.status === 'picked_up' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'}
                `}>
                  {delivery.status === 'delivered' ? <CheckCircle2 size={16} /> :
                   delivery.status === 'in_transit' ? <Truck size={16} /> :
                   <Clock size={16} />}
                  {DELIVERY_STATUS_LABELS[delivery.status] || delivery.status}
                </div>
                <span className="text-xs font-mono text-[#916b61] bg-[#fdf8f5] px-2 py-1 rounded-lg border border-[#ebd8d0]">
                  {delivery.delivery_id}
                </span>
              </div>

              {/* Timeline */}
              {delivery.status !== 'cancelled' && delivery.status !== 'failed' && (
                <div className="relative pl-6 space-y-0 py-2">
                  {TIMELINE_STEPS.map((step, i) => {
                    const stepIdx = STATUS_ORDER[step.key]
                    const isCompleted = stepIdx <= currentStep
                    const isCurrent = stepIdx === currentStep
                    const Icon = step.icon

                    return (
                      <div key={step.key} className="relative flex items-center gap-3 min-h-[44px]">
                        {/* Vertical line */}
                        {i < TIMELINE_STEPS.length - 1 && (
                          <div className={`absolute left-[11px] top-[26px] w-0.5 h-[18px] ${
                            isCompleted && stepIdx < currentStep ? 'bg-emerald-400' : 'bg-gray-200'
                          }`} />
                        )}
                        {/* Dot */}
                        <div className={`
                          relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all
                          ${isCurrent ? 'bg-[#e76f51] ring-4 ring-[#e76f51]/20' :
                            isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}
                        `}>
                          <Icon size={12} className={isCompleted || isCurrent ? 'text-white' : 'text-gray-400'} />
                        </div>
                        {/* Label */}
                        <span className={`text-sm ${
                          isCurrent ? 'font-bold text-[#2d0e17]' :
                          isCompleted ? 'font-medium text-emerald-700' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Provider & Route Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#fdf8f5] rounded-xl p-3 border border-[#ebd8d0]">
                  <div className="text-[11px] font-bold text-[#916b61] uppercase tracking-wider mb-1">Provider</div>
                  <p className="text-sm font-bold text-[#2d0e17] capitalize">{delivery.provider}</p>
                  {delivery.delivery_fee > 0 && (
                    <p className="text-xs text-[#735751]">Fee: ₹{delivery.delivery_fee}</p>
                  )}
                </div>
                <div className="bg-[#fdf8f5] rounded-xl p-3 border border-[#ebd8d0]">
                  <div className="text-[11px] font-bold text-[#916b61] uppercase tracking-wider mb-1">Destination</div>
                  <p className="text-xs text-[#2d0e17] font-medium leading-relaxed">{delivery.delivery_address}</p>
                </div>
              </div>

              {/* Rider Info */}
              {(delivery.rider_name || delivery.rider_phone) && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">Assigned Rider</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={18} className="text-blue-600" />
                      </div>
                      <div>
                        {delivery.rider_name && <p className="text-sm font-bold text-[#2d0e17]">{delivery.rider_name}</p>}
                        {delivery.rider_phone && (
                          <p className="flex items-center gap-1 text-xs text-[#735751]">
                            <Phone size={11} /> {delivery.rider_phone}
                          </p>
                        )}
                      </div>
                    </div>
                    {delivery.rider_phone && (
                      <a
                        href={`tel:${delivery.rider_phone}`}
                        className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold hover:bg-blue-200 transition-colors"
                      >
                        Call
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Tracking URL */}
              {delivery.tracking_url && (
                <a
                  href={delivery.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#ebd8d0] text-sm font-semibold text-[#e76f51] hover:bg-[#fdf2ee] transition-colors"
                >
                  <ExternalLink size={14} />
                  Open Live Tracking
                </a>
              )}

              {/* Timestamps */}
              <div className="flex items-center justify-between text-[11px] text-[#916b61]">
                <span>Dispatched: {delivery.created_at}</span>
                <span>Updated: {delivery.updated_at}</span>
              </div>

              {/* Manual Status Update (for manual/self deliveries) */}
              {delivery.provider === 'manual' && !isTerminal && (
                <div>
                  <button
                    onClick={() => setShowManualUpdate(!showManualUpdate)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#735751] hover:text-[#2d0e17] transition-colors"
                  >
                    <ChevronDown size={14} className={showManualUpdate ? 'rotate-180 transition-transform' : 'transition-transform'} />
                    Update Status Manually
                  </button>
                  {showManualUpdate && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {['picked_up', 'in_transit', 'delivered'].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleManualStatusUpdate(s)}
                          disabled={updatingStatus}
                          className={`
                            px-2.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all
                            ${s === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' :
                              'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}
                            disabled:opacity-50
                          `}
                        >
                          {updatingStatus ? <Loader2 size={12} className="animate-spin mx-auto" /> : DELIVERY_STATUS_LABELS[s]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <XCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Cancel Button */}
              {!isTerminal && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 text-sm font-semibold hover:bg-rose-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <><Loader2 size={14} className="animate-spin" /> Cancelling...</>
                  ) : (
                    <><XCircle size={14} /> Cancel Delivery</>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
