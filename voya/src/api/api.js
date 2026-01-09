// Atualiza um utilizador existente (PATCH)
async function updateUser(id, updatedFields) {
  try {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields),
    })
    if (!res.ok) throw new Error('Erro ao atualizar utilizador')
    return await res.json()
  } catch (e) {
    console.error('Erro ao atualizar utilizador:', e)
    return null
  }
}
// API para manipular utilizadores via json-server
const API_BASE = 'http://localhost:3001'

// USERS
async function getUsers() {
  try {
    const res = await fetch(`${API_BASE}/users`)
    if (!res.ok) throw new Error('Erro ao obter utilizadores')
    return await res.json()
  } catch (e) {
    console.error('Erro ao ler utilizadores:', e)
    return []
  }
}

async function saveUser(newUser) {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
    if (!res.ok) throw new Error('Erro ao guardar utilizador')
    return await res.json()
  } catch (e) {
    console.error('Erro ao guardar utilizador:', e)
    return null
  }
}

// SELECTIONS (viagens)
async function getSelections(userEmail) {
  try {
    const res = await fetch(`${API_BASE}/selections?userEmail=${encodeURIComponent(userEmail)}`)
    if (!res.ok) throw new Error('Erro ao obter viagens')
    return await res.json()
  } catch (e) {
    console.error('Erro ao ler viagens:', e)
    return []
  }
}

async function saveSelection(selection) {
  try {
    const res = await fetch(`${API_BASE}/selections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selection),
    })
    if (!res.ok) throw new Error('Erro ao guardar viagem')
    return await res.json()
  } catch (e) {
    console.error('Erro ao guardar viagem:', e)
    return null
  }
}

async function deleteSelection(id) {
  try {
    const res = await fetch(`${API_BASE}/selections/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Erro ao apagar viagem')
    return true
  } catch (e) {
    console.error('Erro ao apagar viagem:', e)
    return false
  }
}

// INTERESTS
async function getInterests(userEmail) {
  try {
    const res = await fetch(`${API_BASE}/interests?userEmail=${encodeURIComponent(userEmail)}`)
    if (!res.ok) throw new Error('Erro ao obter interesses')
    return await res.json()
  } catch (e) {
    console.error('Erro ao ler interesses:', e)
    return []
  }
}

// RECOMMENDATIONS
async function getRecommendations(userEmail) {
  try {
    const query = userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : ''
    const res = await fetch(`${API_BASE}/recommendations${query}`)
    if (!res.ok) throw new Error('Erro ao obter recomendações')
    return await res.json()
  } catch (e) {
    console.error('Erro ao ler recomendações:', e)
    return []
  }
}

// FRIENDS
async function getFriends(userEmail) {
  try {
    const query = userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : ''
    const res = await fetch(`${API_BASE}/friends${query}`)
    if (!res.ok) throw new Error('Erro ao obter amigos')
    return await res.json()
  } catch (e) {
    console.error('Erro ao ler amigos:', e)
    return []
  }
}

async function saveInterest(interest) {
  try {
    const res = await fetch(`${API_BASE}/interests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(interest),
    })
    if (!res.ok) throw new Error('Erro ao guardar interesse')
    return await res.json()
  } catch (e) {
    console.error('Erro ao guardar interesse:', e)
    return null
  }
}

export {
  getUsers,
  saveUser,
  updateUser,
  getSelections,
  saveSelection,
  deleteSelection,
  getInterests,
  saveInterest,
  getRecommendations,
  getFriends,
}
