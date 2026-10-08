
const API_URL = "https://titanfit.projetostit.com";

async function lerResposta(resposta) {
    const texto = await resposta.text();

    if (!texto) return {};

    try {
        return JSON.parse(texto);
    } catch (erro) {
        return {
            mensagem: texto
        };
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
        ...(token ? {
            "Authorization": `Bearer ${token}`
        } : {})
    };
}

function salvarDadosAluno(aluno) {

    if (!aluno) return;

    const idAluno =
        aluno.id_aluno ??
        aluno.id;

    if (
        idAluno !== undefined &&
        idAluno !== null
    ) {
        localStorage.setItem(
            "id_aluno",
            String(idAluno)
        );
    }

    if (aluno.nome) {

        localStorage.setItem(
            "nome_aluno",
            aluno.nome
        );
    }

    if (aluno.email) {

        localStorage.setItem(
            "email_aluno",
            aluno.email
        );
    }

    if (aluno.cpf) {

        localStorage.setItem(
            "cpf_aluno",
            aluno.cpf
        );
    }
}

function salvarDadosProfessor(professor) {

    if (!professor) return;

    const idProfessor =
        professor.id_professor ??
        professor.id;

    if (
        idProfessor !== undefined &&
        idProfessor !== null
    ) {

        localStorage.setItem(
            "id_professor",
            String(idProfessor)
        );
    }

    if (professor.nome) {

        localStorage.setItem(
            "nome_professor",
            professor.nome
        );
    }

    if (professor.email) {

        localStorage.setItem(
            "email_professor",
            professor.email
        );
    }
}


// =====================================================
// CADASTRO - ESCOLHA DO TIPO
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const botoesTipo =
        document.querySelectorAll(
            ".botao-escolha"
        );

    const tipoInput =
        document.getElementById(
            "tipoInput"
        );

    const camposProfessor =
        document.getElementById(
            "camposProfessor"
        );

    const crefInput =
        document.getElementById(
            "cref"
        );

    const especialidadeInput =
        document.getElementById(
            "especialidade"
        );

    const curriculoInput =
        document.getElementById(
            "curriculo"
        );

    const bachareladoInput =
        document.getElementById(
            "bacharelado"
        );

    const formacaoAcademicaInput =
        document.getElementById(
            "formacao_academica"
        );

    if (!tipoInput) return;

    botoesTipo.forEach((botao) => {

        botao.addEventListener(
            "click",
            () => {

                botoesTipo.forEach((item) => {

                    item.classList.remove(
                        "ativo"
                    );
                });

                botao.classList.add(
                    "ativo"
                );

                const tipo =
                    botao.dataset.tipo;

                tipoInput.value =
                    tipo;

                if (tipo === "professor") {

                    if (camposProfessor) {

                        camposProfessor.style.display =
                            "block";
                    }

                    if (crefInput) {
                        crefInput.required =
                            true;
                    }

                    if (especialidadeInput) {
                        especialidadeInput.required =
                            true;
                    }

                    if (curriculoInput) {
                        curriculoInput.required =
                            true;
                    }

                    if (bachareladoInput) {
                        bachareladoInput.required =
                            true;
                    }

                    if (formacaoAcademicaInput) {
                        formacaoAcademicaInput.required =
                            true;
                    }

                } else {

                    if (camposProfessor) {

                        camposProfessor.style.display =
                            "none";
                    }

                    if (crefInput) {

                        crefInput.required =
                            false;

                        crefInput.value =
                            "";
                    }

                    if (especialidadeInput) {

                        especialidadeInput.required =
                            false;

                        especialidadeInput.value =
                            "";
                    }

                    if (curriculoInput) {

                        curriculoInput.required =
                            false;

                        curriculoInput.value =
                            "";
                    }

                    if (bachareladoInput) {

                        bachareladoInput.required =
                            false;

                        bachareladoInput.value =
                            "";
                    }

                    if (formacaoAcademicaInput) {

                        formacaoAcademicaInput.required =
                            false;

                        formacaoAcademicaInput.value =
                            "";
                    }
                }
            }
        );
    });
});


// =====================================================
// CADASTRO
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const formCadastro =
        document.getElementById(
            "formCadastro"
        );

    if (!formCadastro) return;

    formCadastro.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const tipoInput =
                document.getElementById(
                    "tipoInput"
                );

            const tipo =
                tipoInput
                    ? tipoInput.value
                    : "";

            const nomeElement =
                document.getElementById(
                    "nome"
                );

            const emailElement =
                document.getElementById(
                    "email"
                );

            const cpfElement =
                document.getElementById(
                    "cpf"
                );

            const senhaElement =
                document.getElementById(
                    "senha-cadastro"
                );

            const confirmarSenhaElement =
                document.getElementById(
                    "confirmar-senha"
                );

            const nome =
                nomeElement
                    ? nomeElement.value.trim()
                    : "";

            const email =
                emailElement
                    ? emailElement.value.trim()
                    : "";

            const cpf =
                cpfElement
                    ? cpfElement.value.trim()
                    : "";

            const senha =
                senhaElement
                    ? senhaElement.value
                    : "";

            const confirmarSenha =
                confirmarSenhaElement
                    ? confirmarSenhaElement.value
                    : "";

            if (
                !tipo ||
                !nome ||
                !email ||
                !cpf ||
                !senha
            ) {

                alert(
                    "Preencha todos os campos obrigatórios."
                );

                return;
            }

            if (senha.length < 6) {

                alert(
                    "A senha deve ter pelo menos 6 caracteres."
                );

                return;
            }

            if (senha !== confirmarSenha) {

                alert(
                    "As senhas não coincidem."
                );

                return;
            }

            if (tipo === "aluno") {

                await cadastrarAluno({
                    nome,
                    email,
                    senha,
                    cpf
                });

                return;
            }

            if (tipo === "professor") {

                const crefInput =
                    document.getElementById(
                        "cref"
                    );

                const especialidadeInput =
                    document.getElementById(
                        "especialidade"
                    );

                const curriculoInput =
                    document.getElementById(
                        "curriculo"
                    );

                const bachareladoInput =
                    document.getElementById(
                        "bacharelado"
                    );

                const formacaoInput =
                    document.getElementById(
                        "formacao_academica"
                    );

                const cref =
                    crefInput
                        ? crefInput.value.trim()
                        : "";

                const especialidade =
                    especialidadeInput
                        ? especialidadeInput.value.trim()
                        : "";

                const curriculo =
                    curriculoInput
                        ? curriculoInput.value.trim()
                        : "";

                const bacharelado =
                    bachareladoInput
                        ? bachareladoInput.value.trim()
                        : "";

                const formacaoAcademica =
                    formacaoInput
                        ? formacaoInput.value.trim()
                        : "";

                if (
                    !cref ||
                    !especialidade ||
                    !curriculo ||
                    !bacharelado ||
                    !formacaoAcademica
                ) {

                    alert(
                        "Preencha todos os campos do professor."
                    );

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
                    formacao_academica:
                        formacaoAcademica
                });
            }
        }
    );
});


