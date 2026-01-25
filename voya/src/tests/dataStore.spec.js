import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSelectionsStore } from '../stores/selections'
import { useAuthStore } from '../stores/auth'
import { useInterestsStore } from '../stores/interests'
import * as api from '../api/api'

describe('Selections Store - Data Storage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('stores selections data correctly after load', async () => {
    const mockData = [
      { id: '1', destination: 'Paris', status: 'upcoming', userEmail: 'test@user.com' },
      { id: '2', destination: 'Tokyo', status: 'completed', userEmail: 'test@user.com' }
    ]
    vi.spyOn(api, 'getSelections').mockResolvedValue(mockData)

    const store = useSelectionsStore()
    await store.load('test@user.com')

    // Verify data is stored in items (not selections)
    expect(store.items).toHaveLength(2)
    expect(store.items[0].destination).toBe('Paris')
    expect(store.items[1].destination).toBe('Tokyo')
    expect(store.count).toBe(2)
  })

  it('stores new selection when added', async () => {
    vi.spyOn(api, 'getSelections').mockResolvedValue([])
    vi.spyOn(api, 'saveSelection').mockResolvedValue({
      id: 'new-1',
      destination: 'London',
      status: 'upcoming',
      userEmail: 'test@user.com'
    })

    const store = useSelectionsStore()
    await store.load('test@user.com')

    const newSelection = { destination: 'London', status: 'upcoming' }
    await store.add(newSelection, 'test@user.com')

    expect(store.items).toHaveLength(1)
    expect(store.items[0].destination).toBe('London')
    expect(store.items[0].id).toBe('new-1')
  })

  it('updates selection data correctly', async () => {
    const mockData = [{ id: '1', destination: 'Paris', status: 'upcoming' }]
    vi.spyOn(api, 'getSelections').mockResolvedValue(mockData)
    vi.spyOn(api, 'updateSelection').mockResolvedValue({
      id: '1',
      destination: 'Paris',
      status: 'completed'
    })

    const store = useSelectionsStore()
    await store.load('test@user.com')

    await store.update('1', { status: 'completed' })

    expect(store.items[0].status).toBe('completed')
  })

  it('removes selection from store', async () => {
    const mockData = [
      { id: '1', destination: 'Paris', status: 'upcoming' },
      { id: '2', destination: 'Tokyo', status: 'upcoming' }
    ]
    vi.spyOn(api, 'getSelections').mockResolvedValue(mockData)
    vi.spyOn(api, 'deleteSelection').mockResolvedValue(true)

    const store = useSelectionsStore()
    await store.load('test@user.com')

    await store.remove('1')

    expect(store.items).toHaveLength(1)
    expect(store.items[0].destination).toBe('Tokyo')
  })

  it('clears all selections from store', async () => {
    const mockData = [{ id: '1', destination: 'Paris' }]
    vi.spyOn(api, 'getSelections').mockResolvedValue(mockData)

    const store = useSelectionsStore()
    await store.load('test@user.com')

    store.clear()

    expect(store.items).toHaveLength(0)
    expect(store.count).toBe(0)
  })

  it('handles empty email by clearing items', async () => {
    const store = useSelectionsStore()
    await store.load('')

    expect(store.items).toHaveLength(0)
  })
})

describe('Auth Store - Data Storage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('stores user data correctly after login', async () => {
    const mockUsers = [
      { id: '1', email: 'test@user.com', password: 'password123', username: 'testuser' }
    ]
    vi.spyOn(api, 'getUsers').mockResolvedValue(mockUsers)

    const store = useAuthStore()
    await store.login('test@user.com', 'password123')

    expect(store.user).not.toBeNull()
    expect(store.user.email).toBe('test@user.com')
    expect(store.user.username).toBe('testuser')
    expect(store.user.id).toBe('1')
  })

  it('stores new user data after registration', async () => {
    vi.spyOn(api, 'getUsers').mockResolvedValue([])
    vi.spyOn(api, 'saveUser').mockResolvedValue({
      id: 'new-user',
      email: 'newuser@test.com',
      password: 'pass123',
      username: 'newuser'
    })

    const store = useAuthStore()
    await store.register('newuser@test.com', 'pass123', 'newuser')

    expect(store.user).not.toBeNull()
    expect(store.user.email).toBe('newuser@test.com')
    expect(store.user.username).toBe('newuser')
  })

  it('throws error for invalid login credentials', async () => {
    const mockUsers = [
      { id: '1', email: 'test@user.com', password: 'correctpass', username: 'testuser' }
    ]
    vi.spyOn(api, 'getUsers').mockResolvedValue(mockUsers)

    const store = useAuthStore()

    await expect(store.login('test@user.com', 'wrongpass')).rejects.toThrow('Password incorreta')
  })

  it('throws error for unregistered email', async () => {
    vi.spyOn(api, 'getUsers').mockResolvedValue([])

    const store = useAuthStore()

    await expect(store.login('unknown@user.com', 'password')).rejects.toThrow('Email não registado')
  })
})

describe('Interests Store - Data Storage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('stores interests data correctly after load', async () => {
    const mockInterests = [
      { id: '1', interest: 'Beach', userEmail: 'test@user.com' },
      { id: '2', interest: 'Mountains', userEmail: 'test@user.com' }
    ]
    vi.spyOn(api, 'getInterests').mockResolvedValue(mockInterests)

    const store = useInterestsStore()
    await store.load('test@user.com')

    expect(store.items).toHaveLength(2)
    expect(store.items[0].interest).toBe('Beach')
    expect(store.items[1].interest).toBe('Mountains')
  })

  it('filters interests by user email', async () => {
    const mockInterests = [
      { id: '1', interest: 'Beach', userEmail: 'test@user.com' },
      { id: '2', interest: 'Mountains', userEmail: 'other@user.com' }
    ]
    vi.spyOn(api, 'getInterests').mockResolvedValue(mockInterests)

    const store = useInterestsStore()
    await store.load('test@user.com')

    expect(store.items).toHaveLength(1)
    expect(store.items[0].interest).toBe('Beach')
  })

  it('clears interests from store', async () => {
    const mockInterests = [{ id: '1', interest: 'Beach', userEmail: 'test@user.com' }]
    vi.spyOn(api, 'getInterests').mockResolvedValue(mockInterests)

    const store = useInterestsStore()
    await store.load('test@user.com')
    store.clear()

    expect(store.items).toHaveLength(0)
  })

  it('handles empty email by clearing items', async () => {
    const store = useInterestsStore()
    await store.load('')

    expect(store.items).toHaveLength(0)
  })
})
