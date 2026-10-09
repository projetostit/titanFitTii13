
const API_URL = "https://titanfit.projetostit.com";

// ==================================================
// SESSÃO DO USUÁRIO — 24 HORAS
// ==================================================

const TEMPO_SESSAO = 24 * 60 * 60 * 1000;

function criarSessao() {
    localStorage.setItem(
        "inicio_sessao",
        Date.now().toString()
    );
}

function sessaoValida() {
    const token = localStorage.getItem("token");
    const inicioSessao = localStorage.getItem("inicio_sessao");

    if (!token || !inicioSessao) {
        return false;
    }

    const tempoDecorrido =
        Date.now() - Number(inicioSessao);

    if (tempoDecorrido >= TEMPO_SESSAO) {
        encerrarSessao();
        return false;
    }

    return true;
}

function encerrarSessao() {
    localStorage.removeItem("token");
    localStorage.removeItem("inicio_sessao");

    localStorage.removeItem("tipo_usuario");

    localStorage.removeItem("id_aluno");
    localStorage.removeItem("nome_aluno");
    localStorage.removeItem("email_aluno");
    localStorage.removeItem("cpf_aluno");

    localStorage.removeItem("id_professor");
    localStorage.removeItem("nome_professor");
    localStorage.removeItem("email_professor");
}

function redirecionarSeEstiverLogado() {
    if (!sessaoValida()) {
        return;
    }

    const tipoUsuario = localStorage.getItem("tipo_usuario");

    if (tipoUsuario === "aluno") {
        window.location.href = "areaCliente.html";
        return;
    }

    if (tipoUsuario === "professor") {
        window.location.href = "areaProfessor.html";
    }
}

function atualizarMenuUsuario() {
    const linkLogin = document.getElementById("linkLogin");
    const linkUsuario = document.getElementById("linkUsuario");

    if (!linkLogin || !linkUsuario) {
        return;
    }

    if (!sessaoValida()) {
        linkLogin.style.display = "block";
        linkUsuario.style.display = "none";
        return;
    }

    const tipoUsuario = localStorage.getItem("tipo_usuario");

    if (tipoUsuario === "aluno" || tipoUsuario === "professor") {
        linkLogin.style.display = "none";
        linkUsuario.style.display = "flex";

        linkUsuario.onclick = (event) => {
            event.preventDefault();

            if (tipoUsuario === "aluno") {
                window.location.href = "areaCliente.html";
            }

            if (tipoUsuario === "professor") {
                window.location.href = "areaProfessor.html";
            }
        };
    } else {
        linkLogin.style.display = "block";
        linkUsuario.style.display = "none";
    }
}

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

async function lerResposta(resposta) {
    const texto = await resposta.text();

    if (!texto) return {};

    try {
        return JSON.parse(texto);
    } catch {
        return { mensagem: texto };
    }
}

function obterToken() {
    return localStorage.getItem("token");
}

function obterIdAluno() {
    return localStorage.getItem("id_aluno");
}

function obterIdProfessor() {
    return localStorage.getItem("id_professor");
}

function obterHeadersAutenticacao() {
    const token = obterToken();

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

function obterMensagemErro(resultado, padrao) {
    return resultado?.mensagem || resultado?.message || padrao;
}


function mostrarModalMensagem(mensagem, aoFechar = null) {

    const modalExistente = document.getElementById("modal-mensagem-sucesso");

    if (modalExistente) {

        modalExistente.remove();

    }

    const modal = document.createElement("div");

    modal.id = "modal-mensagem-sucesso";

    modal.innerHTML = `
<div class="modal-sucesso-conteudo" role="dialog" aria-modal="true">
<div class="modal-sucesso-icone">✓</div>
<h2>Sucesso!</h2>
<p class="modal-sucesso-mensagem"></p>
<button type="button" class="modal-sucesso-botao">

                Continuar
</button>
</div>

    `;

    const estilo = document.createElement("style");

    estilo.id = "estilo-modal-sucesso";

    estilo.textContent = `

        #modal-mensagem-sucesso {

            position: fixed;

            inset: 0;

            z-index: 99999;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

            background: rgba(0, 0, 0, 0.75);

            backdrop-filter: blur(5px);

            font-family: Arial, sans-serif;

        }

        .modal-sucesso-conteudo {

            width: 100%;

            max-width: 380px;

            padding: 32px 24px;

            text-align: center;

            background: #262626;

            color: #fff;

            border: 1px solid #414141;

            border-radius: 18px;

            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);

            animation: modalSucessoEntrada 0.25s ease;

        }

        .modal-sucesso-icone {

            display: flex;

            align-items: center;

            justify-content: center;

            width: 66px;

            height: 66px;

            margin: 0 auto 18px;

            border-radius: 50%;

            background: rgba(86, 192, 73, 0.15);

            border: 2px solid #56c049;

            color: #56c049;

            font-size: 38px;

            font-weight: bold;

        }

        .modal-sucesso-conteudo h2 {

            margin: 0 0 12px;

            font-size: 24px;

            color: #fff;

        }

        .modal-sucesso-mensagem {

            margin: 0 0 24px;

            color: #d1d1d1;

            font-size: 16px;

            line-height: 1.5;

        }

        .modal-sucesso-botao {

            width: 100%;

            padding: 13px 20px;

            border: none;

            border-radius: 9px;

            background: #7c3aed;

            color: #fff;

            font-size: 16px;

            font-weight: bold;

            cursor: pointer;

            transition: background 0.2s ease;

        }

        .modal-sucesso-botao:hover {

            background: #6d28d9;

        }

        @keyframes modalSucessoEntrada {

            from {

                opacity: 0;

                transform: translateY(10px) scale(0.97);

            }

            to {

                opacity: 1;

                transform: translateY(0) scale(1);

            }

        }

    `;

    if (!document.getElementById("estilo-modal-sucesso")) {

        document.head.appendChild(estilo);

    }

    modal.querySelector(".modal-sucesso-mensagem").textContent = mensagem;

    document.body.appendChild(modal);

    const botao = modal.querySelector(".modal-sucesso-botao");

    botao.addEventListener("click", () => {

        modal.remove();

        if (typeof aoFechar === "function") {

            aoFechar();

        }

    });

    botao.focus();

}

// =====================================================
// CADASTRO — ESCOLHA DO TIPO
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const botoesTipo = document.querySelectorAll(".botao-escolha");
    const tipoInput = document.getElementById("tipoInput");
    const camposProfessor = document.getElementById("camposProfessor");

    const camposProfessorIds = [
        "cref",
        "especialidade",
        "curriculo",
        "bacharelado",
        "formacao_academica"
    ];

    if (!tipoInput) return;

    botoesTipo.forEach((botao) => {
        botao.addEventListener("click", () => {
            botoesTipo.forEach((item) => item.classList.remove("ativo"));
            botao.classList.add("ativo");

            const tipo = botao.dataset.tipo;
            tipoInput.value = tipo;

            const ehProfessor = tipo === "professor";

            if (camposProfessor) {
                camposProfessor.style.display = ehProfessor ? "block" : "none";
            }

            camposProfessorIds.forEach((id) => {
                const campo = document.getElementById(id);
                if (!campo) return;

                campo.required = ehProfessor;

                if (!ehProfessor) {
                    campo.value = "";
                }
            });
        });
    });
});