// =====================================================
// CADASTRAR ALUNO
// POST /aluno/cadastro
// =====================================================

async function cadastrarAluno(dados) {

    try {

        const resposta =
            await fetch(
                `${API_URL}/aluno/cadastro`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            nome:
                                dados.nome,

                            email:
                                dados.email,

                            senha:
                                dados.senha,

                            cpf:
                                dados.cpf
                        })
                }
            );

        const resultado =
            await lerResposta(
                resposta
            );

        console.log(
            "Status do cadastro do aluno:",
            resposta.status
        );

        console.log(
            "Resposta do cadastro do aluno:",
            resultado
        );

        if (!resposta.ok) {

            alert(
                resultado.mensagem ||
                resultado.message ||
                "Não foi possível realizar o cadastro."
            );

            return;
        }

        if (!resultado.aluno) {

            alert(
                resultado.mensagem ||
                "Cadastro realizado, mas o servidor não retornou os dados do aluno."
            );

            return;
        }

        salvarDadosAluno(
            resultado.aluno
        );

        alert(
            "Aluno cadastrado com sucesso!"
        );

        window.location.href =
            "login.html";

    } catch (erro) {

        console.error(
            "Erro ao cadastrar aluno:",
            erro
        );

        alert(
            "Não foi possível conectar ao servidor."
        );
    }
}


// =====================================================
// CADASTRAR PROFESSOR
// POST /professor/cadastro
// =====================================================

async function cadastrarProfessor(dados) {

    try {

        const resposta =
            await fetch(
                `${API_URL}/professor/cadastro`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            nome:
                                dados.nome,

                            email:
                                dados.email,

                            senha:
                                dados.senha,

                            registro_cref:
                                dados.cref,

                            especialidade:
                                dados.especialidade,

                            curriculo:
                                dados.curriculo,

                            bacharelado:
                                dados.bacharelado,

                            formacao_academica:
                                dados.formacao_academica,

                            status:
                                "ativo"
                        })
                }
            );

        const resultado =
            await lerResposta(
                resposta
            );

        console.log(
            "Resposta do cadastro do professor:",
            resultado
        );

        if (!resposta.ok) {

            alert(
                resultado.mensagem ||
                resultado.message ||
                "Não foi possível realizar o cadastro do professor."
            );

            return;
        }

        if (!resultado.professor) {

            alert(
                resultado.mensagem ||
                "Cadastro realizado, mas o servidor não retornou os dados do professor."
            );

            return;
        }

        alert(
            "Professor cadastrado com sucesso!"
        );

        window.location.href =
            "login.html";

    } catch (erro) {

        console.error(
            "Erro ao cadastrar professor:",
            erro
        );

        alert(
            "Não foi possível conectar ao servidor."
        );
    }
}


// =====================================================
// LOGIN - ALUNO / PROFESSOR
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const formLogin =
        document.getElementById(
            "formLogin"
        );

    if (!formLogin) return;

    const botoesTipo =
        document.querySelectorAll(
            ".botao-tipo"
        );

    const tipoLogin =
        document.getElementById(
            "tipoLogin"
        );

    botoesTipo.forEach((botao) => {

        botao.addEventListener(
            "click",
            () => {

                botoesTipo.forEach((item) => {

                    item.classList.remove(
                        "ativo"
                    );
                });

                botao.classList.add(
                    "ativo"
                );

                if (tipoLogin) {

                    tipoLogin.value =
                        botao.dataset.tipo;
                }
            }
        );
    });

    formLogin.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const emailElement =
                document.getElementById(
                    "username-email"
                );

            const senhaElement =
                document.getElementById(
                    "senha"
                );

            const email =
                emailElement
                    ? emailElement.value.trim()
                    : "";

            const senha =
                senhaElement
                    ? senhaElement.value
                    : "";

            const tipo =
                tipoLogin
                    ? tipoLogin.value
                    : "aluno";

            if (!email || !senha) {

                alert(
                    "Preencha o e-mail e a senha."
                );

                return;
            }

            try {

                const url =
                    tipo === "professor"
                        ? `${API_URL}/professor/login`
                        : `${API_URL}/auth/aluno`;

                console.log(
                    "Tipo de usuário:",
                    tipo
                );

                console.log(
                    "Enviando login para:",
                    url
                );

                const resposta =
                    await fetch(
                        url,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email,
                                    senha
                                })
                        }
                    );

                const resultado =
                    await lerResposta(
                        resposta
                    );

                console.log(
                    "Status do login:",
                    resposta.status
                );

                console.log(
                    "Resposta do login:",
                    resultado
                );

                if (
                    !resposta.ok ||
                    !resultado.token
                ) {

                    alert(
                        resultado.mensagem ||
                        resultado.message ||
                        "E-mail ou senha incorretos."
                    );

                    return;
                }

                localStorage.setItem(
                    "token",
                    resultado.token
                );

                if (tipo === "aluno") {

                    if (!resultado.aluno) {

                        alert(
                            "Os dados do aluno não foram retornados pelo servidor."
                        );

                        return;
                    }

                    salvarDadosAluno(
                        resultado.aluno
                    );

                    localStorage.setItem(
                        "tipo_usuario",
                        "aluno"
                    );

                    alert(
                        "Login realizado com sucesso!"
                    );

                    window.location.href =
                        "areaCliente.html";

                    return;
                }

                if (tipo === "professor") {

                    if (!resultado.professor) {

                        alert(
                            "Os dados do professor não foram retornados pelo servidor."
                        );

                        return;
                    }

                    salvarDadosProfessor(
                        resultado.professor
                    );

                    localStorage.setItem(
                        "tipo_usuario",
                        "professor"
                    );

                    alert(
                        "Login do professor realizado com sucesso!"
                    );

                    window.location.href =
                        "areaProfessor.html";
                }

            } catch (erro) {

                console.error(
                    "Erro no login:",
                    erro
                );

                alert(
                    "Não foi possível conectar ao servidor."
                );
            }
        }
    );
});


// =====================================================
// PROTEÇÃO DA ÁREA DO CLIENTE
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const paginaAtual =
        window.location.pathname
            .split("/")
            .pop();

    if (paginaAtual !== "areaCliente.html") {
        return;
    }

    const idAluno =
        obterIdAluno();

    const token =
        obterToken();

    if (!idAluno || !token) {

        alert(
            "Você precisa fazer login para acessar a área do cliente."
        );

        window.location.href =
            "login.html";

        return;
    }

    const nomeAluno =
        localStorage.getItem(
            "nome_aluno"
        );

    const elementoNome =
        document.getElementById(
            "nomeAluno"
        );

    if (elementoNome && nomeAluno) {

        elementoNome.textContent =
            `Olá, ${nomeAluno}`;
    }
});


