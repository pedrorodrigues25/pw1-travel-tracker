// API para manipular utilizadores via json-server
const API_URL = 'http://localhost:3001/users';

async function getUsers() {
	try {
		const res = await fetch(API_URL);
		if (!res.ok) throw new Error('Erro ao obter utilizadores');
		return await res.json();
	} catch (e) {
		console.error('Erro ao ler utilizadores:', e);
		return [];
	}
}

async function saveUser(newUser) {
	try {
		const res = await fetch(API_URL, {
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

export { getUsers, saveUser };