// =====================================================
// CADASTRO
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById("formCadastro");
    if (!formCadastro) return;

    formCadastro.addEventListener("submit", async (event) => {
        event.preventDefault();

        const tipo = document.getElementById("tipoInput")?.value ?? "";
        const nome = document.getElementById("nome")?.value.trim() ?? "";
        const email = document.getElementById("email")?.value.trim() ?? "";
        const cpf = document.getElementById("cpf")?.value.trim() ?? "";
        const senha = document.getElementById("senha-cadastro")?.value ?? "";
        const confirmarSenha = document.getElementById("confirmar-senha")?.value ?? "";

        if (!tipo || !nome || !email || !cpf || !senha) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        if (senha.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não coinciden.");
            return;
        }

        if (tipo === "aluno") {
            await cadastrarAluno({ nome, email, senha, cpf });
            return;
        }

        if (tipo === "professor") {
            const cref = document.getElementById("cref")?.value.trim() ?? "";
            const especialidade = document.getElementById("especialidade")?.value.trim() ?? "";
            const curriculo = document.getElementById("curriculo")?.value.trim() ?? "";
            const bacharelado = document.getElementById("bacharelado")?.value.trim() ?? "";
            const formacaoAcademica = document.getElementById("formacao_academica")?.value.trim() ?? "";

            if (!cref || !especialidade || !curriculo || !bacharelado || !formacaoAcademica) {
                alert("Preencha todos os campos do professor.");
                return;
            }

            await cadastrarProfessor({
                nome,
                email,
                senha,
                cref,
                especialidade,
                curriculo,
                bacharelado,
                formacao_academica: formacaoAcademica
            });
        }
    });
});

// =====================================================
// CADASTRAR ALUNO
// POST /aluno/cadastro
// =====================================================

async function cadastrarAluno(dados) {
    try {
        const resposta = await fetch(`${API_URL}/aluno/cadastro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const resultado = await lerResposta(resposta);

        console.log("Status do cadastro do aluno:", resposta.status);
        console.log("Resposta do cadastro do aluno:", resultado);

        if (!resposta.ok) {
            alert(obterMensagemErro(resultado, "Não foi possível realizar o cadastro."));
            return;
        }

        if (!resultado.aluno) {
            alert(resultado.mensagem || "Cadastro realizado, mas o servidor não retornou os dados do aluno.");
            return;
        }



function mostrarModalMensagem(mensagem, aoFechar = null) {

    const modalExistente = document.getElementById("modal-mensagem-sucesso");

    if (modalExistente) {

        modalExistente.remove();

    }

    const modal = document.createElement("div");

    modal.id = "modal-mensagem-sucesso";

    modal.innerHTML = `
<div class="modal-sucesso-conteudo" role="dialog" aria-modal="true">
<div class="modal-sucesso-icone">✓</div>
<h2>Sucesso!</h2>
<p class="modal-sucesso-mensagem"></p>
<button type="button" class="modal-sucesso-botao">

                Continuar
</button>
</div>

    `;

    const estilo = document.createElement("style");

    estilo.id = "estilo-modal-sucesso";

    estilo.textContent = `

        #modal-mensagem-sucesso {

            position: fixed;

            inset: 0;

            z-index: 99999;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

            background: rgba(0, 0, 0, 0.75);

            backdrop-filter: blur(5px);

            font-family: Arial, sans-serif;

        }

        .modal-sucesso-conteudo {

            width: 100%;

            max-width: 380px;

            padding: 32px 24px;

            text-align: center;

            background: #262626;

            color: #fff;

            border: 1px solid #414141;

            border-radius: 18px;

            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);

            animation: modalSucessoEntrada 0.25s ease;

        }

        .modal-sucesso-icone {

            display: flex;

            align-items: center;

            justify-content: center;

            width: 66px;

            height: 66px;

            margin: 0 auto 18px;

            border-radius: 50%;

            background: rgba(86, 192, 73, 0.15);

            border: 2px solid #56c049;

            color: #56c049;

            font-size: 38px;

            font-weight: bold;

        }

        .modal-sucesso-conteudo h2 {

            margin: 0 0 12px;

            font-size: 24px;

            color: #fff;

        }

        .modal-sucesso-mensagem {

            margin: 0 0 24px;

            color: #d1d1d1;

            font-size: 16px;

            line-height: 1.5;

        }

        .modal-sucesso-botao {

            width: 100%;

            padding: 13px 20px;

            border: none;

            border-radius: 9px;

            background: #7c3aed;

            color: #fff;

            font-size: 16px;

            font-weight: bold;

            cursor: pointer;

            transition: background 0.2s ease;

        }

        .modal-sucesso-botao:hover {

            background: #6d28d9;

        }

        @keyframes modalSucessoEntrada {

            from {

                opacity: 0;

                transform: translateY(10px) scale(0.97);

            }

            to {

                opacity: 1;

                transform: translateY(0) scale(1);

            }

        }

    `;

    if (!document.getElementById("estilo-modal-sucesso")) {

        document.head.appendChild(estilo);

    }

    modal.querySelector(".modal-sucesso-mensagem").textContent = mensagem;

    document.body.appendChild(modal);

    const botao = modal.querySelector(".modal-sucesso-botao");

    botao.addEventListener("click", () => {

        modal.remove();

        if (typeof aoFechar === "function") {

            aoFechar();

        }

    });

    botao.focus();

}
} catch (erro) {
        console.error("Erro ao cadastrar aluno:", erro);
        alert("Não foi possível conectar ao servidor.");
    }
}

// =====================================================
// CADASTRAR PROFESSOR
// POST /professor/cadastro
// =====================================================

async function cadastrarProfessor(dados) {
    try {
        const resposta = await fetch(`${API_URL}/professor/cadastro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: dados.nome,
                email: dados.email,
                senha: dados.senha,
                registro_cref: dados.cref,
                especialidade: dados.especialidade,
                curriculo: dados.curriculo,
                bacharelado: dados.bacharelado,
                formacao_academica: dados.formacao_academica,
                status: "ativo"
            })
        });

        const resultado = await lerResposta(resposta);
        console.log("Resposta do cadastro do professor:", resultado);

        if (!resposta.ok) {
            alert(obterMensagemErro(resultado, "Não foi possível cadastrar o professor."));
            return;
        }

        if (!resultado.professor) {
            alert(resultado.mensagem || "Cadastro realizado, mas o servidor não retornou os dados do professor.");
            return;
        }

        mostrarModalMensagem("Professor cadastrado com sucesso!", () => {
    window.location.href = "login.html";
});
    } catch (erro) {
        console.error("Erro ao cadastrar professor:", erro);
        alert("Não foi possível conectar ao servidor.");
    }
}