// =====================================================
// PROTEÇÃO DA ÁREA DO PROFESSOR
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const paginaAtual =
        window.location.pathname
            .split("/")
            .pop();

    if (paginaAtual !== "areaProfessor.html") {
        return;
    }

    const idProfessor =
        obterIdProfessor();

    const token =
        obterToken();

    if (!idProfessor || !token) {

        alert(
            "Você precisa fazer login para acessar a área do professor."
        );

        window.location.href =
            "login.html";

        return;
    }

    carregarPerfilProfessor();
    carregarMeusAlunos();
    carregarSolicitacoesProfessor();
});


// =====================================================
// CARREGAR PERFIL DO PROFESSOR
// GET /professor/:id
// =====================================================

async function carregarPerfilProfessor() {

    const idProfessor =
        obterIdProfessor();

    const token =
        obterToken();

    if (!idProfessor || !token) {

        console.log(
            "ID do professor ou token não encontrado."
        );

        return;
    }

    try {

        const resposta =
            await fetch(
                `${API_URL}/professor/${idProfessor}`,
                {
                    method: "GET",

                    headers:
                        obterHeadersAutenticacao()
                }
            );

        const dados =
            await lerResposta(
                resposta
            );

        console.log(
            "Dados do professor recebidos:",
            dados
        );

        if (!resposta.ok) {

            console.error(
                "Erro ao buscar professor:",
                dados
            );

            return;
        }

        const professor =
            dados.professor ??
            dados;

        const nomeProfessor =
            document.getElementById(
                "nomeProfessor"
            );

        const perfilNomeProfessor =
            document.getElementById(
                "perfilNomeProfessor"
            );

        const perfilEmailProfessor =
            document.getElementById(
                "perfilEmailProfessor"
            );

        const perfilCrefProfessor =
            document.getElementById(
                "perfilCrefProfessor"
            );

        const perfilEspecialidadeProfessor =
            document.getElementById(
                "perfilEspecialidadeProfessor"
            );

        const perfilBachareladoProfessor =
            document.getElementById(
                "perfilBachareladoProfessor"
            );

        const perfilFormacaoProfessor =
            document.getElementById(
                "perfilFormacaoProfessor"
            );

        const perfilCurriculoProfessor =
            document.getElementById(
                "perfilCurriculoProfessor"
            );

        if (nomeProfessor) {

            nomeProfessor.textContent =
                `Olá, Prof. ${professor.nome || ""}`;
        }

        if (perfilNomeProfessor) {

            perfilNomeProfessor.textContent =
                professor.nome ||
                "Não informado";
        }

        if (perfilEmailProfessor) {

            perfilEmailProfessor.textContent =
                professor.email ||
                "Não informado";
        }

        if (perfilCrefProfessor) {

            perfilCrefProfessor.textContent =
                professor.registro_cref ||
                "Não informado";
        }

        if (perfilEspecialidadeProfessor) {

            perfilEspecialidadeProfessor.textContent =
                professor.especialidade ||
                "Não informado";
        }

        if (perfilBachareladoProfessor) {

            perfilBachareladoProfessor.textContent =
                professor.bacharelado ||
                "Não informado";
        }

        if (perfilFormacaoProfessor) {

            perfilFormacaoProfessor.textContent =
                professor.formacao_academica ||
                "Não informado";
        }

        if (perfilCurriculoProfessor) {

            perfilCurriculoProfessor.textContent =
                professor.curriculo ||
                "Não informado";
        }

        salvarDadosProfessor(
            professor
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar dados do professor:",
            erro
        );
    }
}


// =====================================================
// MEUS DADOS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const dadosNome =
        document.getElementById(
            "dadosNome"
        );

    const dadosEmail =
        document.getElementById(
            "dadosEmail"
        );

    const dadosCpf =
        document.getElementById(
            "dadosCpf"
        );

    if (
        !dadosNome &&
        !dadosEmail &&
        !dadosCpf
    ) {
        return;
    }

    const nome =
        localStorage.getItem(
            "nome_aluno"
        );

    const email =
        localStorage.getItem(
            "email_aluno"
        );

    const cpf =
        localStorage.getItem(
            "cpf_aluno"
        );

    if (dadosNome) {

        dadosNome.textContent =
            nome ||
            "Não informado";
    }

    if (dadosEmail) {

        dadosEmail.textContent =
            email ||
            "Não informado";
    }

    if (dadosCpf) {

        dadosCpf.textContent =
            cpf ||
            "Não informado";
    }
});


// =====================================================
// FICHA DO ALUNO
// =====================================================

function mostrarDadosFicha(ficha) {

    const fichaIdade =
        document.getElementById(
            "fichaIdade"
        );

    const fichaAltura =
        document.getElementById(
            "fichaAltura"
        );

    const fichaPeso =
        document.getElementById(
            "fichaPeso"
        );

    const fichaObjetivo =
        document.getElementById(
            "fichaObjetivo"
        );

    if (!ficha) {

        mostrarFichaNaoInformada();

        return;
    }

    if (fichaIdade) {

        fichaIdade.textContent =
            ficha.idade !== null &&
            ficha.idade !== undefined &&
            ficha.idade !== ""
                ? ficha.idade
                : "Não informado";
    }

    if (fichaAltura) {

        fichaAltura.textContent =
            ficha.altura !== null &&
            ficha.altura !== undefined &&
            ficha.altura !== ""
                ? ficha.altura
                : "Não informado";
    }

    if (fichaPeso) {

        fichaPeso.textContent =
            ficha.peso !== null &&
            ficha.peso !== undefined &&
            ficha.peso !== ""
                ? ficha.peso
                : "Não informado";
    }

    if (fichaObjetivo) {

        fichaObjetivo.textContent =
            ficha.objetivo !== null &&
            ficha.objetivo !== undefined &&
            ficha.objetivo !== ""
                ? ficha.objetivo
                : "Não informado";
    }
}

function mostrarFichaNaoInformada() {

    const campos = [
        "fichaIdade",
        "fichaAltura",
        "fichaPeso",
        "fichaObjetivo"
    ];

    campos.forEach((id) => {

        const elemento =
            document.getElementById(
                id
            );

        if (elemento) {

            elemento.textContent =
                "Não informado";
        }
    });
}


// =====================================================
// CARREGAR FICHA
// GET /ficha-aluno/aluno/:id
// =====================================================

