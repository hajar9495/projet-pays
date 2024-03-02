const searchInput = document.querySelector(".search");
const suggestions = document.querySelector(".suggestions");
const api = "https://restcountries.com/v3.1/all";
const cities = [];

// fetch api
const fetchData = async () => {
  try {
    const response = await fetch(api, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    const dataJson = await response.json();
    cities.push(...dataJson);
    console.log("cities", cities);
  } catch (error) {
    console.error("Erreur API :", error);
  }
};
// lancement api
fetchData();

// match entre api et input
function findMatch(wordToMatch, cities) {
  return cities.filter((pays) => {
    const regex = new RegExp(wordToMatch, "gi");
    return pays.name.common.match(regex);
  });
}

// montrer le match
function displayMatches() {
  const matchArray = findMatch(this.value, cities);
  console.log(matchArray);
  const text = matchArray
    .map((place) => {
      return `
      <li>
      <span>${place.name.common}</span>
      </li>
    `;
    })
    .join("");
  suggestions.innerHTML = text;
}
// lancement fonction montrer match
searchInput.addEventListener("keyup", displayMatches);
