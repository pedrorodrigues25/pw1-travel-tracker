import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSelectionsStore } from '../stores/selections'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
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

  try {
    auth.login(email.value, password.value)

    const selections = useSelectionsStore()
    selections.load(email.value.trim().toLowerCase())

    email.value = ''
    password.value = ''

    router.push('/destinations')
  } catch (error) {
    errorMessage.value = error.message
  }
}

export { email, password, errorMessage, submit }