async function carregarFicha() {

    const idAluno =
        obterIdAluno();

    const token =
        obterToken();

    if (!idAluno || !token) {

        console.log(
            "Aluno ou token não encontrado."
        );

        mostrarFichaNaoInformada();

        return;
    }

    try {

        const resposta =
            await fetch(
                `${API_URL}/ficha-aluno/aluno/${idAluno}`,
                {
                    method: "GET",

                    headers:
                        obterHeadersAutenticacao()
                }
            );

        const dados =
            await lerResposta(
                resposta
            );

        console.log(
            "Ficha recebida:",
            dados
        );

        if (
            dados.mensagem ===
            "Ficha não encontrada"
        ) {

            mostrarFichaNaoInformada();

            return;
        }

        if (!resposta.ok) {

            console.error(
                "Erro ao carregar ficha:",
                dados
            );

            mostrarFichaNaoInformada();

            return;
        }

        mostrarDadosFicha(
            dados.ficha ??
            dados
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar ficha:",
            erro
        );

        mostrarFichaNaoInformada();
    }
}


// =====================================================
// SALVAR / ATUALIZAR FICHA
// =====================================================

async function salvarFicha() {

    const idAluno =
        obterIdAluno();

    const token =
        obterToken();

    if (!idAluno || !token) {

        alert(
            "Sua sessão expirou. Faça login novamente."
        );

        window.location.href =
            "login.html";

        return;
    }

    const idadeElement =
        document.getElementById(
            "modalIdade"
        );

    const alturaElement =
        document.getElementById(
            "modalAltura"
        );

    const pesoElement =
        document.getElementById(
            "modalPeso"
        );

    const objetivoElement =
        document.getElementById(
            "modalObjetivo"
        );

    const idade =
        idadeElement
            ? idadeElement.value.trim()
            : "";

    const altura =
        alturaElement
            ? alturaElement.value
                .trim()
                .replace(",", ".")
            : "";

    const peso =
        pesoElement
            ? pesoElement.value
                .trim()
                .replace(",", ".")
            : "";

    const objetivo =
        objetivoElement
            ? objetivoElement.value
            : "";

    if (
        !idade ||
        !altura ||
        !peso ||
        !objetivo
    ) {

        alert(
            "Preencha todos os campos da ficha."
        );

        return;
    }

    const dados = {

        id_aluno:
            Number(idAluno),

        idade:
            Number(idade),

        altura:
            Number(altura),

        peso:
            Number(peso),

        objetivo
    };

    console.log(
        "Dados da ficha enviados:",
        dados
    );

    try {

        const respostaBusca =
            await fetch(
                `${API_URL}/ficha-aluno/aluno/${idAluno}`,
                {
                    method: "GET",

                    headers:
                        obterHeadersAutenticacao()
                }
            );

        const fichaAtual =
            await lerResposta(
                respostaBusca
            );

        let respostaSalvar;

        if (
            respostaBusca.ok &&
            fichaAtual &&
            fichaAtual.id_ficha
        ) {

            respostaSalvar =
                await fetch(
                    `${API_URL}/ficha-aluno/aluno/${idAluno}`,
                    {
                        method: "PUT",

                        headers:
                            obterHeadersAutenticacao(),

                        body:
                            JSON.stringify(
                                dados
                            )
                    }
                );

        } else {

            respostaSalvar =
                await fetch(
                    `${API_URL}/ficha-aluno`,
                    {
                        method: "POST",

                        headers:
                            obterHeadersAutenticacao(),

                        body:
                            JSON.stringify(
                                dados
                            )
                    }
                );
        }

        const resultado =
            await lerResposta(
                respostaSalvar
            );

        console.log(
            "Resposta ao salvar ficha:",
            resultado
        );

        if (!respostaSalvar.ok) {

            alert(
                resultado.mensagem ||
                resultado.message ||
                "Não foi possível salvar a ficha."
            );

            return;
        }

        const fichaSalva =
            resultado.ficha ??
            resultado;

        mostrarDadosFicha(
            fichaSalva
        );

        if (
            typeof fecharModalFicha ===
            "function"
        ) {

            fecharModalFicha();
        }

        alert(
            resultado.mensagem ||
            "Ficha salva com sucesso!"
        );

    } catch (erro) {

        console.error(
            "Erro ao salvar ficha:",
            erro
        );

        alert(
            "Não foi possível conectar ao servidor."
        );
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const formFicha =
        document.getElementById(
            "formFicha"
        );

    if (!formFicha) return;

    formFicha.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            await salvarFicha();
        }
    );
});

document.addEventListener("DOMContentLoaded", () => {

    const paginaAtual =
        window.location.pathname
            .split("/")
            .pop();

    if (paginaAtual !== "areaCliente.html") {
        return;
    }

    carregarFicha();
});


// =====================================================
// CARREGAR PROFESSORES
// GET /professor
// =====================================================

async function carregarProfessores() {

    const listaProfessores =
        document.getElementById(
            "listaProfessores"
        );

    if (!listaProfessores) return;

    listaProfessores.innerHTML =
        "<p>Carregando professores...</p>";

    try {

        const resposta =
            await fetch(
                `${API_URL}/professor`,
                {
                    method: "GET",

                    headers:
                        obterHeadersAutenticacao()
                }
            );

        const professores =
            await lerResposta(
                resposta
            );

        console.log(
            "Professores recebidos:",
            professores
        );

        if (!resposta.ok) {

            listaProfessores.innerHTML =
                "<p>Não foi possível carregar os professores.</p>";

            return;
        }

        if (
            !Array.isArray(professores) ||
            professores.length === 0
        ) {

            listaProfessores.innerHTML =
                "<p>Nenhum professor cadastrado.</p>";

            return;
        }

        listaProfessores.innerHTML =
            "";

        professores.forEach(
            (professor) => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.classList.add(
                    "card-professor"
                );

                const idProfessor =
                    professor.id_professor ??
                    professor.id;

                const cref =
                    professor.registro_cref ??
                    professor.cref ??
                    "";

                card.innerHTML = `
                    <div class="professor-info">

                        <h3>
                            ${professor.nome ?? "Professor"}
                        </h3>

                        <p>
                            ${professor.email ?? ""}
                        </p>

                        ${
                            cref
                                ? `<p>CREF: ${cref}</p>`
                                : ""
                        }

                        ${
                            professor.especialidade
                                ? `
                                    <p>
                                        Especialidade:
                                        ${professor.especialidade}
                                    </p>
                                `
                                : ""
                        }

                    </div>

                    <button
                        type="button"
                        class="btn-conectar-professor"
                        data-id="${idProfessor}"
                    >
                        Conectar
                    </button>
                `;

                listaProfessores.appendChild(
                    card
                );
            }
        );

        const botoes =
            listaProfessores.querySelectorAll(
                ".btn-conectar-professor"
            );

        botoes.forEach(
            (botao) => {

                botao.addEventListener(
                    "click",
                    () => {

                        const idProfessor =
                            botao.dataset.id;

                        if (!idProfessor) {

                            alert(
                                "Não foi possível identificar o professor."
                            );

                            return;
                        }

                        conectarProfessor(
                            Number(idProfessor)
                        );
                    }
                );
            }
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar professores:",
            erro
        );

        listaProfessores.innerHTML =
            "<p>Não foi possível carregar os professores.</p>";
    }
}


