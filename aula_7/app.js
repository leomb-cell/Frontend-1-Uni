// globais

const CHAVE = "usuarios";

// selecionando elementos

const formulario = document.getElementById("formulario");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const lista = document.getElementById("lista");

// funções

function adicionarUsuario(e) {
  // previnindo o refresh

  e.preventDefault();

  //   formatando os dados do nome e email

  const strNome = nome.value.trim();
  const strEmail = email.value.trim();

  // checkando validade dos dados

  if (!strNome || !strEmail) return;

  // cria o objeto novo usuario

  const novoUsuario = {
    id: Date.now(),
    nome: strNome,
    email: strEmail,
  };

  //   resgata os usuarios do local storage

  const usuarios = lerUsuarios();

  //   insere o novo usuario

  usuarios.push(novoUsuario);

  //   salva a nova lista de usuarios no localstorage

  salvarUsuario(usuarios);

  // recarrega os usuarios da tela

  mostrarUsuarios();

  // limpa os imputs

  nome.value = "";
  email.value = "";
}

function lerUsuarios() {
  try {
    // resgata a lista de usuarios do localstorage

    const usuarios = JSON.parse(localStorage.getItem(CHAVE)) || [];

    return usuarios;
  } catch (error) {
    // imprime o erro no console
    console.error(error);
    return [];
  }
}

function salvarUsuario(usuarios) {
  try {
    // insere uma lista com os usuarios no localstorage

    localStorage.setItem(CHAVE, JSON.stringify(usuarios));
  } catch (error) {
    console.error(error);
  }
}

function mostrarUsuarios() {
  // resgata os usuarios dalvos

  const usuarios = lerUsuarios();

  //   apaga a lista da tela

  lista.replaceChildren();

  //   percorre a lista de usuarios salvos

  usuarios.forEach((usuario) => {
    // cria o elemento li

    const li = document.createElement("li");

    // insere na li os dados de usuario

    li.textContent = `${usuario.nome} - ${usuario.email}`;

    // cria o elemento de botão de delete

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "remover";

    // cria o evento do botão que chama a função de deletar

    delBtn.addEventListener("click", () => removerUsuario(usuario.id));

    // apenda o botão a li

    li.appendChild(delBtn);

    // apenda a li ao elemento lista

    lista.appendChild(li);
  });
}

function removerUsuario(id) {
  // regata os usuarios filtrando sem o id informado
  const usuarios = lerUsuarios().filter((u) => u.id !== id);
  salvarUsuario(usuarios);
}

// pré carrega os usuarios

mostrarUsuarios();

// eventos

formulario.addEventListener("submit", adicionarUsuario);
