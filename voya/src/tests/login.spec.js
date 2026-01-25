import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LoginForm from '../components/LoginForm.vue'
import { useAuthStore } from '../stores/auth'

// Mock the router
const mockRouter = {
  push: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  RouterLink: {
    template: '<a><slot /></a>',
    props: ['to']
  }
}))

// Mock the selections store
vi.mock('../stores/selections', () => ({
  useSelectionsStore: () => ({
    load: vi.fn().mockResolvedValue(true)
  })
}))

describe('LoginForm.vue', () => {
  let wrapper

  beforeEach(() => {
    // Create a new Pinia instance for each test
    setActivePinia(createPinia())

    // Mount the component before each test
    wrapper = mount(LoginForm, {
      global: {
        stubs: {
          RouterLink: true
        }
      }
    })

    // Reset mocks before each test
    mockRouter.push.mockClear()
  })

  it('renders the login form correctly', () => {
    expect(wrapper.find('p.auth-title').text()).toBe('Login to your account')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button.login-btn').text()).toBe('Login')
  })

  it('shows an error message if email is not provided', async () => {
    await wrapper.find('button.login-btn').trigger('click')
    expect(wrapper.find('.error-message').text()).toBe('Escreve um email')
  })

  it('shows an error message if password is not provided', async () => {
    await wrapper.find('input[type="text"]').setValue('test@test.com')
    await wrapper.find('button.login-btn').trigger('click')
    expect(wrapper.find('.error-message').text()).toBe('Escreve uma password')
  })

  it('calls the login action and redirects on successful login', async () => {
    const authStore = useAuthStore()
    // Mock the login action to simulate a successful login
    authStore.login = vi.fn().mockResolvedValue(true)

    await wrapper.find('input[type="text"]').setValue('user@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('button.login-btn').trigger('click')

    // Check if the login action was called
    expect(authStore.login).toHaveBeenCalledWith('user@example.com', 'password123')

    // Wait for all promises to resolve
    await flushPromises()

    // Check if the router was called to redirect
    expect(mockRouter.push).toHaveBeenCalledWith('/homepage')
  })

  it('shows an error message on failed login', async () => {
    const authStore = useAuthStore()
    const errorMessage = 'Invalid credentials'
    // Mock the login action to simulate a failed login
    authStore.login = vi.fn().mockRejectedValue(new Error(errorMessage))

    await wrapper.find('input[type="text"]').setValue('user@example.com')
    await wrapper.find('input[type="password"]').setValue('wrongpassword')
    await wrapper.find('button.login-btn').trigger('click')

    // Check if the login action was called
    expect(authStore.login).toHaveBeenCalledWith('user@example.com', 'wrongpassword')

    // Wait for all promises to resolve
    await flushPromises()

    // Check if the error message is displayed
    expect(wrapper.find('.error-message').text()).toBe(errorMessage)
    // Ensure no redirection happened
    expect(mockRouter.push).not.toHaveBeenCalled()
  })
})