// =====================================================
// LOGIN — ALUNO / PROFESSOR
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formLogin");
    if (!formLogin) return;

    const botoesTipo = document.querySelectorAll(".botao-tipo");
    const tipoLogin = document.getElementById("tipoLogin");

    botoesTipo.forEach((botao) => {
        botao.addEventListener("click", () => {
            botoesTipo.forEach((item) => item.classList.remove("ativo"));
            botao.classList.add("ativo");

            if (tipoLogin) {
                tipoLogin.value = botao.dataset.tipo;
            }
        });
    });

    formLogin.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("username-email")?.value.trim() ?? "";
        const senha = document.getElementById("senha")?.value ?? "";
        const tipo = tipoLogin?.value || "aluno";

        if (!email || !senha) {
            alert("Preencha o e-mail e a senha.");
            return;
        }

        try {
            const url = tipo === "professor"
                ? `${API_URL}/professor/login`
                : `${API_URL}/auth/aluno`;

            console.log("Tipo de usuário:", tipo);
            console.log("Enviando login para:", url);

            const resposta = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            });

            const resultado = await lerResposta(resposta);

            console.log("Status do login:", resposta.status);
            console.log("Resposta do login:", resultado);

           if (!resposta.ok || !resultado.token) {
    alert(
        obterMensagemErro(
            resultado,
            "E-mail ou senha incorretos."
        )
    );
    return;
}

            localStorage.setItem("token", resultado.token);

            if (tipo === "aluno") {
                if (!resultado.aluno) {
                    alert("Os dados do aluno não foram retornados pelo servidor.");
                    return;
                }

                salvarDadosAluno(resultado.aluno);
localStorage.setItem("tipo_usuario", "aluno");

criarSessao();



mostrarModalMensagem("Login realizado com sucesso!", () => {
    window.location.href = "areaCliente.html";
});            }

            if (tipo === "professor") {
                if (!resultado.professor) {
                    alert("Os dados do professor não foram retornados pelo servidor.");
                    return;
                }

                salvarDadosProfessor(resultado.professor);

localStorage.setItem("tipo_usuario", "professor");

criarSessao();



mostrarModalMensagem("Login realizado com sucesso!", () => {
    window.location.href = "areaProfessor.html";
});            }
        } catch (erro) {
            console.error("Erro no login:", erro);
            alert("Não foi possível conectar ao servidor.");
        }
    });
});


// =====================================================
// PROTEÇÃO DAS ÁREAS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const paginaAtual = window.location.pathname.split("/").pop();

    if (paginaAtual === "areaCliente.html") {
        const idAluno = obterIdAluno();
        const token = obterToken();

        if (!idAluno || !token) {
            alert("Você precisa fazer login para acessar a área do cliente.");
            window.location.href = "login.html";
            return;
        }

        const nomeAluno = localStorage.getItem("nome_aluno");
        const elementoNome = document.getElementById("nomeAluno");

        if (elementoNome && nomeAluno) {
            elementoNome.textContent = `Olá, ${nomeAluno}`;
        }
    }

    if (paginaAtual === "areaProfessor.html") {
        const idProfessor = obterIdProfessor();
        const token = obterToken();

        if (!idProfessor || !token) {
            alert("Você precisa fazer login para acessar a área do professor.");
            window.location.href = "login.html";
            return;
        }

        carregarPerfilProfessor();
        carregarMeusAlunos();
        carregarSolicitacoesProfessor();
    }
});

// =====================================================
// CARREGAR PERFIL DO PROFESSOR
// GET /professor/:id
// =====================================================

