import { useEffect, useState } from 'react'
import { MapPin, Plus, Trash2, Search, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { adminService } from '@/features/admin/adminService'
import { AdminPincode } from '@/features/admin/types'

export default function AdminPincodesPage() {
  const [pincodes, setPincodes] = useState<AdminPincode[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Add modal / form state
  const [newPin, setNewPin] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newState, setNewState] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const fetchPincodes = async () => {
    setLoading(true)
    try {
      const data = await adminService.getPincodes()
      setPincodes(data)
    } catch (err) {
      console.error('Failed to load pincodes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPincodes()
  }, [])

  const handleAddPincode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPin.trim() || !newCity.trim() || !newState.trim()) {
      setFormError('Please fill out all fields (Pincode, City, State).')
      return
    }

    setIsAdding(true)
    setFormError(null)
    setFormSuccess(null)

    try {
      await adminService.addPincode(newPin.trim(), newCity.trim(), newState.trim())
      setFormSuccess(`Pincode ${newPin} added to serviceable delivery zones.`)
      setNewPin('')
      setNewCity('')
      setNewState('')
      fetchPincodes()
    } catch (err: any) {
      setFormError(err.message || 'Failed to add pincode.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async (pin: string) => {
    if (!window.confirm(`Are you sure you want to remove pincode ${pin} from delivery zones?`)) return
    try {
      await adminService.deletePincode(pin)
      setPincodes(prev => prev.filter(p => p.pincode !== pin))
    } catch (err: any) {
      alert(err.message || 'Failed to remove pincode')
    }
  }

  const filteredPincodes = pincodes.filter(p => 
    p.pincode.includes(search) || 
    p.city.toLowerCase().includes(search.toLowerCase()) ||
    p.state.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d0e17] tracking-tight">
            Serviceable Delivery Zones
          </h1>
          <p className="text-sm text-[#735751] mt-1">
            Manage pincodes and cities where BloomCakes offers doorstep delivery.
          </p>
        </div>

        <button
          onClick={fetchPincodes}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e5d5cf] text-[#2d0e17] text-sm font-medium hover:bg-[#faeee8] transition-colors shadow-sm disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Zones</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Pincode Card */}
        <div className="bg-white rounded-2xl border border-[#ebd8d0] p-6 shadow-sm h-fit">
          <h2 className="font-bold text-base text-[#2d0e17] flex items-center gap-2 mb-1">
            <Plus size={18} className="text-[#e76f51]" /> Add Serviceable Area
          </h2>
          <p className="text-xs text-[#735751] mb-5">
            Allow customers in new postal codes to checkout and receive deliveries.
          </p>

          <form onSubmit={handleAddPincode} className="space-y-4 text-xs">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{formError}</span>
              </div>
            )}
            {formSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>{formSuccess}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-[#2d0e17] uppercase tracking-wider mb-1">
                6-Digit Postal Pincode *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="e.g. 560001"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2d0e17] uppercase tracking-wider mb-1">
                City *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bengaluru"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2d0e17] uppercase tracking-wider mb-1">
                State *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Karnataka"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e76f51] to-[#f4a261] text-white font-semibold shadow-md hover:opacity-95 transition-all disabled:opacity-50 text-sm mt-2"
            >
              {isAdding ? 'Adding...' : 'Add Delivery Pincode'}
            </button>
          </form>
        </div>

        {/* Existing Pincodes List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-[#ebd8d0] shadow-sm flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#916b61]" />
              <input
                type="text"
                placeholder="Search pincode, city, or state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] bg-[#fdfaf8]"
              />
            </div>
            <div className="text-xs font-semibold text-[#735751]">
              Total Active: <span className="text-[#2d0e17] font-bold">{pincodes.length}</span>
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center text-[#916b61] bg-white rounded-2xl border border-[#ebd8d0]">
              <div className="w-8 h-8 border-4 border-[#e76f51] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Loading delivery zones...
            </div>
          ) : filteredPincodes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#ebd8d0] p-12 text-center">
              <MapPin size={40} className="mx-auto text-[#e5d5cf] mb-3" />
              <h3 className="text-base font-bold text-[#2d0e17]">No delivery zones found</h3>
              <p className="text-xs text-[#735751] mt-1">Add pincodes using the form on the left.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#ebd8d0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#fdf8f5] text-[11px] uppercase tracking-wider font-semibold text-[#916b61] border-b border-[#ebd8d0]">
                      <th className="p-4">Postal Pincode</th>
                      <th className="p-4">City</th>
                      <th className="p-4">State</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebd8d0]/60">
                    {filteredPincodes.map((pin) => (
                      <tr key={pin.pincode} className="hover:bg-[#fffcfb] transition-colors">
                        <td className="p-4">
                          <span className="font-mono font-bold text-sm text-[#2d0e17] bg-[#fdf2ee] px-2.5 py-1 rounded-md border border-[#ebd8d0]">
                            {pin.pincode}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-[#2d0e17]">
                          {pin.city}
                        </td>
                        <td className="p-4 text-[#735751]">
                          {pin.state}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Active
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(pin.pincode)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-800 transition-colors"
                            title="Remove Pincode"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
