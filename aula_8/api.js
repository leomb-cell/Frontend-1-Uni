async function getSeries(texto) {
  const BaseURL = "https://api.tvmaze.com/search/shows?q=";
  const url = BaseURL + encodeURIComponent(texto);
  console.log(url)

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("O servidor respondeu com os status: " + response.status);
  }

  const parseResponse = await response.json();

  const shows = parseResponse.map((resultado) => resultado.show);

  return shows;
}
