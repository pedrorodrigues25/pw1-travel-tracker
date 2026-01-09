import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSelectionsStore } from '../stores/selections'

const router = useRouter()
const auth = useAuthStore()
const selections = useSelectionsStore()

const user = auth.user

const options = [
  'Lisboa, Portugal',
  'Porto, Portugal',
  'Funchal, Madeira',
  'Faro, Algarve',
  'Braga, Portugal',
]

const form = reactive({ destination: '', notes: '' })

const editing = ref(false)
const editId = ref(null)
const editForm = reactive({ destination: '', notes: '' })

// Computar o percentual de progresso (0-100%)
const progressPercentage = ref(0)

watch(
  () => selections.count,
  (count) => {
    progressPercentage.value = (count % 10) * 10
  },
  { immediate: true }
)

function ensureLoaded() {
  if (user && user.email) selections.load(user.email)
}

ensureLoaded()

watch(
  () => auth.user && auth.user.email,
  (val) => {
    if (val) selections.load(val)
  },
)

function addSelection() {
  if (!user || !user.email) return alert('Faz login primeiro')
  selections.add({ destination: form.destination, notes: form.notes }, user.email)
  form.destination = ''
  form.notes = ''
}

function startEdit(item) {
  editing.value = true
  editId.value = item.id
  editForm.destination = item.destination
  editForm.notes = item.notes || ''
}

function confirmEdit() {
  if (!editId.value) return
  selections.update(
    editId.value,
    { destination: editForm.destination, notes: editForm.notes },
    user.email,
  )
  cancelEdit()
}

function cancelEdit() {
  editing.value = false
  editId.value = null
  editForm.destination = ''
  editForm.notes = ''
}

async function remove(id) {
  if (!confirm('Apagar esta escolha?')) return
  const deleted = await selections.remove(id)
  if (!deleted) alert('Não foi possível apagar a viagem. Tenta novamente.')
}

function logout() {
  auth.logout()
  router.push('/login')
}

// save on unload (just in case)
window.addEventListener('beforeunload', () => {
  if (user && user.email) selections.save(user.email)
})

export {
  router,
  auth,
  selections,
  user,
  options,
  form,
  editing,
  editId,
  editForm,
  progressPercentage,
  addSelection,
  startEdit,
  confirmEdit,
  cancelEdit,
  remove,
  logout
}