async function carregarPerfilProfessor() {
    const idProfessor = obterIdProfessor();
    const token = obterToken();

    if (!idProfessor || !token) {
        console.log("ID do professor ou token não encontrado.");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/professor/${idProfessor}`, {
            method: "GET",
            headers: obterHeadersAutenticacao()
        });

        const dados = await lerResposta(resposta);
        console.log("Dados do professor recebidos:", dados);

        if (!resposta.ok) {
            console.error("Erro ao buscar professor:", dados);
            return;
        }

        const professor = dados.professor ?? dados;

        const campos = {
            nomeProfessor: professor.nome ? `Olá, Prof. ${professor.nome}` : "Olá, Prof.",
            perfilNomeProfessor: professor.nome,
            perfilEmailProfessor: professor.email,
            perfilCrefProfessor: professor.registro_cref,
            perfilEspecialidadeProfessor: professor.especialidade,
            perfilBachareladoProfessor: professor.bacharelado,
            perfilFormacaoProfessor: professor.formacao_academica,
            perfilCurriculoProfessor: professor.curriculo
        };

        Object.entries(campos).forEach(([id, valor]) => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.textContent = valor || "Não informado";
            }
        });

        salvarDadosProfessor(professor);
    } catch (erro) {
        console.error("Erro ao carregar dados do professor:", erro);
    }
}

// =====================================================
// MEUS DADOS DO ALUNO
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const dadosNome = document.getElementById("dadosNome");
    const dadosEmail = document.getElementById("dadosEmail");
    const dadosCpf = document.getElementById("dadosCpf");

    if (!dadosNome && !dadosEmail && !dadosCpf) return;

    if (dadosNome) {
        dadosNome.textContent = localStorage.getItem("nome_aluno") || "Não informado";
    }

    if (dadosEmail) {
        dadosEmail.textContent = localStorage.getItem("email_aluno") || "Não informado";
    }

    if (dadosCpf) {
        dadosCpf.textContent = localStorage.getItem("cpf_aluno") || "Não informado";
    }
});

// =====================================================
// FICHA DO ALUNO — ÁREA DO CLIENTE
// =====================================================

function mostrarDadosFicha(ficha) {
    const campos = {
        fichaIdade: ficha?.idade,
        fichaAltura: ficha?.altura,
        fichaPeso: ficha?.peso,
        fichaObjetivo: ficha?.objetivo
    };

    Object.entries(campos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (!elemento) return;

        elemento.textContent =
            valor !== null && valor !== undefined && valor !== ""
                ? valor
                : "Não informado";
    });
}

function mostrarFichaNaoInformada() {
    ["fichaIdade", "fichaAltura", "fichaPeso", "fichaObjetivo"].forEach((id) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = "Não informado";
    });
}

async function carregarFicha() {
    const idAluno = obterIdAluno();
    const token = obterToken();

    if (!idAluno || !token) {
        console.log("Aluno ou token não encontrado.");
        mostrarFichaNaoInformada();
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/ficha-aluno/aluno/${idAluno}`, {
            method: "GET",
            headers: obterHeadersAutenticacao()
        });

        const dados = await lerResposta(resposta);
        console.log("Ficha recebida:", dados);

        if (!resposta.ok || dados.mensagem === "Ficha não encontrada") {
            mostrarFichaNaoInformada();
            return;
        }

        mostrarDadosFicha(normalizarFicha(dados));
    } catch (erro) {
        console.error("Erro ao carregar ficha:", erro);
        mostrarFichaNaoInformada();
    }
}

// =====================================================
// SALVAR / ATUALIZAR FICHA
// =====================================================

async function salvarFicha() {
    const idAluno = obterIdAluno();
    const token = obterToken();

    if (!idAluno || !token) {
        alert("Sua sessão expirou. Faça login novamente.");
        window.location.href = "login.html";
        return;
    }

    const campoIdade = document.getElementById("modalIdade");
    const campoAltura = document.getElementById("modalAltura");
    const campoPeso = document.getElementById("modalPeso");
    const campoObjetivo = document.getElementById("modalObjetivo");

    if (!campoIdade || !campoAltura || !campoPeso || !campoObjetivo) {
        console.error("Campos da ficha não encontrados.");
        alert("Erro no formulário. Atualize a página e tente novamente.");
        return;
    }

    const idadeTexto = campoIdade.value.trim();
    const alturaTexto = campoAltura.value.trim().replace(",", ".");
    const pesoTexto = campoPeso.value.trim().replace(",", ".");
    const objetivo = campoObjetivo.value.trim();

    const idade = Number(idadeTexto);
    const altura = Number(alturaTexto);
    const peso = Number(pesoTexto);

    if (
        idadeTexto === "" ||
        !Number.isInteger(idade) ||
        idade <= 0
    ) {
        alert("Informe uma idade válida.");
        campoIdade.focus();
        return;
    }

    if (
        alturaTexto === "" ||
        !Number.isFinite(altura) ||
        altura <= 0
    ) {
        alert("Informe uma altura válida. Exemplo: 1,75.");
        campoAltura.focus();
        return;
    }

    if (
        pesoTexto === "" ||
        !Number.isFinite(peso) ||
        peso <= 0
    ) {
        alert("Informe um peso válido em kg. Exemplo: 70,5.");
        campoPeso.focus();
        return;
    }

    if (!objetivo) {
        alert("Selecione um objetivo.");
        campoObjetivo.focus();
        return;
    }

    const dados = {
        id_aluno: Number(idAluno),
        idade,
        altura,
        peso,
        objetivo
    };

    try {
        // Verifica se o aluno já possui uma ficha
        const respostaBusca = await fetch(
            `${API_URL}/ficha-aluno/aluno/${idAluno}`,
            {
                method: "GET",
                headers: obterHeadersAutenticacao()
            }
        );

        const fichaAtual = await lerResposta(respostaBusca);

        console.log("Status da busca:", respostaBusca.status);
        console.log("Ficha atual:", fichaAtual);

        // Se a busca falhar por um erro diferente de ficha inexistente,
        // não tenta criar outra ficha automaticamente.
        if (
            !respostaBusca.ok &&
            fichaAtual.mensagem !== "Ficha não encontrada"
        ) {
            alert(
                obterMensagemErro(
                    fichaAtual,
                    "Não foi possível verificar a ficha existente."
                )
            );
            return;
        }

        const ficha = normalizarFicha(fichaAtual);

        const fichaExiste =
            respostaBusca.ok &&
            ficha &&
            typeof ficha === "object" &&
            (
                ficha.id_ficha !== undefined ||
                ficha.id !== undefined
            );

        // Atualiza a ficha existente ou cria uma nova
        const url = fichaExiste
            ? `${API_URL}/ficha-aluno/aluno/${idAluno}`
            : `${API_URL}/ficha-aluno`;

        const metodo = fichaExiste ? "PUT" : "POST";

        const respostaSalvar = await fetch(url, {
            method: metodo,
            headers: obterHeadersAutenticacao(),
            body: JSON.stringify(dados)
        });

        const resultado = await lerResposta(respostaSalvar);

        console.log("Método utilizado:", metodo);
        console.log("Status ao salvar:", respostaSalvar.status);
        console.log("Resposta ao salvar:", resultado);

        if (!respostaSalvar.ok) {
            alert(
                obterMensagemErro(
                    resultado,
                    `Não foi possível salvar a ficha. Erro HTTP ${respostaSalvar.status}.`
                )
            );
            return;
        }

        // Atualiza os dados exibidos na página
        const fichaSalva = normalizarFicha(resultado);

        if (
            fichaSalva &&
            typeof fichaSalva === "object" &&
            (
                fichaSalva.idade !== undefined ||
                fichaSalva.altura !== undefined ||
                fichaSalva.peso !== undefined ||
                fichaSalva.objetivo !== undefined
            )
        ) {
            mostrarDadosFicha(fichaSalva);
        } else {
            await carregarFicha();
        }

        // Fecha o modal
        if (typeof fecharModalFicha === "function") {
            fecharModalFicha();
        }

        alert("Ficha salva com sucesso!");

    } catch (erro) {
        console.error("Erro ao salvar ficha:", erro);
        alert("Não foi possível conectar ao servidor. Tente novamente.");
    }
}

