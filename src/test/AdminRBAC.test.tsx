import { describe, it, expect } from 'vitest'
import { useAdminAuthStore } from '../features/admin/store/useAdminAuthStore'

describe('Admin RBAC & Security Store', () => {
  it('allows Super Admin access to all modules', () => {
    useAdminAuthStore.getState().login(
      {
        admin_id: 'BC-SA-001',
        name: 'Super Admin User',
        email: 'super@bloomcakes.co',
        role: 'super_admin',
        is_active: true
      },
      'test-token'
    )

    const store = useAdminAuthStore.getState()
    expect(store.hasPermission('analytics')).toBe(true)
    expect(store.hasPermission('products')).toBe(true)
    expect(store.hasPermission('orders')).toBe(true)
    expect(store.hasPermission('customers')).toBe(true)
    expect(store.hasPermission('pincodes')).toBe(true)
    expect(store.hasPermission('users')).toBe(true)
  })

  it('restricts Delivery Staff exclusively to orders module', () => {
    useAdminAuthStore.getState().login(
      {
        admin_id: 'BC-DEL-002',
        name: 'Delivery Person',
        email: 'delivery@bloomcakes.co',
        role: 'delivery_staff',
        is_active: true
      },
      'test-token'
    )

    const store = useAdminAuthStore.getState()
    expect(store.hasPermission('orders')).toBe(true)
    expect(store.hasPermission('analytics')).toBe(false)
    expect(store.hasPermission('products')).toBe(false)
    expect(store.hasPermission('customers')).toBe(false)
    expect(store.hasPermission('pincodes')).toBe(false)
    expect(store.hasPermission('users')).toBe(false)
  })

  it('restricts Catalog Editor exclusively to products module', () => {
    useAdminAuthStore.getState().login(
      {
        admin_id: 'BC-CAT-003',
        name: 'Menu Editor',
        email: 'editor@bloomcakes.co',
        role: 'catalog_editor',
        is_active: true
      },
      'test-token'
    )

    const store = useAdminAuthStore.getState()
    expect(store.hasPermission('products')).toBe(true)
    expect(store.hasPermission('orders')).toBe(false)
    expect(store.hasPermission('users')).toBe(false)
  })

  it('clears session on logout', () => {
    useAdminAuthStore.getState().logout()
    const store = useAdminAuthStore.getState()
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.hasPermission('orders')).toBe(false)
  })
})
