// pagina.js
// Este arquivo cuida da página: tabela, formulário e mensagens.
// Ele não sabe COMO o serviço é chamado, só usa as funções do api.js.

// ===== Etapa 1: listar =====

// Elementos da página que vamos usar
const tbody = document.getElementById("tbody");
const formulario = document.getElementById("formulario");
const tituloFormulario = document.getElementById("titulo-formulario");
const campoNome = document.getElementById("name");
const campoEmail = document.getElementById("email");
const botaoGravar = document.getElementById("gravar");
const mensagem = document.getElementById("mensagem");

// Id do usuário em edição, ou null quando estamos cadastrando um novo.
// Só vai mudar de valor na etapa 4.
let editandoId = null;

// Mostra ao usuário uma mensagem de erro compreensível
function mostrarErro(erro) {
  console.error(erro); // o status completo aparece no console (F12)
  if (erro.status === 401) {
    mensagem.textContent = "Acesso negado: verifique a chave em config.js.";
  } else {
    mensagem.textContent = "Não foi possível completar a operação.";
  }
}

// Cria uma célula <td> com um texto
function criarCelula(texto) {
  const td = document.createElement("td");
  td.textContent = texto; // textContent: o dado vira TEXTO, nunca HTML
  return td;
}

// Cria uma linha da tabela com os dados de um usuário
function criarLinha(usuario) {
  const tr = document.createElement("tr");
  tr.appendChild(criarCelula(usuario.id));
  tr.appendChild(criarCelula(usuario.name));
  tr.appendChild(criarCelula(usuario.email));

  // Célula com os botões de ação (eles funcionarão nas etapas 3 e 4)
  const tdAcoes = document.createElement("td");

  const botaoEditar = document.createElement("button");
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", () => selecionar(usuario.id));

  const botaoExcluir = document.createElement("button");
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.addEventListener("click", () => excluir(usuario));

  tdAcoes.append(botaoEditar, " ", botaoExcluir);
  tr.appendChild(tdAcoes);

  return tr;
}

// Carrega todos os usuários na tabela
async function carregarDados() {
  try {
    const usuarios = await listarUsuarios();

    tbody.replaceChildren(); // limpa a tabela

    if (usuarios.length === 0) {
      const td = criarCelula("Nenhum usuário cadastrado.");
      td.colSpan = 4; // a célula ocupa as 4 colunas
      const tr = document.createElement("tr");
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    for (const usuario of usuarios) {
      tbody.appendChild(criarLinha(usuario));
    }
  } catch (erro) {
    mostrarErro(erro);
  }
}

document.getElementById("recarregar").addEventListener("click", carregarDados);

// Carrega os usuários assim que a página abre
carregarDados();

// ===== Etapa 2: cadastrar =====

// Cria (POST) ou altera (PUT) o usuário do formulário
async function gravar(event) {
    event.preventDefault(); // impede o formulário de recarregar a página
    mensagem.textContent = "";

    const dados = {
        name: campoNome.value.trim(),
        email: campoEmail.value.trim(),
    };

    try {
        if (editandoId === null) {
            await criarUsuario(dados);
        } else {
            await alterarUsuario(editandoId, dados);
        }
        limpar();
        await carregarDados();
    } catch (erro) {
        mostrarErro(erro);
    }
}

// Limpa o formulário e volta ao modo de cadastro
function limpar() {
  formulario.reset();
  editandoId = null;
  tituloFormulario.textContent = "Novo usuário";
  botaoGravar.textContent = "Cadastrar";
}

formulario.addEventListener("submit", gravar);
document.getElementById("limpar").addEventListener("click", limpar);

// ===== Etapa 3: excluir =====

// Exclui um usuário, após confirmação
async function excluir(usuario) {
  if (!confirm('Excluir o usuário "' + usuario.name + '"?')) {
    return;
  }
  mensagem.textContent = "";
  try {
    await excluirUsuario(usuario.id);

    // Se o usuário excluído estava em edição, limpa o formulário
    if (usuario.id === editandoId) {
      limpar();
    }
    await carregarDados();
  } catch (erro) {
    mostrarErro(erro);
  }
}

// ===== Etapa 4: editar =====

// Busca um usuário no servidor e coloca os dados no formulário
async function selecionar(id) {
  mensagem.textContent = "";
  try {
    const usuario = await buscarUsuario(id);

    campoNome.value = usuario.name;
    campoEmail.value = usuario.email;

    // Agora o formulário está em modo de edição
    editandoId = usuario.id;
    tituloFormulario.textContent = "Editando usuário #" + usuario.id;
    botaoGravar.textContent = "Salvar alterações";
    campoNome.focus();
  } catch (erro) {
    mostrarErro(erro);
  }
}