// =====================================================
// SOLICITAR CONEXÃO COM PROFESSOR
// POST /professor-aluno
// =====================================================

async function conectarProfessor(
    idProfessor
) {

    const token =
        obterToken();

    if (!token) {

        alert(
            "Faça login para solicitar conexão com um professor."
        );

        window.location.href =
            "login.html";

        return;
    }

    if (!idProfessor) {

        alert(
            "Professor inválido."
        );

        return;
    }

    try {

        console.log("Enviando solicitação:", {
    id_professor: Number(idProfessor)
});
        const resposta =
            await fetch(
                `${API_URL}/professor-aluno`,
                {
                    method: "POST",

                    headers:
                        obterHeadersAutenticacao(),

                    body:
                        JSON.stringify({
                            id_professor:
                                Number(idProfessor)
                        })
                }
            );

        const resultado =
            await lerResposta(
                resposta
            );

        console.log(
            "Resposta da solicitação:",
            resultado
        );

        if (!resposta.ok) {

            alert(
                resultado.mensagem ||
                resultado.message ||
                "Não foi possível enviar a solicitação."
            );

            return;
        }

        alert(
            resultado.mensagem ||
            "Solicitação enviada ao professor!"
        );

        await carregarProfessores();

    } catch (erro) {

        console.error(
            "Erro ao solicitar conexão:",
            erro
        );

        alert(
            "Não foi possível enviar a solicitação."
        );
    }
}


// =====================================================
// ABRIR MODAL DE PROFESSORES
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const abrirModalProfessores =
        document.getElementById(
            "abrirModalProfessores"
        );

    if (!abrirModalProfessores) return;

    abrirModalProfessores.addEventListener(
        "click",
        () => {

            carregarProfessores();
        }
    );
});


// =====================================================
// PROFESSOR CONECTADO
// GET /professor-aluno/aluno/:id
// =====================================================

async function carregarProfessorConectado() {

    const professorNome =
        document.getElementById(
            "professorNome"
        );

    const professorEspecialidade =
        document.getElementById(
            "professorEspecialidade"
        );

    const botaoConectar =
        document.getElementById(
            "botaoConectarProfessor"
        );

    const idAluno =
        obterIdAluno();

    const token =
        obterToken();

    if (!professorNome) return;

    if (!idAluno || !token) {

        professorNome.textContent =
            "Nenhum professor conectado";

        if (professorEspecialidade) {

            professorEspecialidade.textContent =
                "";
        }

        if (botaoConectar) {

            botaoConectar.style.display =
                "block";
        }

        return;
    }

    try {

        const resposta =
            await fetch(
                `${API_URL}/professor-aluno/aluno/${idAluno}`,
                {
                    method: "GET",

                    headers:
                        obterHeadersAutenticacao()
                }
            );

        const dados =
            await lerResposta(
                resposta
            );

        console.log(
            "Professor conectado:",
            dados
        );

        if (!resposta.ok) {

            throw new Error(
                dados?.message ||
                dados?.mensagem ||
                "Erro ao buscar professor conectado"
            );
        }

        if (
            !Array.isArray(dados) ||
            dados.length === 0
        ) {

            professorNome.textContent =
                "Nenhum professor conectado";

            if (professorEspecialidade) {

                professorEspecialidade.textContent =
                    "";
            }

            if (botaoConectar) {

                botaoConectar.style.display =
                    "block";
            }

            return;
        }

        const professor =
            dados[0];

        professorNome.textContent =
            `Prof. ${professor.nome}`;

        if (professorEspecialidade) {

            professorEspecialidade.textContent =
                professor.especialidade ||
                "Personal Trainer";
        }

        if (botaoConectar) {

            botaoConectar.style.display =
                "none";
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar professor conectado:",
            erro
        );

        professorNome.textContent =
            "Nenhum professor conectado";

        if (professorEspecialidade) {

            professorEspecialidade.textContent =
                "";
        }

        if (botaoConectar) {

            botaoConectar.style.display =
                "block";
        }
    }
}


// =====================================================
// BOTÃO CONECTAR PROFESSOR
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const botao =
        document.getElementById(
            "botaoConectarProfessor"
        );

    if (!botao) return;

    botao.addEventListener(
        "click",
        () => {

            const botaoModal =
                document.getElementById(
                    "abrirModalProfessores"
                );

            if (botaoModal) {

                botaoModal.click();
            }
        }
    );
});


// =====================================================
// CARREGAR PROFESSOR CONECTADO AO ABRIR ÁREA DO CLIENTE
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const paginaAtual =
        window.location.pathname
            .split("/")
            .pop();

    if (paginaAtual !== "areaCliente.html") {
        return;
    }

    carregarProfessorConectado();
});


// ==================================================
// EDITAR PERFIL DO PROFESSOR
// ==================================================

async function editarPerfilProfessor() {

    const idProfessor =
        obterIdProfessor();

    if (!idProfessor) {

        alert(
            "Professor não identificado."
        );

        return;
    }

    const dados = {

        nome:
            document.getElementById(
                "editarNomeProfessor"
            ).value.trim(),

        email:
            document.getElementById(
                "editarEmailProfessor"
            ).value.trim(),

        registro_cref:
            document.getElementById(
                "editarCrefProfessor"
            ).value.trim(),

        especialidade:
            document.getElementById(
                "editarEspecialidadeProfessor"
            ).value.trim(),

        bacharelado:
            document.getElementById(
                "editarBachareladoProfessor"
            ).value.trim(),

        formacao_academica:
            document.getElementById(
                "editarFormacaoProfessor"
            ).value.trim(),

        curriculo:
            document.getElementById(
                "editarCurriculoProfessor"
            ).value.trim()
    };

    if (!dados.nome || !dados.email) {

        alert(
            "Nome e e-mail são obrigatórios."
        );

        return;
    }

    try {

        const resposta =
            await fetch(
                `${API_URL}/professor/${idProfessor}`,
                {
                    method: "PUT",

                    headers:
                        obterHeadersAutenticacao(),

                    body:
                        JSON.stringify(
                            dados
                        )
                }
            );

        const resultado =
            await lerResposta(
                resposta
            );

        if (!resposta.ok) {

            alert(
                resultado.mensagem ||
                "Não foi possível atualizar o perfil."
            );

            return;
        }

        localStorage.setItem(
            "nome_professor",
            dados.nome
        );

        localStorage.setItem(
            "email_professor",
            dados.email
        );

        alert(
            "Perfil atualizado com sucesso!"
        );

        const modal =
            document.getElementById(
                "modalEditarPerfil"
            );

        if (modal) {

            modal.style.display =
                "none";
        }

        await carregarPerfilProfessor();

    } catch (erro) {

        console.error(
            "Erro ao atualizar perfil:",
            erro
        );

        alert(
            "Erro de conexão com o servidor."
        );
    }
}


