import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getUsers,
  getSelections,
  getInterests,
  getRecommendations,
  getFriends,
  getAvailableInterests
} from '../api/api.js'

// Mock global fetch
const mockFetch = vi.fn()
globalThis.fetch = mockFetch

describe('API Load Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getUsers', () => {
    it('should load users successfully', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@test.com', name: 'User 1' },
        { id: '2', email: 'user2@test.com', name: 'User 2' }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsers)
      })

      const result = await getUsers()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/users')
      expect(result).toEqual(mockUsers)
      expect(result.length).toBe(2)
    })

    it('should return empty array on error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      })

      const result = await getUsers()

      expect(result).toEqual([])
    })
  })

  describe('getSelections', () => {
    it('should load selections for a user', async () => {
      const userEmail = 'test@example.com'
      const mockSelections = [
        { id: '1', userEmail, destination: 'Paris', status: 'completed' },
        { id: '2', userEmail, destination: 'Tokyo', status: 'upcoming' }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSelections)
      })

      const result = await getSelections(userEmail)

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:3001/selections?userEmail=${encodeURIComponent(userEmail)}`
      )
      expect(result).toEqual(mockSelections)
      expect(result.length).toBe(2)
    })

    it('should return empty array on error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      })

      const result = await getSelections('test@example.com')

      expect(result).toEqual([])
    })
  })

  describe('getInterests', () => {
    it('should load interests for a user', async () => {
      const userEmail = 'test@example.com'
      const mockInterests = [
        { id: '1', userEmail, name: 'Beach' },
        { id: '2', userEmail, name: 'Mountains' }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInterests)
      })

      const result = await getInterests(userEmail)

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:3001/interests?userEmail=${encodeURIComponent(userEmail)}`
      )
      expect(result).toEqual(mockInterests)
    })

    it('should return empty array on error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      })

      const result = await getInterests('test@example.com')

      expect(result).toEqual([])
    })
  })

  describe('getRecommendations', () => {
    it('should load recommendations for a user', async () => {
      const userEmail = 'test@example.com'
      const mockRecommendations = [
        { id: '1', destination: 'Bali', reason: 'Beach lover' },
        { id: '2', destination: 'Swiss Alps', reason: 'Mountain enthusiast' }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecommendations)
      })

      const result = await getRecommendations(userEmail)

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:3001/recommendations?userEmail=${encodeURIComponent(userEmail)}`
      )
      expect(result).toEqual(mockRecommendations)
    })

    it('should load all recommendations when no email provided', async () => {
      const mockRecommendations = [{ id: '1', destination: 'Bali' }]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecommendations)
      })

      const result = await getRecommendations()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/recommendations')
      expect(result).toEqual(mockRecommendations)
    })

    it('should return empty array on error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      })

      const result = await getRecommendations('test@example.com')

      expect(result).toEqual([])
    })
  })

  describe('getFriends', () => {
    it('should load friends for a user', async () => {
      const userEmail = 'test@example.com'
      const mockFriends = [
        { id: 'f1', name: 'Alice', email: 'alice@test.com' },
        { id: 'f2', name: 'Bob', email: 'bob@test.com' }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFriends)
      })

      const result = await getFriends(userEmail)

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:3001/friends?userEmail=${encodeURIComponent(userEmail)}`
      )
      expect(result).toEqual(mockFriends)
      expect(result.length).toBe(2)
    })

    it('should load all friends when no email provided', async () => {
      const mockFriends = [{ id: 'f1', name: 'Alice' }]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFriends)
      })

      const result = await getFriends()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/friends')
      expect(result).toEqual(mockFriends)
    })

    it('should return empty array on error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      })

      const result = await getFriends('test@example.com')

      expect(result).toEqual([])
    })
  })

  describe('getAvailableInterests', () => {
    it('should load available interests', async () => {
      const mockInterests = [
        { id: 'int1', name: 'Beach' },
        { id: 'int2', name: 'Mountains' },
        { id: 'int3', name: 'City Tours' }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInterests)
      })

      const result = await getAvailableInterests()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/availableInterests')
      expect(result).toEqual(mockInterests)
      expect(result.length).toBe(3)
    })

    it('should return empty array on error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      })

      const result = await getAvailableInterests()

      expect(result).toEqual([])
    })
  })

  describe('API Response Format', () => {
    it('should return data in expected format from getUsers', async () => {
      const mockUser = { id: '1', email: 'user@test.com', name: 'Test User', password: 'hash' }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockUser])
      })

      const result = await getUsers()

      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('email')
      expect(result[0]).toHaveProperty('name')
    })

    it('should return data in expected format from getSelections', async () => {
      const mockSelection = {
        id: '1',
        userEmail: 'test@example.com',
        destination: 'Paris',
        startDate: '2026-02-01',
        endDate: '2026-02-10',
        status: 'upcoming'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockSelection])
      })

      const result = await getSelections('test@example.com')

      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('destination')
      expect(result[0]).toHaveProperty('status')
    })
  })
})
