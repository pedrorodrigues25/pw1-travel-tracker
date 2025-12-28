// countries.js - Função para pesquisar países da API restcountries.com

export async function searchCountries(query) {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    // Retorna apenas nome comum e bandeira
    return data.map(c => ({
      name: c.name.common,
      flag: c.flags?.svg || c.flags?.png || '',
      code: c.cca2 || c.cca3 || '',
      region: c.region || '',
    }));
  } catch (e) {
    return [];
  }
}
// Função para buscar resumo do país na Wikipedia API
export async function fetchCountryWikipediaSummary(countryName) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Não foi possível obter informações da Wikipedia');
    }
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}