// =====================================================
// EVENTOS DA FICHA
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const formFicha = document.getElementById("formFicha");

    if (formFicha) {
        formFicha.addEventListener("submit", async (event) => {
            event.preventDefault();
            await salvarFicha();
        });
    }

    const paginaAtual = window.location.pathname.split("/").pop();

    if (paginaAtual === "areaCliente.html") {
        carregarFicha();
    }
});
// =====================================================
// CARREGAR PROFESSORES
// GET /professor
// =====================================================

async function carregarProfessores() {
    const listaProfessores = document.getElementById("listaProfessores");
    if (!listaProfessores) return;

    listaProfessores.innerHTML = "<p>Carregando professores...</p>";

    try {
        const resposta = await fetch(`${API_URL}/professor`, {
            method: "GET",
            headers: obterHeadersAutenticacao()
        });

        const professores = await lerResposta(resposta);
        console.log("Professores recebidos:", professores);

        if (!resposta.ok) {
            listaProfessores.innerHTML = "<p>Não foi possível carregar os professores.</p>";
            return;
        }

        if (!Array.isArray(professores) || professores.length === 0) {
            listaProfessores.innerHTML = "<p>Nenhum professor cadastrado.</p>";
            return;
        }

        listaProfessores.innerHTML = "";

        professores.forEach((professor) => {
            const card = document.createElement("div");
            card.classList.add("card-professor");

            const idProfessor = professor.id_professor ?? professor.id;
            const cref = professor.registro_cref ?? professor.cref ?? "";

            const informacoes = document.createElement("div");
            informacoes.className = "professor-info";

            const titulo = document.createElement("h3");
            titulo.textContent = professor.nome ?? "Professor";
            informacoes.appendChild(titulo);

            const email = document.createElement("p");
            email.textContent = professor.email ?? "";
            informacoes.appendChild(email);

            if (cref) {
                const crefTexto = document.createElement("p");
                crefTexto.textContent = `CREF: ${cref}`;
                informacoes.appendChild(crefTexto);
            }

            if (professor.especialidade) {
                const especialidade = document.createElement("p");
                especialidade.textContent = `Especialidade: ${professor.especialidade}`;
                informacoes.appendChild(especialidade);
            }

            const botao = document.createElement("button");
            botao.type = "button";
            botao.className = "btn-conectar-professor";
            botao.textContent = "Conectar";

            botao.addEventListener("click", () => {
                if (!idProfessor) {
                    alert("Não foi possível identificar o professor.");
                    return;
                }

                conectarProfessor(Number(idProfessor));
            });

            card.append(informacoes, botao);
            listaProfessores.appendChild(card);
        });
    } catch (erro) {
        console.error("Erro ao carregar professores:", erro);
        listaProfessores.innerHTML = "<p>Não foi possível carregar os professores.</p>";
    }
}

// =====================================================
// SOLICITAR CONEXÃO COM PROFESSOR
// POST /professor-aluno
// =====================================================

async function conectarProfessor(idProfessor) {
    if (!obterToken()) {
        alert("Faça login para solicitar conexão com um professor.");
        window.location.href = "login.html";
        return;
    }

    if (!idProfessor) {
        alert("Professor inválido.");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/professor-aluno`, {
            method: "POST",
            headers: obterHeadersAutenticacao(),
            body: JSON.stringify({ id_professor: Number(idProfessor) })
        });

        const resultado = await lerResposta(resposta);
        console.log("Resposta da solicitação:", resultado);

        if (!resposta.ok) {
            alert(obterMensagemErro(resultado, "Não foi possível enviar a solicitação."));
            return;
        }

        alert(resultado.mensagem || "Solicitação enviada ao professor!");
        await carregarProfessores();
    } catch (erro) {
        console.error("Erro ao solicitar conexão:", erro);
        alert("Não foi possível enviar a solicitação.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const botao = document.getElementById("abrirModalProfessores");
    if (botao) botao.addEventListener("click", carregarProfessores);
});

// =====================================================
// PROFESSOR CONECTADO — ÁREA DO CLIENTE
// GET /professor-aluno/aluno/:id
// =====================================================

async function carregarProfessorConectado() {
    const professorNome = document.getElementById("professorNome");
    const professorEspecialidade = document.getElementById("professorEspecialidade");
    const botaoConectar = document.getElementById("botaoConectarProfessor");
    const idAluno = obterIdAluno();
    const token = obterToken();

    if (!professorNome) return;

    if (!idAluno || !token) {
        professorNome.textContent = "Nenhum professor conectado";
        if (professorEspecialidade) professorEspecialidade.textContent = "";
        if (botaoConectar) botaoConectar.style.display = "block";
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/professor-aluno/aluno/${idAluno}`, {
            method: "GET",
            headers: obterHeadersAutenticacao()
        });

        const dados = await lerResposta(resposta);
        console.log("Professor conectado:", dados);

        if (!resposta.ok) {
            throw new Error(obterMensagemErro(dados, "Erro ao buscar professor conectado."));
        }

        if (!Array.isArray(dados) || dados.length === 0) {
            professorNome.textContent = "Nenhum professor conectado";
            if (professorEspecialidade) professorEspecialidade.textContent = "";
            if (botaoConectar) botaoConectar.style.display = "block";
            return;
        }

        const professor = dados[0];
        professorNome.textContent = `Prof. ${professor.nome || ""}`;

        if (professorEspecialidade) {
            professorEspecialidade.textContent = professor.especialidade || "Personal Trainer";
        }

        if (botaoConectar) botaoConectar.style.display = "none";
    } catch (erro) {
        console.error("Erro ao carregar professor conectado:", erro);
        professorNome.textContent = "Nenhum professor conectado";

        if (professorEspecialidade) professorEspecialidade.textContent = "";
        if (botaoConectar) botaoConectar.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const botao = document.getElementById("botaoConectarProfessor");

    if (botao) {
        botao.addEventListener("click", () => {
            document.getElementById("abrirModalProfessores")?.click();
        });
    }

    if (window.location.pathname.split("/").pop() === "areaCliente.html") {
        carregarProfessorConectado();
    }
});

