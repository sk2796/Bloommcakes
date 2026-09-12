import { useEffect, useState, useMemo } from 'react'
import { 
  UserPlus, 
  Trash2, 
  Shield, 
  X, 
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { adminService } from '@/features/admin/adminService'
import { AdminUser, AdminUserPayload, AdminRole } from '@/features/admin/types'
import { AdminFilterBar } from '@/components/admin/AdminFilterBar'

const ROLES_INFO: Record<AdminRole, { label: string; desc: string; badgeColor: string }> = {
  super_admin: {
    label: 'Super Admin',
    desc: 'Unrestricted access to all modules including adding/removing staff users & granting roles.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  manager: {
    label: 'Store Manager',
    desc: 'Access to Analytics, Catalog, Orders Fulfillment, Customer Directory, and Delivery Pincodes.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  delivery_staff: {
    label: 'Delivery Staff',
    desc: 'Restricted exclusively to Orders fulfillment pipeline (view orders & update statuses).',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  catalog_editor: {
    label: 'Catalog Editor',
    desc: 'Restricted exclusively to Products & Menu (add new items, update prices & descriptions).',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name-asc')

  // Add modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<AdminUserPayload>({
    name: '',
    email: '',
    password: '',
    role: 'manager',
    is_active: true
  })
  const [isSaving, setIsSaving] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await adminService.getAdminUsers()
      setUsers(data)
    } catch (err) {
      console.error('Failed to load admin users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'manager',
      is_active: true
    })
    setModalError(null)
    setIsModalOpen(true)
  }

  const handleToggleActive = async (user: AdminUser) => {
    try {
      const updated = await adminService.updateAdminUser(user.admin_id, {
        is_active: !user.is_active
      })
      setUsers(prev => prev.map(u => u.admin_id === user.admin_id ? updated : u))
    } catch (err: any) {
      alert(err.message || 'Failed to update user status')
    }
  }

  const handleChangeRole = async (user: AdminUser, newRole: AdminRole) => {
    try {
      const updated = await adminService.updateAdminUser(user.admin_id, {
        role: newRole
      })
      setUsers(prev => prev.map(u => u.admin_id === user.admin_id ? updated : u))
    } catch (err: any) {
      alert(err.message || 'Failed to change role')
    }
  }

  const handleDelete = async (user: AdminUser) => {
    if (!window.confirm(`Are you sure you want to remove staff member "${user.name}"?`)) return
    try {
      await adminService.deleteAdminUser(user.admin_id)
      setUsers(prev => prev.filter(u => u.admin_id !== user.admin_id))
    } catch (err: any) {
      alert(err.message || 'Failed to delete staff user')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setModalError('Please fill out all required fields.')
      return
    }

    setIsSaving(true)
    setModalError(null)

    try {
      const created = await adminService.createAdminUser(formData)
      setUsers(prev => [...prev, created])
      setIsModalOpen(false)
    } catch (err: any) {
      setModalError(err.message || 'Failed to create staff member.')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = search.toLowerCase().trim()
      const matchesSearch = !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.admin_id.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)

      const matchesRole = roleFilter === 'all' || u.role === roleFilter
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? u.is_active : !u.is_active)

      return matchesSearch && matchesRole && matchesStatus
    }).sort((a, b) => {
      if (sortBy === 'role') return a.role.localeCompare(b.role)
      if (sortBy === 'status') return Number(b.is_active) - Number(a.is_active)
      return a.name.localeCompare(b.name)
    })
  }, [users, search, roleFilter, statusFilter, sortBy])

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d0e17] tracking-tight">
            Admin Staff & Access Control (RBAC)
          </h1>
          <p className="text-sm text-[#735751] mt-1">
            Invite team members, assign modular roles (Super Admin, Manager, Delivery Staff, Catalog Editor), and control permissions.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e5d5cf] text-[#2d0e17] text-sm font-medium hover:bg-[#faeee8] transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#e76f51] to-[#f4a261] text-white font-semibold text-sm shadow-lg shadow-[#e76f51]/30 hover:opacity-95 transition-all"
          >
            <UserPlus size={17} />
            <span>Add Staff User</span>
          </button>
        </div>
      </div>

      {/* Role Definitions Helper Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(ROLES_INFO) as AdminRole[]).map((r) => {
          const info = ROLES_INFO[r]
          return (
            <div key={r} className="p-4 bg-white rounded-2xl border border-[#ebd8d0] shadow-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${info.badgeColor}`}>
                  {info.label}
                </span>
                <Shield size={15} className="text-[#916b61]" />
              </div>
              <p className="text-xs text-[#735751] leading-relaxed pt-1">
                {info.desc}
              </p>
            </div>
          )
        })}
      </div>

      {/* Common Filter Toolbar */}
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search staff by name, email, role, or Admin ID..."
        totalCount={users.length}
        filteredCount={filteredUsers.length}
        dropdownFilters={[
          {
            id: 'role',
            label: 'Role Filter',
            value: roleFilter,
            onChange: setRoleFilter,
            options: [
              { label: 'All Roles', value: 'all' },
              { label: 'Super Admin', value: 'super_admin' },
              { label: 'Store Manager', value: 'manager' },
              { label: 'Delivery Staff', value: 'delivery_staff' },
              { label: 'Catalog Editor', value: 'catalog_editor' }
            ]
          },
          {
            id: 'status',
            label: 'Status Filter',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'All Statuses', value: 'all' },
              { label: 'Active Only', value: 'active' },
              { label: 'Suspended Only', value: 'suspended' }
            ]
          }
        ]}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Name (A - Z)', value: 'name-asc' },
          { label: 'Group by Role', value: 'role' },
          { label: 'Status (Active First)', value: 'status' }
        ]}
        onResetAll={() => {
          setSearch('')
          setRoleFilter('all')
          setStatusFilter('all')
          setSortBy('name-asc')
        }}
      />

      {/* Users Table */}
      {loading ? (
        <div className="p-16 text-center text-[#916b61] bg-white rounded-2xl border border-[#ebd8d0]">
          <div className="w-8 h-8 border-4 border-[#e76f51] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading staff users...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ebd8d0] p-12 text-center">
          <Shield size={40} className="mx-auto text-[#e5d5cf] mb-3" />
          <h3 className="text-base font-bold text-[#2d0e17]">No staff members found</h3>
          <p className="text-xs text-[#735751] mt-1">Add staff users using the button above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#ebd8d0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#fdf8f5] text-[11px] uppercase tracking-wider font-semibold text-[#916b61] border-b border-[#ebd8d0]">
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Staff ID</th>
                  <th className="p-4">Assigned Role & Access</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebd8d0]/60">
                {filteredUsers.map((u) => {
                  const roleConfig = ROLES_INFO[u.role as AdminRole] || {
                    label: u.role,
                    desc: '',
                    badgeColor: 'bg-gray-100 text-gray-800'
                  }

                  return (
                    <tr key={u.admin_id} className="hover:bg-[#fffcfb] transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-[#2d0e17]">{u.name}</div>
                        <div className="text-xs text-[#735751]">{u.email}</div>
                      </td>

                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-[#2d0e17] bg-[#fdf2ee] px-2.5 py-1 rounded border border-[#ebd8d0]">
                          {u.admin_id}
                        </span>
                      </td>

                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u, e.target.value as AdminRole)}
                          className={`text-xs font-bold px-3 py-1 rounded-xl border cursor-pointer ${roleConfig.badgeColor}`}
                        >
                          <option value="super_admin">Super Admin</option>
                          <option value="manager">Store Manager</option>
                          <option value="delivery_staff">Delivery Staff</option>
                          <option value="catalog_editor">Catalog Editor</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(u)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                            u.is_active 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          <span>{u.is_active ? 'Active' : 'Suspended'}</span>
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(u)}
                          className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-800 transition-colors"
                          title="Delete Staff Member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#ebd8d0] shadow-2xl max-w-lg w-full my-8 overflow-hidden">
            <div className="p-6 border-b border-[#ebd8d0] bg-[#fdf8f5] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#2d0e17]">
                  Add Staff Member
                </h3>
                <p className="text-xs text-[#735751] mt-0.5">
                  Assign user credentials and set role-based access permissions.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[#735751] hover:bg-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {modalError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#2d0e17] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2d0e17] uppercase tracking-wider mb-1.5">
                  Staff Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="priya@bloomcakes.co"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2d0e17] uppercase tracking-wider mb-1.5">
                  Temporary Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2d0e17] uppercase tracking-wider mb-1.5">
                  Role & Access Level *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] text-sm bg-white"
                >
                  <option value="super_admin">Super Admin (All permissions + Add Staff)</option>
                  <option value="manager">Store Manager (Overview, Menu, Orders, Customers, Pincodes)</option>
                  <option value="delivery_staff">Delivery Staff (Orders fulfillment pipeline only)</option>
                  <option value="catalog_editor">Catalog Editor (Menu & products catalog only)</option>
                </select>
                <p className="text-[11px] text-[#735751] mt-1.5">
                  {ROLES_INFO[formData.role]?.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#ebd8d0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#e5d5cf] text-[#735751] hover:bg-[#faeee8] text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#e76f51] to-[#f4a261] text-white text-sm font-semibold shadow-md hover:opacity-95 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Creating...' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
