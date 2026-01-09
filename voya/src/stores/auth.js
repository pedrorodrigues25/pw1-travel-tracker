
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getUsers, saveUser } from '../api/api'

// const STORAGE_KEY = 'voya_current_user' // removido, não é mais necessário

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const users = ref([])
  const isGuest = ref(false)


  async function loadUsers() {
    try {
      users.value = await getUsers();
    } catch (e) {
      console.error('failed to load users from db.json', e);
    }
  }




  // saveUsers removido, pois agora é feito via saveUser

  async function register(email, password, username) {
    await loadUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    if (users.value.some(u => u.email === normalizedEmail)) {
      throw new Error('Email já registado');
    }

    if (users.value.some(u => u.username.toLowerCase() === normalizedUsername)) {
      throw new Error('Username já existe');
    }

    const newUser = {
      email: normalizedEmail,
      password,
      username: normalizedUsername
    };

    const saved = await saveUser(newUser);
    if (!saved) {
      throw new Error('Erro ao guardar utilizador');
    }
    users.value.push(saved);
    user.value = saved; // Atualiza o utilizador autenticado com todos os campos
    return saved;
  }

  async function login(email, password) {
    await loadUsers(); // Recarrega todos os users para ter dados atualizados
    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = users.value.find(u => u.email === normalizedEmail);

    if (!foundUser) {
      throw new Error('Email não registado');
    }

    if (foundUser.password !== password) {
      throw new Error('Password incorreta');
    }

    // Check if user is banned
    console.log('Login check - User:', foundUser.username)
    console.log('Login check - bannedUntil:', foundUser.bannedUntil)
    
    if (foundUser.bannedUntil) {
      const banExpiryDate = new Date(foundUser.bannedUntil);
      const now = new Date();

      console.log('Ban expiry date:', banExpiryDate)
      console.log('Current date:', now)
      console.log('Is banned:', banExpiryDate > now)

      if (banExpiryDate > now) {
        // Calculate remaining ban time
        const diffMs = banExpiryDate - now;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        
        let banTimeMsg = '';
        if (diffHours < 1) {
          banTimeMsg = 'less than 1 hour';
        } else if (diffHours < 24) {
          banTimeMsg = `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
        } else {
          banTimeMsg = `${diffDays} day${diffDays > 1 ? 's' : ''} and ${diffHours % 24} hour${(diffHours % 24) > 1 ? 's' : ''}`;
        }
        
        throw new Error(`Your account has been banned for ${banTimeMsg}. Please try again later.`);
      }
    }

    user.value = foundUser; // Guarda o utilizador completo, incluindo id
    return user.value;
  }

  function logout() {
    user.value = null
    isGuest.value = false
    // Não remover mais user do localStorage
  }

  function enterAsGuest() {
    user.value = null
    isGuest.value = true
    // Não remover mais user do localStorage
  }


  // Não chamar loadUsers automaticamente, pois agora é assíncrono

  return { user, users, isGuest, register, login, logout, enterAsGuest }
})