// =====================================================
// EDITAR PERFIL DO PROFESSOR
// =====================================================

async function editarPerfilProfessor() {
    const idProfessor = obterIdProfessor();

    if (!idProfessor) {
        alert("Professor não identificado.");
        return;
    }

    const dados = {
        nome: document.getElementById("editarNomeProfessor")?.value.trim() ?? "",
        email: document.getElementById("editarEmailProfessor")?.value.trim() ?? "",
        registro_cref: document.getElementById("editarCrefProfessor")?.value.trim() ?? "",
        especialidade: document.getElementById("editarEspecialidadeProfessor")?.value.trim() ?? "",
        bacharelado: document.getElementById("editarBachareladoProfessor")?.value.trim() ?? "",
        formacao_academica: document.getElementById("editarFormacaoProfessor")?.value.trim() ?? "",
        curriculo: document.getElementById("editarCurriculoProfessor")?.value.trim() ?? ""
    };

    if (!dados.nome || !dados.email) {
        alert("Nome e e-mail são obrigatórios.");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/professor/${idProfessor}`, {
            method: "PUT",
            headers: obterHeadersAutenticacao(),
            body: JSON.stringify(dados)
        });

        const resultado = await lerResposta(resposta);

        if (!resposta.ok) {
            alert(obterMensagemErro(resultado, "Não foi possível atualizar o perfil."));
            return;
        }

        localStorage.setItem("nome_professor", dados.nome);
        localStorage.setItem("email_professor", dados.email);

        alert("Perfil atualizado com sucesso!");
        fecharModalEditarPerfil();
        await carregarPerfilProfessor();
    } catch (erro) {
        console.error("Erro ao atualizar perfil:", erro);
        alert("Erro de conexão com o servidor.");
    }
}

function abrirModalEditarPerfil() {
    const modal = document.getElementById("modalEditarPerfil");
    if (!modal) return;

    const campos = [
        ["editarNomeProfessor", "perfilNomeProfessor"],
        ["editarEmailProfessor", "perfilEmailProfessor"],
        ["editarCrefProfessor", "perfilCrefProfessor"],
        ["editarEspecialidadeProfessor", "perfilEspecialidadeProfessor"],
        ["editarBachareladoProfessor", "perfilBachareladoProfessor"],
        ["editarFormacaoProfessor", "perfilFormacaoProfessor"],
        ["editarCurriculoProfessor", "perfilCurriculoProfessor"]
    ];

    campos.forEach(([idInput, idTexto]) => {
        const input = document.getElementById(idInput);
        const texto = document.getElementById(idTexto);

        if (input) {
            input.value = texto ? texto.textContent.trim() : "";
        }
    });

    modal.style.display = "flex";
}

function fecharModalEditarPerfil() {
    const modal = document.getElementById("modalEditarPerfil");
    if (modal) modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnEditarPerfil")?.addEventListener("click", abrirModalEditarPerfil);
    document.getElementById("fecharEditarPerfil")?.addEventListener("click", fecharModalEditarPerfil);

    document.getElementById("formEditarPerfil")?.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        await editarPerfilProfessor();
    });

    const modal = document.getElementById("modalEditarPerfil");

    if (modal) {
        modal.addEventListener("click", (evento) => {
            if (evento.target === modal) fecharModalEditarPerfil();
        });
    }
});

// =====================================================
// CARREGAR ALUNOS CONECTADOS AO PROFESSOR
// GET /professor-aluno
// =====================================================

async function carregarMeusAlunos() {
    const lista = document.getElementById("listaMeusAlunos");
    const quantidade = document.getElementById("quantidadeAlunosProfessor");

    if (!lista) return;

    if (!obterToken()) {
        lista.innerHTML = '<p class="professor-loading">Sessão do professor não encontrada.</p>';
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/professor-aluno`, {
            method: "GET",
            headers: obterHeadersAutenticacao()
        });

        const resultado = await lerResposta(resposta);
        console.log("Alunos conectados ao professor:", resultado);

        if (!resposta.ok) {
            lista.innerHTML = '<p class="professor-loading">Não foi possível carregar os alunos.</p>';
            console.error("Erro ao buscar alunos:", resultado);
            return;
        }

        const alunos = Array.isArray(resultado) ? resultado : [];
        window.alunosProfessor = alunos;

        if (quantidade) {
            quantidade.textContent = `${alunos.length} ${alunos.length === 1 ? "aluno" : "alunos"}`;
        }

        lista.innerHTML = "";

        if (alunos.length === 0) {
            lista.innerHTML = '<p class="professor-loading">Nenhum aluno conectado.</p>';
            return;
        }

        alunos.slice(0, 3).forEach((aluno) => adicionarAlunoNaLista(lista, aluno));
    } catch (erro) {
        console.error("Erro ao carregar alunos:", erro);
        lista.innerHTML = '<p class="professor-loading">Erro de conexão com o servidor.</p>';
    }
}

// =====================================================
// SOLICITAÇÕES DE CONEXÃO DO PROFESSOR
// =====================================================

