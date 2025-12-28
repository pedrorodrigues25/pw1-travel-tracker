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

// Função para buscar cidades de um país via Wikidata
export async function fetchCitiesByCountry(countryName) {
  const endpoint = 'https://query.wikidata.org/sparql';
  const query = `SELECT ?cityLabel WHERE { ?country rdfs:label "${countryName}"@en. ?city wdt:P31/wdt:P279* wd:Q515; wdt:P17 ?country. SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } } LIMIT 50`;
  const url = endpoint + '?query=' + encodeURIComponent(query) + '&format=json';
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.results.bindings.map(b => b.cityLabel.value);
  } catch (e) {
    return [];
  }
}