// ==================================================
// ABRIR MODAL DE EDIÇÃO
// ==================================================

function abrirModalEditarPerfil() {

    const modal =
        document.getElementById(
            "modalEditarPerfil"
        );

    if (!modal) return;

    const nome =
        document.getElementById(
            "perfilNomeProfessor"
        );

    const email =
        document.getElementById(
            "perfilEmailProfessor"
        );

    const cref =
        document.getElementById(
            "perfilCrefProfessor"
        );

    const especialidade =
        document.getElementById(
            "perfilEspecialidadeProfessor"
        );

    const bacharelado =
        document.getElementById(
            "perfilBachareladoProfessor"
        );

    const formacao =
        document.getElementById(
            "perfilFormacaoProfessor"
        );

    const curriculo =
        document.getElementById(
            "perfilCurriculoProfessor"
        );

    document.getElementById(
        "editarNomeProfessor"
    ).value =
        nome
            ? nome.textContent.trim()
            : "";

    document.getElementById(
        "editarEmailProfessor"
    ).value =
        email
            ? email.textContent.trim()
            : "";

    document.getElementById(
        "editarCrefProfessor"
    ).value =
        cref
            ? cref.textContent.trim()
            : "";

    document.getElementById(
        "editarEspecialidadeProfessor"
    ).value =
        especialidade
            ? especialidade.textContent.trim()
            : "";

    document.getElementById(
        "editarBachareladoProfessor"
    ).value =
        bacharelado
            ? bacharelado.textContent.trim()
            : "";

    document.getElementById(
        "editarFormacaoProfessor"
    ).value =
        formacao
            ? formacao.textContent.trim()
            : "";

    document.getElementById(
        "editarCurriculoProfessor"
    ).value =
        curriculo
            ? curriculo.textContent.trim()
            : "";

    modal.style.display =
        "flex";
}


// ==================================================
// FECHAR MODAL DE EDIÇÃO
// ==================================================

function fecharModalEditarPerfil() {

    const modal =
        document.getElementById(
            "modalEditarPerfil"
        );

    if (modal) {

        modal.style.display =
            "none";
    }
}


// ==================================================
// CONFIGURAÇÃO DOS BOTÕES DE EDIÇÃO
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

    const botaoEditar =
        document.getElementById(
            "btnEditarPerfil"
        );

    const botaoFechar =
        document.getElementById(
            "fecharEditarPerfil"
        );

    const formulario =
        document.getElementById(
            "formEditarPerfil"
        );

    if (botaoEditar) {

        botaoEditar.addEventListener(
            "click",
            abrirModalEditarPerfil
        );
    }

    if (botaoFechar) {

        botaoFechar.addEventListener(
            "click",
            fecharModalEditarPerfil
        );
    }

    if (formulario) {

        formulario.addEventListener(
            "submit",
            async (evento) => {

                evento.preventDefault();

                await editarPerfilProfessor();
            }
        );
    }

    const modal =
        document.getElementById(
            "modalEditarPerfil"
        );

    if (modal) {

        modal.addEventListener(
            "click",
            (evento) => {

                if (evento.target === modal) {

                    fecharModalEditarPerfil();
                }
            }
        );
    }
});


// =====================================================
// CARREGAR ALUNOS CONECTADOS AO PROFESSOR
// GET /professor-aluno
// =====================================================

async function carregarMeusAlunos() {

    const lista =
        document.getElementById(
            "listaMeusAlunos"
        );

    const quantidade =
        document.getElementById(
            "quantidadeAlunosProfessor"
        );

    if (!lista) return;

    const token =
        obterToken();

    if (!token) {

        lista.innerHTML = `
            <p class="professor-loading">
                Sessão do professor não encontrada.
            </p>
        `;

        return;
    }

    try {

        const resposta =
            await fetch(
                `${API_URL}/professor-aluno`,
                {
                    method: "GET",

                    headers:
                        obterHeadersAutenticacao()
                }
            );

        const resultado =
            await lerResposta(
                resposta
            );

        console.log(
            "Alunos conectados ao professor:",
            resultado
        );

        if (!resposta.ok) {

            lista.innerHTML = `
                <p class="professor-loading">
                    Não foi possível carregar os alunos.
                </p>
            `;

            console.error(
                "Erro ao buscar alunos:",
                resultado
            );

            return;
        }

        const alunos =
            Array.isArray(resultado)
                ? resultado
                : [];

        window.alunosProfessor =
            alunos;

        if (quantidade) {

            quantidade.textContent =
                `${alunos.length} ${
                    alunos.length === 1
                        ? "aluno"
                        : "alunos"
                }`;
        }

        if (alunos.length === 0) {

            lista.innerHTML = `
                <p class="professor-loading">
                    Nenhum aluno conectado.
                </p>
            `;

            return;
        }

        lista.innerHTML =
            "";

        alunos
            .slice(0, 3)
            .forEach(
                (aluno) => {

                    adicionarAlunoNaLista(
                        lista,
                        aluno
                    );
                }
            );

    } catch (erro) {

        console.error(
            "Erro ao carregar alunos:",
            erro
        );

        lista.innerHTML = `
            <p class="professor-loading">
                Erro de conexão com o servidor.
            </p>
        `;
    }
}


// =====================================================
// CARREGAR SOLICITAÇÕES DE CONEXÃO DO PROFESSOR
// GET /professor-aluno/solicitacoes
// =====================================================

