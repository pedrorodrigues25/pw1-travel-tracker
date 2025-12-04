import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const username = ref('')
const errorMessage = ref('')

function submit() {
  errorMessage.value = ''
  
  if (!email.value) {
    errorMessage.value = 'Escreve um email'
    return
  }
  
  if (!password.value) {
    errorMessage.value = 'Escreve uma password'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'As passwords não coincidem'
    return
  }
  
  if (!username.value) {
    errorMessage.value = 'Escreve um username'
    return
  }

  try {
    auth.register(email.value, password.value, username.value)
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    username.value = ''
    router.push('/login')
  } catch (error) {
    errorMessage.value = error.message
  }
}

export { email, password, confirmPassword, username, errorMessage, submit }
