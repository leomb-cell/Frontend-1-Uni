// Elementos

const formulario = document.getElementById("formulario");
const mensagem = document.getElementById("mensagem");
const tabela = document.getElementById("tabela");
const busca = document.getElementById("busca");

// Eventos

formulario.addEventListener("submit", pesquisar);

// Funções

function feedback(text = "") {
  if (text.length <= 0) {
    mensagem.textContent = "";
  } else {
    mensagem.textContent = text;
  }
}

function limpaFeedback() {
  mensagem.textContent = "";
}

async function pesquisar(e) {
  e.preventDefault();

  // feedback visual

  feedback("Pesquisando...");

  // limpando tabela

  tabela.replaceChildren();

  try {
    const shows = await getSeries(busca.value);

    if (shows.lenght == 0) {
      feedback("Nenhuma serie encontrada..");
    }

    feedback();

    for (const show of shows) {
      tabela.appendChild(criarLinha(show));
    }
  } catch (error) {
    feedback("Erro ao pesquisar series!");
  }
}

function criarLinha(show) {
  const tr = document.createElement("tr");

  //   criando a coluna de capa

  const tdCapa = document.createElement("td");

  if (show.image) {
    // criando imagem da capa
    const img = document.createElement("img");
    img.src = show.image.medium;
    img.alt = "capa de " + show.name;
    img.width = 50;
    tdCapa.appendChild(img);
  }

  //   criando a coluna nome

  const tdNome = document.createElement("td");

  tdNome.textContent = show.name;

  // criando coluna de URL

  const tdUrl = document.createElement("td");
  const link = document.createElement("a");

  link.href = show.url;
  link.target = 'blank';
  link.textContent = show.url;
  tdUrl.appendChild(link);


  // appendando as criança

  tr.appendChild(tdCapa);
  tr.appendChild(tdNome);
  tr.appendChild(tdUrl);

  return tr;
}
