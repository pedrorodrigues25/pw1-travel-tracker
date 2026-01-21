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

async function updateSelection(id, updatedFields) {
  try {
    const res = await fetch(`${API_BASE}/selections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields),
    })
    if (!res.ok) throw new Error('Erro ao atualizar viagem')
    return await res.json()
  } catch (e) {
    console.error('Erro ao atualizar viagem:', e)
    return null
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

// USER FRIENDS (relações de amizade persistentes)
async function getUserFriends(userEmail) {
  try {
    // Buscar relações de amizade do utilizador
    const res = await fetch(`${API_BASE}/userFriends?userEmail=${encodeURIComponent(userEmail)}`)
    if (!res.ok) throw new Error('Erro ao obter amizades')
    const userFriends = await res.json()
    
    // Buscar detalhes de cada amigo
    const allFriends = await getFriends()
    const friendIds = userFriends.map(uf => uf.friendId)
    return allFriends.filter(f => friendIds.includes(f.id))
  } catch (e) {
    console.error('Erro ao ler amizades:', e)
    return []
  }
}

async function addUserFriend(userEmail, friendId) {
  try {
    const res = await fetch(`${API_BASE}/userFriends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, friendId })
    })
    if (!res.ok) throw new Error('Erro ao adicionar amigo')
    return await res.json()
  } catch (e) {
    console.error('Erro ao adicionar amigo:', e)
    return null
  }
}

async function removeUserFriend(userEmail, friendId) {
  try {
    // Primeiro encontrar a relação
    const res = await fetch(`${API_BASE}/userFriends?userEmail=${encodeURIComponent(userEmail)}&friendId=${encodeURIComponent(friendId)}`)
    const relations = await res.json()
    if (relations.length === 0) return false
    
    // Apagar a relação
    const deleteRes = await fetch(`${API_BASE}/userFriends/${relations[0].id}`, { method: 'DELETE' })
    return deleteRes.ok
  } catch (e) {
    console.error('Erro ao remover amigo:', e)
    return false
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

// AVAILABLE INTERESTS (global interests managed by admin)
async function getAvailableInterests() {
  try {
    const res = await fetch(`${API_BASE}/availableInterests`)
    if (!res.ok) throw new Error('Erro ao obter interesses disponíveis')
    return await res.json()
  } catch (e) {
    console.error('Erro ao ler interesses disponíveis:', e)
    return []
  }
}

async function addAvailableInterest(name) {
  try {
    const id = 'int' + Date.now()
    const res = await fetch(`${API_BASE}/availableInterests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name }),
    })
    if (!res.ok) throw new Error('Erro ao adicionar interesse')
    return await res.json()
  } catch (e) {
    console.error('Erro ao adicionar interesse:', e)
    return null
  }
}

async function deleteAvailableInterest(id) {
  try {
    const res = await fetch(`${API_BASE}/availableInterests/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Erro ao apagar interesse')
    return true
  } catch (e) {
    console.error('Erro ao apagar interesse:', e)
    return false
  }
}

export {
  getUsers,
  saveUser,
  updateUser,
  getSelections,
  saveSelection,
  updateSelection,
  deleteSelection,
  getInterests,
  saveInterest,
  getAvailableInterests,
  addAvailableInterest,
  deleteAvailableInterest,
  getRecommendations,
  getFriends,
  getUserFriends,
  addUserFriend,
  removeUserFriend,
}
