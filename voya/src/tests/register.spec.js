import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RegisterForm from '../components/RegisterForm.vue'
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

describe('RegisterForm.vue', () => {
  let wrapper

  beforeEach(() => {
    // Create a new Pinia instance for each test
    setActivePinia(createPinia())

    // Mount the component before each test
    wrapper = mount(RegisterForm, {
      global: {
        stubs: {
          RouterLink: true
        }
      }
    })

    // Reset mocks before each test
    mockRouter.push.mockClear()
  })

  it('renders the register form correctly', () => {
    expect(wrapper.find('p.auth-title').text()).toBe('Create an account')
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.findAll('input[type="password"]').length).toBe(2) // password + confirm password
    expect(wrapper.find('input[type="text"]').exists()).toBe(true) // username
    expect(wrapper.find('button.login-btn').text()).toBe('Continue')
  })

  it('shows an error message if email is not provided', async () => {
    await wrapper.find('button.login-btn').trigger('click')
    expect(wrapper.find('.error-message').text()).toBe('Escreve um email')
  })

  it('shows an error message if password is not provided', async () => {
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('button.login-btn').trigger('click')
    expect(wrapper.find('.error-message').text()).toBe('Escreve uma password')
  })

  it('shows an error message if passwords do not match', async () => {
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    const passwordInputs = wrapper.findAll('input[type="password"]')
    await passwordInputs[0].setValue('password123')
    await passwordInputs[1].setValue('differentpassword')
    await wrapper.find('button.login-btn').trigger('click')
    expect(wrapper.find('.error-message').text()).toBe('As passwords não coincidem')
  })

  it('shows an error message if username is not provided', async () => {
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    const passwordInputs = wrapper.findAll('input[type="password"]')
    await passwordInputs[0].setValue('password123')
    await passwordInputs[1].setValue('password123')
    await wrapper.find('button.login-btn').trigger('click')
    expect(wrapper.find('.error-message').text()).toBe('Escreve um username')
  })

  it('calls the register action and redirects on successful registration', async () => {
    const authStore = useAuthStore()
    // Mock the register and login actions
    authStore.register = vi.fn().mockResolvedValue(true)
    authStore.login = vi.fn().mockResolvedValue(true)

    await wrapper.find('input[type="email"]').setValue('newuser@example.com')
    const passwordInputs = wrapper.findAll('input[type="password"]')
    await passwordInputs[0].setValue('password123')
    await passwordInputs[1].setValue('password123')
    await wrapper.find('input[type="text"]').setValue('newusername')
    await wrapper.find('button.login-btn').trigger('click')

    // Check if the register action was called with correct parameters
    expect(authStore.register).toHaveBeenCalledWith('newuser@example.com', 'password123', 'newusername')

    // Wait for all promises to resolve
    await flushPromises()

    // Check if login was called after registration
    expect(authStore.login).toHaveBeenCalledWith('newuser@example.com', 'password123')

    // Check if the router was called to redirect to interests page
    expect(mockRouter.push).toHaveBeenCalledWith('/interests')
  })

  it('shows an error message when registration fails due to existing email', async () => {
    const authStore = useAuthStore()
    const errorMessage = 'Email já registado'
    // Mock the register action to simulate a failed registration
    authStore.register = vi.fn().mockRejectedValue(new Error(errorMessage))

    await wrapper.find('input[type="email"]').setValue('existing@example.com')
    const passwordInputs = wrapper.findAll('input[type="password"]')
    await passwordInputs[0].setValue('password123')
    await passwordInputs[1].setValue('password123')
    await wrapper.find('input[type="text"]').setValue('existinguser')
    await wrapper.find('button.login-btn').trigger('click')

    // Wait for all promises to resolve
    await flushPromises()

    // Check if the error message is displayed
    expect(wrapper.find('.error-message').text()).toBe(errorMessage)
    // Ensure no redirection happened
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('shows an error message when registration fails due to existing username', async () => {
    const authStore = useAuthStore()
    const errorMessage = 'Username já existe'
    // Mock the register action to simulate a failed registration
    authStore.register = vi.fn().mockRejectedValue(new Error(errorMessage))

    await wrapper.find('input[type="email"]').setValue('new@example.com')
    const passwordInputs = wrapper.findAll('input[type="password"]')
    await passwordInputs[0].setValue('password123')
    await passwordInputs[1].setValue('password123')
    await wrapper.find('input[type="text"]').setValue('existingusername')
    await wrapper.find('button.login-btn').trigger('click')

    // Wait for all promises to resolve
    await flushPromises()

    // Check if the error message is displayed
    expect(wrapper.find('.error-message').text()).toBe(errorMessage)
    // Ensure no redirection happened
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('clears form fields after successful registration', async () => {
    const authStore = useAuthStore()
    authStore.register = vi.fn().mockResolvedValue(true)
    authStore.login = vi.fn().mockResolvedValue(true)

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInputs = wrapper.findAll('input[type="password"]')
    const usernameInput = wrapper.find('input[type="text"]')

    await emailInput.setValue('newuser@example.com')
    await passwordInputs[0].setValue('password123')
    await passwordInputs[1].setValue('password123')
    await usernameInput.setValue('newusername')
    await wrapper.find('button.login-btn').trigger('click')

    await flushPromises()

    // Check that the form fields are cleared
    expect(emailInput.element.value).toBe('')
    expect(passwordInputs[0].element.value).toBe('')
    expect(passwordInputs[1].element.value).toBe('')
    expect(usernameInput.element.value).toBe('')
  })
})