async function carregarSolicitacoesProfessor() {
    const lista = document.getElementById("listaSolicitacoesProfessor");
    const quantidade = document.getElementById("quantidadeSolicitacoesProfessor");

    if (!lista) return;

    if (!obterToken()) {
        lista.innerHTML = '<p class="professor-loading">Sessão do professor não encontrada.</p>';
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/professor-aluno/solicitacoes`, {
            method: "GET",
            headers: obterHeadersAutenticacao()
        });

        const resultado = await lerResposta(resposta);
        console.log("Solicitações recebidas:", resultado);

        if (!resposta.ok) {
            lista.innerHTML = '<p class="professor-loading">Não foi possível carregar as solicitações.</p>';
            return;
        }

        const solicitacoes = Array.isArray(resultado) ? resultado : [];
        window.solicitacoesProfessor = solicitacoes;

        if (quantidade) {
            quantidade.textContent = `${solicitacoes.length} ${
                solicitacoes.length === 1 ? "solicitação" : "solicitações"
            }`;
        }

        lista.innerHTML = "";

        if (solicitacoes.length === 0) {
            lista.innerHTML = '<p class="professor-loading">Nenhuma solicitação pendente.</p>';
            return;
        }

        solicitacoes.forEach((solicitacao) => adicionarSolicitacaoNaLista(lista, solicitacao));
    } catch (erro) {
        console.error("Erro ao carregar solicitações:", erro);
        lista.innerHTML = '<p class="professor-loading">Erro de conexão com o servidor.</p>';
    }
}

function adicionarSolicitacaoNaLista(lista, solicitacao) {
    const item = document.createElement("div");
    item.className = "professor-request-item";

    const informacoes = document.createElement("div");
    informacoes.className = "professor-request-information";

    const nome = document.createElement("strong");
    nome.textContent = solicitacao.nome_aluno || "Aluno sem nome";

    const email = document.createElement("span");
    email.textContent = `E-mail: ${solicitacao.email_aluno || "E-mail não informado"}`;

    informacoes.append(nome, email);

    const acoes = document.createElement("div");
    acoes.className = "professor-request-actions";

    const botaoAceitar = document.createElement("button");
    botaoAceitar.type = "button";
    botaoAceitar.className = "professor-accept-button";
    botaoAceitar.textContent = "Aceitar";

    const botaoRecusar = document.createElement("button");
    botaoRecusar.type = "button";
    botaoRecusar.className = "professor-refuse-button";
    botaoRecusar.textContent = "Recusar";

    botaoAceitar.addEventListener("click", () => {
        responderSolicitacao(Number(solicitacao.id_solicitacao), "aceitar");
    });

    botaoRecusar.addEventListener("click", () => {
        responderSolicitacao(Number(solicitacao.id_solicitacao), "recusar");
    });

    acoes.append(botaoAceitar, botaoRecusar);
    item.append(informacoes, acoes);
    lista.appendChild(item);
}

async function responderSolicitacao(idSolicitacao, acao) {
    if (!obterToken()) {
        alert("Sua sessão expirou. Faça login novamente.");
        window.location.href = "login.html";
        return;
    }

    if (!idSolicitacao) {
        alert("Solicitação inválida.");
        return;
    }

    const mensagem = acao === "aceitar"
        ? "Deseja aceitar esta solicitação?"
        : "Deseja recusar esta solicitação?";

    if (!confirm(mensagem)) return;

    try {
        const resposta = await fetch(
            `${API_URL}/professor-aluno/solicitacoes/${idSolicitacao}/${acao}`,
            {
                method: "POST",
                headers: obterHeadersAutenticacao()
            }
        );

        const resultado = await lerResposta(resposta);
        console.log("Resposta da solicitação:", resultado);

        if (!resposta.ok) {
            alert(obterMensagemErro(resultado, "Não foi possível responder à solicitação."));
            return;
        }

        alert(resultado.mensagem || (acao === "aceitar"
            ? "Solicitação aceita com sucesso!"
            : "Solicitação recusada com sucesso!"));

        await carregarSolicitacoesProfessor();

        if (acao === "aceitar") {
            await carregarMeusAlunos();
        }
    } catch (erro) {
        console.error("Erro ao responder solicitação:", erro);
        alert("Não foi possível responder à solicitação.");
    }
}

// =====================================================
// ADICIONAR ALUNO À LISTA
// =====================================================

function adicionarAlunoNaLista(lista, aluno) {
    const item = document.createElement("div");
    item.className = "professor-student-item";

    const informacoes = document.createElement("div");
    informacoes.className = "professor-student-information";

    const nome = document.createElement("strong");
    nome.textContent = aluno.nome_aluno || "Aluno sem nome";

    const email = document.createElement("span");
    email.textContent = `E-mail: ${aluno.email_aluno || "E-mail não informado"}`;

    informacoes.append(nome, email);

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "professor-secondary-button";
    botao.textContent = "Ver ficha";

    botao.addEventListener("click", () => {
        abrirFichaAlunoProfessor(aluno.id_aluno, nome.textContent);
    });

    item.append(informacoes, botao);
    lista.appendChild(item);
}

// =====================================================
// MODAL — TODOS OS ALUNOS
// =====================================================

function abrirModalTodosAlunosProfessor() {
    const modal = document.getElementById("modalTodosAlunosProfessor");
    const lista = document.getElementById("listaTodosAlunosProfessor");

    if (!modal || !lista) {
        console.error("Modal de todos os alunos não encontrado.");
        return;
    }

    const alunos = window.alunosProfessor || [];
    lista.innerHTML = "";

    if (alunos.length === 0) {
        lista.innerHTML = '<p class="professor-loading">Nenhum aluno conectado.</p>';
    } else {
        alunos.forEach((aluno) => adicionarAlunoNaLista(lista, aluno));
    }

    modal.style.display = "flex";
}

function fecharModalTodosAlunosProfessor() {
    const modal = document.getElementById("modalTodosAlunosProfessor");
    if (modal) modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnVerAlunosProfessor")?.addEventListener("click", abrirModalTodosAlunosProfessor);
    document.getElementById("btnVisualizarTodosAlunos")?.addEventListener("click", abrirModalTodosAlunosProfessor);
    document.getElementById("fecharTodosAlunosProfessor")?.addEventListener("click", fecharModalTodosAlunosProfessor);

    const modal = document.getElementById("modalTodosAlunosProfessor");

    if (modal) {
        modal.addEventListener("click", (evento) => {
            if (evento.target === modal) fecharModalTodosAlunosProfessor();
        });
    }
});

// =====================================================
// ABRIR FICHA DO ALUNO — PROFESSOR
// GET /ficha-aluno/aluno/:id
// =====================================================

async function abrirFichaAlunoProfessor(idAluno, nomeAluno) {
    console.log("ID do aluno recebido:", idAluno);
    console.log("Tipo do ID:", typeof idAluno);
    console.log("ID do professor logado:", obterIdProfessor());

    if (!idAluno || !Number.isInteger(Number(idAluno))) {
        console.error("ID do aluno inválido:", idAluno);
        alert("Não foi possível identificar o aluno selecionado.");
        return;
    }

   // Fecha automaticamente o modal de todos os alunos.
fecharModalTodosAlunosProfessor();

// Abre o modal da ficha do aluno.
const modal = document.getElementById("modalFichaAlunoProfessor");

if (!modal) {
    console.error("Modal da ficha do aluno não encontrado.");
    return;
}

    const campos = {
        fichaAlunoIdadeProfessor: "Carregando...",
        fichaAlunoPesoProfessor: "Carregando...",
        fichaAlunoAlturaProfessor: "Carregando...",
        fichaAlunoObjetivoProfessor: "Carregando..."
    };

    const nome = document.getElementById("nomeFichaAlunoProfessor");

    if (nome) {
        nome.textContent = nomeAluno || "Aluno";
    }

    Object.entries(campos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent = valor;
        }
    });

    // Mantém a última atualização, sem o campo tempo disponível.
    const atualizacao = document.getElementById(
        "fichaAlunoAtualizacaoProfessor"
    );

    if (atualizacao) {
        atualizacao.textContent = "Não informado";
    }

    modal.style.display = "flex";

    try {
        const resposta = await fetch(
            `${API_URL}/ficha-aluno/aluno/${Number(idAluno)}`,
            {
                method: "GET",
                headers: obterHeadersAutenticacao()
            }
        );

        const resultado = await lerResposta(resposta);

        console.log("Status da ficha:", resposta.status);
        console.log("Ficha do aluno:", resultado);

        if (!resposta.ok) {
            throw new Error(
                obterMensagemErro(
                    resultado,
                    "Não foi possível carregar a ficha."
                )
            );
        }

        if (resultado.mensagem === "Ficha não encontrada") {
            Object.keys(campos).forEach((id) => {
                const elemento = document.getElementById(id);

                if (elemento) {
                    elemento.textContent = "Não informado";
                }
            });

            console.warn(
                "O aluno selecionado ainda não possui ficha cadastrada."
            );

            return;
        }

        if (
            resultado.mensagem ===
            "Você não está vinculado a esse aluno"
        ) {
            throw new Error(
                "O vínculo com esse aluno não está ativo. Verifique a conexão no sistema."
            );
        }

        const ficha = normalizarFicha(resultado);

        if (!ficha || typeof ficha !== "object") {
            throw new Error(
                "A API não retornou os dados esperados da ficha."
            );
        }

        const valores = {
            fichaAlunoIdadeProfessor:
                ficha.idade !== null &&
                ficha.idade !== undefined &&
                ficha.idade !== ""
                    ? `${ficha.idade} anos`
                    : "Não informado",

            fichaAlunoPesoProfessor:
                ficha.peso !== null &&
                ficha.peso !== undefined &&
                ficha.peso !== ""
                    ? `${ficha.peso} kg`
                    : "Não informado",

            fichaAlunoAlturaProfessor:
                ficha.altura !== null &&
                ficha.altura !== undefined &&
                ficha.altura !== ""
                    ? `${ficha.altura} m`
                    : "Não informado",

            fichaAlunoObjetivoProfessor:
                ficha.objetivo || "Não informado"
        };

        Object.entries(valores).forEach(([id, valor]) => {
            const elemento = document.getElementById(id);

            if (elemento) {
                elemento.textContent = valor;
            }
        });

        // Preenche a última atualização se a API retornar a data.
        if (atualizacao) {
            const dataAtualizacao =
                ficha.data_atualizacao ??
                ficha.updated_at ??
                ficha.updatedAt;

            if (dataAtualizacao) {
                const data = new Date(dataAtualizacao);

                atualizacao.textContent = !Number.isNaN(data.getTime())
                    ? data.toLocaleString("pt-BR")
                    : "Não informado";
            } else {
                atualizacao.textContent = "Não informado";
            }
        }

    } catch (erro) {
        console.error("Erro ao carregar ficha do aluno:", erro);

        Object.keys(campos).forEach((id) => {
            const elemento = document.getElementById(id);

            if (elemento) {
                elemento.textContent = "Não disponível";
            }
        });

        alert(
            erro.message ||
            "Erro de conexão ao carregar a ficha."
        );
    }
}



// =====================================================
// FECHAR FICHA DO ALUNO
// =====================================================

function fecharFichaAlunoProfessor() {
    const modal = document.getElementById("modalFichaAlunoProfessor");
    if (modal) modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalFichaAlunoProfessor");

    document.getElementById("fecharFichaAlunoProfessor")?.addEventListener(
        "click",
        fecharFichaAlunoProfessor
    );

    if (modal) {
        modal.addEventListener("click", (evento) => {
            if (evento.target === modal) fecharFichaAlunoProfessor();
        });
    }
});

// =====================================================
// SOLICITAÇÕES NO MODAL DO PROFESSOR
// =====================================================

function carregarSolicitacoesModalProfessor() {
    const lista = document.getElementById("listaModalSolicitacoesProfessor");
    if (!lista) return;

    const solicitacoes = window.solicitacoesProfessor || [];
    lista.innerHTML = "";

    if (solicitacoes.length === 0) {
        lista.innerHTML = '<p class="professor-loading">Nenhuma solicitação pendente.</p>';
        return;
    }

    solicitacoes.forEach((solicitacao) => {
        adicionarSolicitacaoNaLista(lista, solicitacao);
    });
}

if (window.location.pathname.endsWith("login.html")) {
    redirecionarSeEstiverLogado();
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarMenuUsuario();
});

document.addEventListener("DOMContentLoaded", () => {
    const botaoSair = document.getElementById("botaoSair");

    if (!botaoSair) return;

    botaoSair.addEventListener("click", () => {
        encerrarSessao();
        window.location.href = "login.html";
    });
});

function mostrarModalMensagem(mensagem) {
    const modal = document.getElementById("modalMensagem");
    const texto = document.getElementById("textoModalMensagem");

    if (!modal || !texto) {
        alert(mensagem);
        return;
    }

    texto.textContent = mensagem;
    modal.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalMensagem");
    const fechar = document.getElementById("fecharModalMensagem");

    if (fechar && modal) {
        fechar.addEventListener("click", () => {
            modal.style.display = "none";
        });

        modal.addEventListener("click", (evento) => {
            if (evento.target === modal) {
                modal.style.display = "none";
            }
        });
    }
});
