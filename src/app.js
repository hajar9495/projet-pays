const searchInput = document.querySelector(".search");
const searchForm = document.querySelector("form");
const suggestions = document.querySelector(".suggestions");
const countryCard = document.querySelector(".country-card");

let timer;
let currentCountries = [];

// 1. Récupération des données API
const searchCountries = async (pays) => {
  const api = `https://api.restcountries.com/countries/v5?q=${pays}`;

  try {
    // appel api
    const response = await fetch(api, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CONFIG.API_KEY}`,
      },
    });
    const data = await response.json();
    // si vide -> pas de donnée sinon retourner objet json
    if (!data.data || !data.data.objects) {
      return [];
    } else {
      return data.data.objects;
    }
  } catch (error) {
    console.error("Erreur API :", error);
    return [];
  }
};

// 2. Affichage des suggestions dans le menu déroulant
const displaySuggestions = (countries) => {
  // si aucun pays dans api-> afficher pas de pays dans suggestions
  if (!countries || countries.length === 0) {
    suggestions.innerHTML = `<li class="py-2 px-3 text-gray-400">Aucun pays trouvé</li>`;
    return;
  } else {
    suggestions.innerHTML = countries
      .slice(0, 8)
      .map(
        (country, index) => `
          <li data-index="${index}" class="suggestion-item py-2 px-3 hover:bg-gray-100 cursor-pointer border-b text-black">
            ${country.names.common}
          </li>
        `,
      )
      .join("");
  }
};

// 3. Affichage de la carte détaillée (sortie de displaySuggestions pour être globale)
const displayCountry = (country) => {
  if (!country) return;
  const infosUtiles = {
    nom: country.names ? country.names.common : "Inconnu",
    capitale:
      country.capitals && country.capitals.length > 0
        ? country.capitals[0].name
        : "Inconnue",
    population: country.population,
    drapeau: country.flag && country.flag.url_svg ? country.flag.url_svg : "",
    langue: country.languages ? country.languages[0].name : "Inconnue",
    region: country.region ? country.region : "Inconnue",
    devise: country.currencies ? country.currencies[0].symbol : "Inconnue",
  };

  countryCard.innerHTML = `<div class="bg-white rounded-2xl shadow-xl p-6 w-full border border-gray-100" style="padding-top: 50px; margin-top: 30px;">
      <img src="${infosUtiles.drapeau}" alt="Drapeau de ${infosUtiles.nom}" class="w-32 h-20 object-cover mx-auto mb-4 rounded-md shadow border">
      
      <h2 class="text-3xl font-extrabold text-gray-800 mb-4" style="padding-left: 20px">${infosUtiles.nom}</h2> 
      
      <div class="space-y-2 text-left text-gray-600 text-sm" style="padding-left: 20px">
        <p><strong>📍 Capitale :</strong> ${infosUtiles.capitale}</p>
        <p><strong>👥 Population :</strong> ${infosUtiles.population.toLocaleString()} habitants</p>
        <p><strong>🗣️ Langue :</strong> ${infosUtiles.langue}</p>
        <p><strong>🌍 Région :</strong> ${infosUtiles.region}</p>
        <p><strong>💰 Devise :</strong> ${infosUtiles.devise}</p>
      </div>
    </div>`;
};

// 4. Écouteur sur la barre de recherche (avec le debounce)
searchInput.addEventListener("input", (e) => {
  const texteSaisi = e.target.value.trim();
  clearTimeout(timer);

  if (texteSaisi.length >= 2) {
    timer = setTimeout(async () => {
      currentCountries = await searchCountries(texteSaisi);
      currentCountries.sort((a, b) => {
        const term = texteSaisi.toLowerCase();
        const aStartsWith = a.names.common.toLowerCase().startsWith(term);
        const bStartsWith = b.names.common.toLowerCase().startsWith(term);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return 0;
      });
      displaySuggestions(currentCountries);
    }, 250);
  } else {
    suggestions.innerHTML = `<li class="h-10 py-3 px-2 text-gray-400">Rechercher un pays...</li>`;
    currentCountries = [];
  }
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Empêche la page de se recharger

  const searchTerm = searchInput.value.trim();

  if (searchTerm && currentCountries && currentCountries.length > 0) {
    // On prend par défaut le premier pays de la liste suggérée
    const selectedCountry = currentCountries[0];

    displayCountry(selectedCountry);
    suggestions.innerHTML = ""; // On efface la liste
    searchInput.value = selectedCountry.names.common;
    searchInput.value = "";
    // Attention à "name" au singulier si c'est ce que renvoie ton API !
  }
});

// 5. Écouteur de clic sur une suggestion de la liste
suggestions.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const index = li.getAttribute("data-index");
  if (index === null || index === undefined) {
    return;
  }

  const selectedCountry = currentCountries[index];
  if (selectedCountry) {
    displayCountry(selectedCountry);
    suggestions.innerHTML = ""; // On efface la liste après le choix
    searchInput.value = selectedCountry.names.common;
    searchInput.value = "";
  }
});
