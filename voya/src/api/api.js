// API para manipular utilizadores via json-server
const API_BASE = 'http://localhost:3001';

// USERS
async function getUsers() {
	try {
		const res = await fetch(`${API_BASE}/users`);
		if (!res.ok) throw new Error('Erro ao obter utilizadores');
		return await res.json();
	} catch (e) {
		console.error('Erro ao ler utilizadores:', e);
		return [];
	}
}

async function saveUser(newUser) {
	try {
		const res = await fetch(`${API_BASE}/users`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newUser)
		});
		if (!res.ok) throw new Error('Erro ao guardar utilizador');
		return await res.json();
	} catch (e) {
		console.error('Erro ao guardar utilizador:', e);
		return null;
	}
}

// SELECTIONS (viagens)
async function getSelections(userEmail) {
	try {
		const res = await fetch(`${API_BASE}/selections?userEmail=${encodeURIComponent(userEmail)}`);
		if (!res.ok) throw new Error('Erro ao obter viagens');
		return await res.json();
	} catch (e) {
		console.error('Erro ao ler viagens:', e);
		return [];
	}
}

async function saveSelection(selection) {
	try {
		const res = await fetch(`${API_BASE}/selections`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(selection)
		});
		if (!res.ok) throw new Error('Erro ao guardar viagem');
		return await res.json();
	} catch (e) {
		console.error('Erro ao guardar viagem:', e);
		return null;
	}
}

// INTERESTS
async function getInterests(userEmail) {
	try {
		const res = await fetch(`${API_BASE}/interests?userEmail=${encodeURIComponent(userEmail)}`);
		if (!res.ok) throw new Error('Erro ao obter interesses');
		return await res.json();
	} catch (e) {
		console.error('Erro ao ler interesses:', e);
		return [];
	}
}

async function saveInterest(interest) {
	try {
		const res = await fetch(`${API_BASE}/interests`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(interest)
		});
		if (!res.ok) throw new Error('Erro ao guardar interesse');
		return await res.json();
	} catch (e) {
		console.error('Erro ao guardar interesse:', e);
		return null;
	}
}

export { getUsers, saveUser, getSelections, saveSelection, getInterests, saveInterest };