async function carregarSolicitacoesProfessor() {

    const lista =
        document.getElementById(
            "listaSolicitacoesProfessor"
        );

    const quantidade =
        document.getElementById(
            "quantidadeSolicitacoesProfessor"
        );

    if (!lista) return;

    const token =
        obterToken();

    if (!token) {

        lista.innerHTML = `
            <p class="professor-loading">
                Sessão do professor não encontrada.
            </p>
        `;

        return;
    }

    try {

        const resposta =
            await fetch(
                `${API_URL}/professor-aluno/solicitacoes`,
                {
                    method: "GET",

                    headers:
                        obterHeadersAutenticacao()
                }
            );

        const resultado =
            await lerResposta(
                resposta
            );

        console.log(
            "Solicitações recebidas:",
            resultado
        );

        if (!resposta.ok) {

            lista.innerHTML = `
                <p class="professor-loading">
                    Não foi possível carregar as solicitações.
                </p>
            `;

            return;
        }

        const solicitacoes =
            Array.isArray(resultado)
                ? resultado
                : [];

        window.solicitacoesProfessor =
            solicitacoes;

        if (quantidade) {

            quantidade.textContent =
                `${solicitacoes.length} ${
                    solicitacoes.length === 1
                        ? "solicitação"
                        : "solicitações"
                }`;
        }

        if (solicitacoes.length === 0) {

            lista.innerHTML = `
                <p class="professor-loading">
                    Nenhuma solicitação pendente.
                </p>
            `;

            return;
        }

        lista.innerHTML =
            "";

        solicitacoes.forEach(
            (solicitacao) => {

                adicionarSolicitacaoNaLista(
                    lista,
                    solicitacao
                );
            }
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar solicitações:",
            erro
        );

        lista.innerHTML = `
            <p class="professor-loading">
                Erro de conexão com o servidor.
            </p>
        `;
    }
}


// =====================================================
// ADICIONAR SOLICITAÇÃO À LISTA
// =====================================================

function adicionarSolicitacaoNaLista(
    lista,
    solicitacao
) {

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "professor-request-item";

    const nomeAluno =
        solicitacao.nome_aluno ||
        "Aluno sem nome";

    const emailAluno =
        solicitacao.email_aluno ||
        "E-mail não informado";

    const idSolicitacao =
        solicitacao.id_solicitacao;

    item.innerHTML = `
        <div class="professor-request-information">

            <strong>
                ${nomeAluno}
            </strong>

            <span>
                E-mail: ${emailAluno}
            </span>

        </div>

        <div class="professor-request-actions">

            <button
                type="button"
                class="professor-accept-button"
                data-id="${idSolicitacao}"
            >
                Aceitar
            </button>

            <button
                type="button"
                class="professor-refuse-button"
                data-id="${idSolicitacao}"
            >
                Recusar
            </button>

        </div>
    `;

    const botaoAceitar =
        item.querySelector(
            ".professor-accept-button"
        );

    const botaoRecusar =
        item.querySelector(
            ".professor-refuse-button"
        );

    if (botaoAceitar) {

        botaoAceitar.addEventListener(
            "click",
            async () => {

                await responderSolicitacao(
                    Number(idSolicitacao),
                    "aceitar"
                );
            }
        );
    }

    if (botaoRecusar) {

        botaoRecusar.addEventListener(
            "click",
            async () => {

                await responderSolicitacao(
                    Number(idSolicitacao),
                    "recusar"
                );
            }
        );
    }

    lista.appendChild(
        item
    );
}


// =====================================================
// ACEITAR / RECUSAR SOLICITAÇÃO
// =====================================================

async function responderSolicitacao(
    idSolicitacao,
    acao
) {

    const token =
        obterToken();

    if (!token) {

        alert(
            "Sua sessão expirou. Faça login novamente."
        );

        window.location.href =
            "login.html";

        return;
    }

    if (!idSolicitacao) {

        alert(
            "Solicitação inválida."
        );

        return;
    }

    const mensagemConfirmacao =
        acao === "aceitar"
            ? "Deseja aceitar esta solicitação?"
            : "Deseja recusar esta solicitação?";

    if (!confirm(mensagemConfirmacao)) {
        return;
    }

    try {

        const resposta =
            await fetch(
                `${API_URL}/professor-aluno/solicitacoes/${idSolicitacao}/${acao}`,
                {
                    method: "POST",

                    headers:
                        obterHeadersAutenticacao()
                }
            );

        const resultado =
            await lerResposta(
                resposta
            );

        console.log(
            "Resposta da solicitação:",
            resultado
        );

        if (!resposta.ok) {

            alert(
                resultado.mensagem ||
                resultado.message ||
                "Não foi possível responder à solicitação."
            );

            return;
        }

        alert(
            resultado.mensagem ||
            (
                acao === "aceitar"
                    ? "Solicitação aceita com sucesso!"
                    : "Solicitação recusada com sucesso!"
            )
        );

        await carregarSolicitacoesProfessor();

        if (acao === "aceitar") {

            await carregarMeusAlunos();
        }

    } catch (erro) {

        console.error(
            "Erro ao responder solicitação:",
            erro
        );

        alert(
            "Não foi possível responder à solicitação."
        );
    }
}


// =====================================================
// ADICIONAR ALUNO À LISTA
// =====================================================

function adicionarAlunoNaLista(
    lista,
    aluno
) {

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "professor-student-item";

    const nomeAluno =
        aluno.nome_aluno ||
        "Aluno sem nome";

    const emailAluno =
        aluno.email_aluno ||
        "E-mail não informado";

    item.innerHTML = `
        <div class="professor-student-information">

            <strong>
                ${nomeAluno}
            </strong>

            <span>
                E-mail: ${emailAluno}
            </span>

        </div>

        <button
            type="button"
            class="professor-secondary-button"
        >
            Ver ficha
        </button>
    `;

    const botaoFicha =
        item.querySelector(
            ".professor-secondary-button"
        );

    if (botaoFicha) {

        botaoFicha.addEventListener(
            "click",
            () => {

                abrirFichaAlunoProfessor(
                    aluno.id_aluno,
                    nomeAluno
                );
            }
        );
    }

    lista.appendChild(
        item
    );
}


// =====================================================
// ABRIR MODAL — TODOS OS ALUNOS
// =====================================================

function abrirModalTodosAlunosProfessor() {

    const modal =
        document.getElementById(
            "modalTodosAlunosProfessor"
        );

    const lista =
        document.getElementById(
            "listaTodosAlunosProfessor"
        );

    if (!modal || !lista) {

        console.error(
            "Modal de todos os alunos não encontrado."
        );

        return;
    }

    const alunos =
        window.alunosProfessor ||
        [];

    lista.innerHTML =
        "";

    if (alunos.length === 0) {

        lista.innerHTML = `
            <p class="professor-loading">
                Nenhum aluno conectado.
            </p>
        `;

        modal.style.display =
            "flex";

        return;
    }

    alunos.forEach(
        (aluno) => {

            adicionarAlunoNaLista(
                lista,
                aluno
            );
        }
    );

    modal.style.display =
        "flex";
}


// =====================================================
// FECHAR MODAL — TODOS OS ALUNOS
// =====================================================

function fecharModalTodosAlunosProfessor() {

    const modal =
        document.getElementById(
            "modalTodosAlunosProfessor"
        );

    if (modal) {

        modal.style.display =
            "none";
    }
}


