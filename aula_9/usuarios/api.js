// api.js
// Este arquivo só conversa com o serviço web.
// Ele não sabe nada sobre a página: não mexe em tabela, formulário ou mensagem.

// Faz uma requisição ao serviço. Todas as funções abaixo usam esta.
async function requisitar(metodo, caminho, dados) {
  const opcoes = {
    method: metodo,
    headers: { "X-API-KEY": API_KEY },
  };

  // Só enviamos corpo quando há dados (POST e PUT)
  if (dados) {
    opcoes.headers["Content-Type"] = "application/json";
    opcoes.body = JSON.stringify(dados);
  }

  const resposta = await fetch(API_URL + caminho, opcoes);

  // O fetch não trata 401, 404 ou 500 como erro: verificamos nós mesmos
  if (!resposta.ok) {
    const erro = new Error(
      "O servidor respondeu com o status " + resposta.status,
    );
    erro.status = resposta.status; // guardamos o status para usar depois
    throw erro;
  }

  // 204 (No Content) significa sucesso SEM corpo: não há JSON para ler
  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

// R: lista todos os usuários (GET /users)
async function listarUsuarios() {
  const usuarios = await requisitar("GET", "");
  // Quando não há usuários, o serviço devolve null. Trocamos por lista vazia.
  if (usuarios === null) {
    return [];
  }
  return usuarios;
}

// R: busca um usuário (GET /users/{id})
async function buscarUsuario(id) {
  return requisitar("GET", "/" + id);
}

// C: cria um usuário (POST /users)
async function criarUsuario(dados) {
  return requisitar("POST", "", dados);
}

// U: altera um usuário (PUT /users/{id})
async function alterarUsuario(id, dados) {
  return requisitar("PUT", "/" + id, dados);
}

// D: exclui um usuário (DELETE /users/{id})
async function excluirUsuario(id) {
  return requisitar("DELETE", "/" + id);
}
