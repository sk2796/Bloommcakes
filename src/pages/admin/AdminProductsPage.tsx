import { useEffect, useState } from 'react'
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Star, 
  X, 
  AlertCircle,
  Cake
} from 'lucide-react'
import { adminService } from '@/features/admin/adminService'
import { AdminProduct, AdminProductPayload } from '@/features/admin/types'

const CATEGORIES = [
  { value: 'cakes', label: 'Cakes', prefix: 'CAKE' },
  { value: 'muffins', label: 'Muffins', prefix: 'MUF' },
  { value: 'cupcakes', label: 'Cupcakes', prefix: 'CUP' },
  { value: 'pastries', label: 'Pastries', prefix: 'PAS' },
  { value: 'brownies', label: 'Brownies', prefix: 'BRW' },
  { value: 'fruit-pies', label: 'Fruit Pies', prefix: 'PIE' },
  { value: 'cookies', label: 'Cookies', prefix: 'COK' },
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [formData, setFormData] = useState<AdminProductPayload>({
    name: '',
    category: 'cakes',
    price: 499,
    description: '',
    imageUrl: '',
    isBestseller: false,
    rating: 4.8
  })
  const [isSaving, setIsSaving] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)

  // Live auto-generation preview calculations
  const previewSlug = formData.name
    ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : 'product-slug'

  const selectedCategoryPrefix = CATEGORIES.find(c => c.value === formData.category)?.prefix || 'PROD'
  const nameWords = formData.name ? formData.name.toUpperCase().replace(/[^A-Z0-9\s]/g, '').split(/\s+/).slice(0, 4).join('-') : 'NAME'
  const previewId = `BC-${selectedCategoryPrefix}-${nameWords || 'ITEM'}`

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await adminService.getProducts()
      setProducts(data)
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleOpenAdd = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      category: 'cakes',
      price: 499,
      description: '',
      imageUrl: '',
      isBestseller: false,
      rating: 4.8
    })
    setModalError(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (prod: AdminProduct) => {
    setEditingProduct(prod)
    setFormData({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      description: prod.description || '',
      imageUrl: prod.imageUrl,
      isBestseller: prod.isBestseller || false,
      rating: prod.rating || 4.8
    })
    setModalError(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the product catalog?`)) return
    try {
      await adminService.deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err: any) {
      alert(err.message || 'Failed to delete product')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setModalError('Please enter a product name.')
      return
    }
    if (!formData.imageUrl.trim()) {
      setModalError('Please provide a valid product image URL.')
      return
    }

    setIsSaving(true)
    setModalError(null)

    try {
      if (editingProduct) {
        const updated = await adminService.updateProduct(editingProduct.id, formData)
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p))
      } else {
        const created = await adminService.createProduct(formData)
        setProducts(prev => [created, ...prev])
      }
      setIsModalOpen(false)
    } catch (err: any) {
      setModalError(err.message || 'An error occurred while saving.')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.id.toLowerCase().includes(search.toLowerCase()) ||
                          p.slug.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCat
  })

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d0e17] tracking-tight">
            Menu & Products Catalog
          </h1>
          <p className="text-sm text-[#735751] mt-1">
            Create, update, or retire cakes and pastries. IDs and slugs are generated automatically.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e76f51] to-[#f4a261] text-white font-semibold text-sm shadow-lg shadow-[#e76f51]/30 hover:opacity-95 transition-all self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#ebd8d0] shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#916b61]" />
          <input
            type="text"
            placeholder="Search by name, ID, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] bg-[#fdfaf8]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#4a1525] text-white'
                : 'bg-[#fdfaf8] text-[#735751] hover:bg-[#faeee8] border border-[#e5d5cf]'
            }`}
          >
            All Items ({products.length})
          </button>
          {CATEGORIES.map(c => {
            const count = products.filter(p => p.category === c.value).length
            return (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === c.value
                    ? 'bg-[#4a1525] text-white'
                    : 'bg-[#fdfaf8] text-[#735751] hover:bg-[#faeee8] border border-[#e5d5cf]'
                }`}
              >
                {c.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Product List Table / Grid */}
      {loading ? (
        <div className="p-16 text-center text-[#916b61]">
          <div className="w-8 h-8 border-4 border-[#e76f51] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading products catalog...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ebd8d0] p-12 text-center">
          <Cake size={40} className="mx-auto text-[#e5d5cf] mb-3" />
          <h3 className="text-base font-bold text-[#2d0e17]">No products found</h3>
          <p className="text-xs text-[#735751] mt-1">Try changing your search terms or add a new item.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#ebd8d0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fdf8f5] text-[11px] uppercase tracking-wider font-semibold text-[#916b61] border-b border-[#ebd8d0]">
                  <th className="p-4">Product Info</th>
                  <th className="p-4">Meaningful ID & Slug</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebd8d0]/60 text-sm">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#fffcfb] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#ebd8d0] bg-[#faeee8]"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                        <div>
                          <div className="font-bold text-[#2d0e17]">{p.name}</div>
                          <div className="text-xs text-[#735751] max-w-xs truncate mt-0.5">
                            {p.description || 'No description provided'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-mono text-xs font-bold text-[#2d0e17] bg-[#fdf2ee] px-2 py-0.5 rounded border border-[#ebd8d0] inline-block">
                        {p.id}
                      </div>
                      <div className="font-mono text-[11px] text-[#916b61] mt-1">
                        /{p.slug}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="capitalize text-xs font-semibold px-2.5 py-1 rounded-full bg-[#faeee8] text-[#4a1525]">
                        {p.category}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-[#2d0e17]">₹{p.price}</span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>{p.rating || 4.8}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      {p.isBestseller ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <Sparkles size={11} /> Bestseller
                        </span>
                      ) : (
                        <span className="text-xs text-[#916b61]">Standard</span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 rounded-lg text-[#735751] hover:text-[#2d0e17] hover:bg-[#faeee8] transition-colors"
                        title="Edit Product"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-2 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
                        title="Delete Product"
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#ebd8d0] shadow-2xl max-w-2xl w-full my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#ebd8d0] bg-[#fdf8f5] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#2d0e17]">
                  {editingProduct ? 'Edit Product Item' : 'Add New Cake / Product'}
                </h3>
                <p className="text-xs text-[#735751] mt-0.5">
                  ID and URL slug are generated automatically from product name and category.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[#735751] hover:bg-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {modalError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Auto-Generation Live Visual Helper Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#fff7f2] to-[#fef2eb] border border-[#f5cfbd]">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#b84d28] mb-2">
                  <Sparkles size={14} /> SaaS Auto-Generated Metadata
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#895d52]">Generated Product ID:</span>
                    <div className="font-mono font-bold text-[#2d0e17] bg-white/80 px-2.5 py-1.5 rounded-lg border border-[#f5cfbd] mt-1 truncate">
                      {editingProduct ? editingProduct.id : previewId}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#895d52]">SEO Friendly URL Slug:</span>
                    <div className="font-mono font-bold text-[#2d0e17] bg-white/80 px-2.5 py-1.5 rounded-lg border border-[#f5cfbd] mt-1 truncate">
                      /{previewSlug}
                    </div>
                  </div>
                </div>
              </div>

              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2d0e17] uppercase tracking-wider mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Belgian Truffle Delight"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2d0e17] uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] text-sm bg-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2d0e17] uppercase tracking-wider mb-1.5">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2d0e17] uppercase tracking-wider mb-1.5">
                    Initial Customer Rating (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5.0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] text-sm"
                  />
                </div>
              </div>

              {/* Image URL & Preview */}
              <div>
                <label className="block text-xs font-bold text-[#2d0e17] uppercase tracking-wider mb-1.5">
                  Image URL *
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] text-sm font-mono text-xs"
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-11 h-11 rounded-xl object-cover border border-[#ebd8d0] shadow-sm shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none'
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#2d0e17] uppercase tracking-wider mb-1.5">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Ingredients, cake layers, flavor profile, and decorations..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5d5cf] focus:outline-none focus:ring-2 focus:ring-[#e76f51] text-sm"
                />
              </div>

              {/* Bestseller Checkbox */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#fdfaf8] border border-[#e5d5cf]">
                <input
                  type="checkbox"
                  id="bestseller-checkbox"
                  checked={formData.isBestseller}
                  onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                  className="w-4 h-4 text-[#e76f51] rounded border-[#e5d5cf] focus:ring-[#e76f51]"
                />
                <label htmlFor="bestseller-checkbox" className="text-xs font-semibold text-[#2d0e17] cursor-pointer">
                  Feature as Bestseller on homepage & banner highlights
                </label>
              </div>

              {/* Action Buttons */}
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
                  {isSaving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