// =====================================================
// CONFIGURAÇÃO DO MODAL DE TODOS OS ALUNOS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const botaoVerAlunos =
        document.getElementById(
            "btnVerAlunosProfessor"
        );

    const botaoVisualizarTodos =
        document.getElementById(
            "btnVisualizarTodosAlunos"
        );

    const botaoFechar =
        document.getElementById(
            "fecharTodosAlunosProfessor"
        );

    const modal =
        document.getElementById(
            "modalTodosAlunosProfessor"
        );

    if (botaoVerAlunos) {

        botaoVerAlunos.addEventListener(
            "click",
            abrirModalTodosAlunosProfessor
        );
    }

    if (botaoVisualizarTodos) {

        botaoVisualizarTodos.addEventListener(
            "click",
            abrirModalTodosAlunosProfessor
        );
    }

    if (botaoFechar) {

        botaoFechar.addEventListener(
            "click",
            fecharModalTodosAlunosProfessor
        );
    }

    if (modal) {

        modal.addEventListener(
            "click",
            (evento) => {

                if (evento.target === modal) {

                    fecharModalTodosAlunosProfessor();
                }
            }
        );
    }
});


// =====================================================
// ABRIR FICHA DO ALUNO - PROFESSOR
// GET /ficha-aluno/aluno/:id
// =====================================================

async function abrirFichaAlunoProfessor(
    idAluno,
    nomeAluno
) {

    const modal =
        document.getElementById(
            "modalFichaAlunoProfessor"
        );

    if (!modal) {

        console.error(
            "Modal da ficha do aluno não encontrado."
        );

        return;
    }

    const nome =
        document.getElementById(
            "nomeFichaAlunoProfessor"
        );

    const idade =
        document.getElementById(
            "fichaAlunoIdadeProfessor"
        );

    const peso =
        document.getElementById(
            "fichaAlunoPesoProfessor"
        );

    const altura =
        document.getElementById(
            "fichaAlunoAlturaProfessor"
        );

    const objetivo =
        document.getElementById(
            "fichaAlunoObjetivoProfessor"
        );

    const tempo =
        document.getElementById(
            "fichaAlunoTempoProfessor"
        );

    const atualizacao =
        document.getElementById(
            "fichaAlunoAtualizacaoProfessor"
        );

    if (nome) {

        nome.textContent =
            nomeAluno ||
            "Aluno";
    }

    if (idade) {
        idade.textContent =
            "Carregando...";
    }

    if (peso) {
        peso.textContent =
            "Carregando...";
    }

    if (altura) {
        altura.textContent =
            "Carregando...";
    }

    if (objetivo) {
        objetivo.textContent =
            "Carregando...";
    }

    if (tempo) {
        tempo.textContent =
            "Não informado";
    }

    if (atualizacao) {
        atualizacao.textContent =
            "Não informado";
    }

    modal.style.display =
        "flex";

    try {

        const resposta =
            await fetch(
                `${API_URL}/ficha-aluno/aluno/${idAluno}`,
                {
                    method: "GET",

                    headers:
                        obterHeadersAutenticacao()
                }
            );

        const resultado =
            await lerResposta(
                resposta
            );

        console.log(
            "Ficha do aluno:",
            resultado
        );

        if (!resposta.ok) {

            if (idade) {
                idade.textContent =
                    "Não disponível";
            }

            if (peso) {
                peso.textContent =
                    "Não disponível";
            }

            if (altura) {
                altura.textContent =
                    "Não disponível";
            }

            if (objetivo) {
                objetivo.textContent =
                    "Não disponível";
            }

            alert(
                resultado.mensagem ||
                resultado.message ||
                "Não foi possível carregar a ficha do aluno."
            );

            return;
        }

        if (
            resultado.mensagem ===
            "Ficha não encontrada"
        ) {

            if (idade) {
                idade.textContent =
                    "Não informado";
            }

            if (peso) {
                peso.textContent =
                    "Não informado";
            }

            if (altura) {
                altura.textContent =
                    "Não informado";
            }

            if (objetivo) {
                objetivo.textContent =
                    "Não informado";
            }

            return;
        }

        const ficha =
            resultado.ficha ??
            resultado;

        if (idade) {

            idade.textContent =
                ficha.idade !== null &&
                ficha.idade !== undefined &&
                ficha.idade !== ""
                    ? `${ficha.idade} anos`
                    : "Não informado";
        }

        if (peso) {

            peso.textContent =
                ficha.peso !== null &&
                ficha.peso !== undefined &&
                ficha.peso !== ""
                    ? `${ficha.peso} kg`
                    : "Não informado";
        }

        if (altura) {

            altura.textContent =
                ficha.altura !== null &&
                ficha.altura !== undefined &&
                ficha.altura !== ""
                    ? `${ficha.altura} cm`
                    : "Não informado";
        }

        if (objetivo) {

            objetivo.textContent =
                ficha.objetivo ||
                "Não informado";
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar ficha do aluno:",
            erro
        );

        if (idade) {
            idade.textContent =
                "Não disponível";
        }

        if (peso) {
            peso.textContent =
                "Não disponível";
        }

        if (altura) {
            altura.textContent =
                "Não disponível";
        }

        if (objetivo) {
            objetivo.textContent =
                "Não disponível";
        }

        alert(
            "Erro de conexão com o servidor."
        );
    }
}


// =====================================================
// FECHAR FICHA DO ALUNO
// =====================================================

function fecharFichaAlunoProfessor() {

    const modal =
        document.getElementById(
            "modalFichaAlunoProfessor"
        );

    if (modal) {

        modal.style.display =
            "none";
    }
}


// =====================================================
// CONFIGURAÇÃO DO MODAL DA FICHA
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const modal =
        document.getElementById(
            "modalFichaAlunoProfessor"
        );

    const botaoFechar =
        document.getElementById(
            "fecharFichaAlunoProfessor"
        );

    if (botaoFechar) {

        botaoFechar.addEventListener(
            "click",
            fecharFichaAlunoProfessor
        );
    }

    if (modal) {

        modal.addEventListener(
            "click",
            (evento) => {

                if (evento.target === modal) {

                    fecharFichaAlunoProfessor();
                }
            }
        );
    }
});

function carregarSolicitacoesModalProfessor() {

    const lista =
        document.getElementById(
            "listaModalSolicitacoesProfessor"
        );

    if (!lista) {
        return;
    }

    const solicitacoes =
        window.solicitacoesProfessor || [];

    if (solicitacoes.length === 0) {

        lista.innerHTML = `
            <p class="professor-loading">
                Nenhuma solicitação pendente.
            </p>
        `;

        return;
    }

    lista.innerHTML = "";

    solicitacoes.forEach((solicitacao) => {

        adicionarSolicitacaoNaLista(
            lista,
            solicitacao
        );

    });
}
