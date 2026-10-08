alert("JavaScript da recuperação carregou!");

const API_URL = "https://titanfit.projetostit.com";

const etapaEmail = document.getElementById("etapaEmail");

const etapaCodigo = document.getElementById("etapaCodigo");

const etapaSenha = document.getElementById("etapaSenha");

const btnEnviarCodigo = document.getElementById("btnEnviarCodigo");

const btnContinuar = document.getElementById("btnContinuar");

const btnAlterarSenha = document.getElementById("btnAlterarSenha");

let tokenRecuperacao = "";

btnEnviarCodigo.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();

    const tipoUsuario = document.getElementById("tipoUsuario").value;

    if (!email) {

        alert("Digite seu e-mail.");

        return;

    }

    try {

        btnEnviarCodigo.disabled = true;

        btnEnviarCodigo.textContent = "Enviando...";

        const resposta = await fetch(

            `${API_URL}/auth/esqueci-senha`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email,

                    tipoUsuario

                })

            }

        );

        const resultado = await resposta.json();

        if (!resposta.ok) {

            alert(

                resultado.mensagem ||

                resultado.message ||

                "Não foi possível enviar o código."

            );

            return;

        }

        alert(

            "Código enviado! Verifique seu e-mail."

        );

        etapaEmail.classList.add("oculto");

        etapaCodigo.classList.remove("oculto");

    } catch (erro) {

        console.error(erro);

        alert(

            "Não foi possível conectar ao servidor."

        );

    } finally {

        btnEnviarCodigo.disabled = false;

        btnEnviarCodigo.textContent = "Enviar código";

    }

});


btnContinuar.addEventListener("click", () => {

    const token = document.getElementById("token").value.trim();

    if (!token) {

        alert("Digite o código recebido no seu e-mail.");

        return;

    }

    tokenRecuperacao = token;

    etapaCodigo.classList.add("oculto");

    etapaSenha.classList.remove("oculto");

});


btnAlterarSenha.addEventListener("click", async () => {

    const novaSenha =

        document.getElementById("novaSenha").value;

    const confirmarSenha =

        document.getElementById("confirmarSenha").value;

    if (!novaSenha || !confirmarSenha) {

        alert("Preencha os dois campos de senha.");

        return;

    }

    if (novaSenha.length < 6) {

        alert("A senha deve ter pelo menos 6 caracteres.");

        return;

    }

    if (novaSenha !== confirmarSenha) {

        alert("As senhas não são iguais.");

        return;

    }

    try {

        btnAlterarSenha.disabled = true;

        btnAlterarSenha.textContent = "Alterando...";

        const resposta = await fetch(

            `${API_URL}/auth/redefinir-senha`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    token: tokenRecuperacao,

                    novaSenha

                })

            }

        );

        const resultado = await resposta.json();

        if (!resposta.ok) {

            alert(

                resultado.mensagem ||

                resultado.message ||

                "Não foi possível alterar a senha."

            );

            return;

        }

        alert(

            "Senha alterada com sucesso!"

        );

        window.location.href = "../login.html";

    } catch (erro) {

        console.error(erro);

        alert(

            "Não foi possível conectar ao servidor."

        );

    } finally {

        btnAlterarSenha.disabled = false;

        btnAlterarSenha.textContent = "Alterar senha";

    }

});
