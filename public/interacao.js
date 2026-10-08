/* =====================================================
   TITAN FIT - INTERACAO.JS

   Somente animações e interações visuais.
   Nenhuma conexão com o back-end/API.
===================================================== */


/* =====================================================
   MENU MOBILE
===================================================== */

function toggleMenu() {

    const menu = document.getElementById("menu");

    if (menu) {
        menu.classList.toggle("active");
    }

}


/* =====================================================
   ANIMAÇÃO - SOBRE NÓS HOME
===================================================== */

const sobreNos = document.querySelector(".sobrenos-home");

if (sobreNos && "IntersectionObserver" in window) {

    const observerSobre = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    sobreNos.classList.add("animar");

                    observerSobre.disconnect();
                }

            });

        },

        {
            threshold: 0.3
        }

    );

    observerSobre.observe(sobreNos);
}


/* =====================================================
   ANIMAÇÃO - PLANOS HOME
===================================================== */

const planosHome = document.querySelectorAll(
    ".plano_basico-home, .plano_avancado-home, .plano_premium-home"
);

const secaoPlanosHome =
    document.querySelector(".caixa-planos_home");


if (
    secaoPlanosHome &&
    planosHome.length > 0 &&
    "IntersectionObserver" in window
) {

    const observerPlanos = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    planosHome.forEach((plano, index) => {

                        setTimeout(() => {

                            plano.classList.add("animar");

                        }, index * 300);

                    });

                    observerPlanos.disconnect();
                }

            });

        },

        {
            threshold: 0.3
        }

    );

    observerPlanos.observe(secaoPlanosHome);
}


/* =====================================================
   ANIMAÇÃO - SERVIÇOS HOME
===================================================== */

const servicos =
    document.querySelectorAll(".animar-servico");


if (
    servicos.length > 0 &&
    "IntersectionObserver" in window
) {

    const observerServicos = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    servicos.forEach((servico, index) => {

                        setTimeout(() => {

                            servico.classList.add("ativo");

                        }, index * 250);

                    });

                    observerServicos.disconnect();
                }

            });

        },

        {
            threshold: 0.2
        }

    );

    servicos.forEach((servico) => {

        observerServicos.observe(servico);

    });
}


/* =====================================================
   CARD CENTRAL - PÁGINA DE PLANOS
===================================================== */

const cardsContainer =
    document.querySelector(".pagina-planos-cards");

const cardsPlanos =
    document.querySelectorAll(".pagina-plano-card");


function destacarCardCentral() {

    if (
        !cardsContainer ||
        cardsPlanos.length === 0
    ) {
        return;
    }


    const centroTela =
        window.innerWidth / 2;


    let cardMaisCentral = null;

    let menorDistancia = Infinity;


    cardsPlanos.forEach((card) => {

        const rect =
            card.getBoundingClientRect();


        const centroCard =
            rect.left + rect.width / 2;


        const distancia =
            Math.abs(
                centroTela - centroCard
            );


        if (distancia < menorDistancia) {

            menorDistancia = distancia;

            cardMaisCentral = card;
        }

    });


    cardsPlanos.forEach((card) => {

        card.classList.remove("ativo");

    });


    if (cardMaisCentral) {

        cardMaisCentral.classList.add("ativo");

    }

}


if (
    cardsContainer &&
    cardsPlanos.length > 0
) {

    cardsContainer.addEventListener(
        "scroll",
        destacarCardCentral
    );


    window.addEventListener(
        "resize",
        destacarCardCentral
    );


    window.addEventListener(
        "load",
        destacarCardCentral
    );

}


/* =====================================================
   ANIMAÇÃO DE ENTRADA - PLANOS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const cards =
            document.querySelectorAll(
                ".pagina-plano-card"
            );


        const secaoPlanos =
            document.querySelector(
                ".pagina-planos-cards"
            );


        if (
            secaoPlanos &&
            cards.length > 0 &&
            "IntersectionObserver" in window
        ) {

            const observer =
                new IntersectionObserver(

                    (entries) => {

                        entries.forEach((entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                cards.forEach(
                                    (card, index) => {

                                        setTimeout(
                                            () => {

                                                card.classList.add(
                                                    "animar"
                                                );

                                            },
                                            index * 400
                                        );

                                    }
                                );


                                observer.disconnect();

                            }

                        });

                    },

                    {
                        threshold: 0.2
                    }

                );


            observer.observe(secaoPlanos);

        }

    }
);


/* =====================================================
   ANIMAÇÃO - PAGAMENTO
===================================================== */

const pagamento =
    document.querySelector(
        ".pagina-pagamento"
    );


if (
    pagamento &&
    "IntersectionObserver" in window
) {

    const observerPagamento =
        new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        pagamento.classList.add(
                            "animar"
                        );


                        observerPagamento.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.3
            }

        );


    observerPagamento.observe(pagamento);

}


/* =====================================================
   CADASTRO - ESCOLHA PROFESSOR / ALUNO

   Apenas interação visual do formulário.
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const botoes =
            document.querySelectorAll(
                ".botao-escolha"
            );


        const camposProfessor =
            document.getElementById(
                "camposProfessor"
            );


        const tipoInput =
            document.getElementById(
                "tipoInput"
            );


        if (botoes.length === 0) {
            return;
        }


        botoes.forEach((botao) => {

            botao.addEventListener(
                "click",
                () => {


                    /* Remove ativo dos outros */

                    botoes.forEach((b) => {

                        b.classList.remove(
                            "ativo"
                        );

                    });


                    /* Ativa o botão clicado */

                    botao.classList.add(
                        "ativo"
                    );


                    /* Descobre o tipo */

                    const tipo =
                        botao.dataset.tipo;


                    /* Salva no input hidden */

                    if (tipoInput) {

                        tipoInput.value =
                            tipo;

                    }


                    /* Mostra/esconde campos de professor */

                    if (camposProfessor) {

                        camposProfessor.style.display =
                            tipo === "professor"
                                ? "block"
                                : "none";

                    }

                }
            );

        });

    }
);


/* =====================================================
   ACORDEÃO PRINCIPAL

   NÃO ALTERAR:
   Faturas
   Peitoral
   Costas
   Pernas

   Esses continuam usando:
   .acordeon-titulo
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const titulosAcordeon =
            document.querySelectorAll(
                ".acordeon-titulo"
            );


        titulosAcordeon.forEach((titulo) => {


            /* Acessibilidade */

            titulo.setAttribute(
                "aria-expanded",
                "false"
            );


            titulo.addEventListener(
                "click",
                () => {

                    const itemAtual =
                        titulo.closest(
                            ".acordeon-item"
                        );


                    if (!itemAtual) {
                        return;
                    }


                    const acordeonAtual =
                        itemAtual.closest(
                            ".acordeon"
                        );


                    if (!acordeonAtual) {
                        return;
                    }


                    const itemEstaAtivo =
                        itemAtual.classList.contains(
                            "ativo"
                        );


                    /*
                     * Fecha todos os itens
                     * do mesmo acordeão
                     */

                    acordeonAtual
                        .querySelectorAll(
                            ".acordeon-item"
                        )
                        .forEach((item) => {

                            item.classList.remove(
                                "ativo"
                            );


                            const botao =
                                item.querySelector(
                                    ".acordeon-titulo"
                                );


                            if (botao) {

                                botao.setAttribute(
                                    "aria-expanded",
                                    "false"
                                );


                                const sinal =
                                    botao.querySelector(
                                        "span"
                                    );


                                if (sinal) {

                                    sinal.textContent =
                                        "+";

                                }

                            }

                        });


                    /*
                     * Se estava fechado,
                     * abre o item clicado
                     */

                    if (!itemEstaAtivo) {

                        itemAtual.classList.add(
                            "ativo"
                        );


                        titulo.setAttribute(
                            "aria-expanded",
                            "true"
                        );


                        const sinal =
                            titulo.querySelector(
                                "span"
                            );


                        if (sinal) {

                            sinal.textContent =
                                "−";

                        }

                    }

                }
            );

        });

    }
);

/* =====================================================
   MEUS DADOS
===================================================== */
function toggleAcordeao(element) {
    const conteudo = element.nextElementSibling;
    const icon = element.querySelector(".acordeon-icon");

    if (!conteudo) return;

    conteudo.classList.toggle("ativo");

    if (conteudo.classList.contains("ativo")) {
        if (icon) {
            icon.textContent = "−";
        }
    } else {
        if (icon) {
            icon.textContent = "+";
        }
    }
}

/* =====================================================
   FICHA
===================================================== */
function toggleFicha() {
    const conteudo = document.getElementById("conteudoFicha");
    const icone = document.getElementById("iconeFicha");

    if (!conteudo || !icone) return;

    conteudo.classList.toggle("ativo");

    if (conteudo.classList.contains("ativo")) {
        icone.textContent = "−";
    } else {
        icone.textContent = "+";
    }
}
/* =====================================================
   MODAL DE PLANOS

   Apenas abrir, fechar e selecionar visualmente.
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const modalPlanos =
            document.getElementById(
                "modalPlanos"
            );


        const abrirModal =
            document.getElementById(
                "abrirModalPlanos"
            );


        const fecharModal =
            document.getElementById(
                "fecharModalPlanos"
            );


        function fecharModalPlanos() {

            if (!modalPlanos) {
                return;
            }


            modalPlanos.classList.remove(
                "ativo"
            );


            document.body.style.overflow =
                "";

        }


        /* Abrir */

        if (
            abrirModal &&
            modalPlanos
        ) {

            abrirModal.addEventListener(
                "click",
                () => {

                    modalPlanos.classList.add(
                        "ativo"
                    );


                    document.body.style.overflow =
                        "hidden";

                }
            );

        }


        /* Fechar pelo X */

        if (fecharModal) {

            fecharModal.addEventListener(
                "click",
                fecharModalPlanos
            );

        }


        /* Fechar clicando fora */

        if (modalPlanos) {

            modalPlanos.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target ===
                        modalPlanos
                    ) {

                        fecharModalPlanos();

                    }

                }
            );

        }


        /* Fechar com ESC */

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape" &&
                    modalPlanos &&
                    modalPlanos.classList.contains(
                        "ativo"
                    )
                ) {

                    fecharModalPlanos();

                }

            }
        );


        /* Seleção dos planos */

        const botoesPlanos =
            document.querySelectorAll(
                ".modal-plano-botao"
            );


        botoesPlanos.forEach((botao) => {

            botao.addEventListener(
                "click",
                () => {

                    const plano =
                        botao.getAttribute(
                            "data-plano"
                        );


                    console.log(
                        "Plano selecionado:",
                        plano
                    );

                }
            );

        });

    }
);


/* =====================================================
   MODAL DE PROFESSORES

   Somente abrir e fechar.

   A busca dos professores e a conexão
   com o professor ficam no conexoes.js.
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const abrirModalProfessores =
            document.getElementById(
                "abrirModalProfessores"
            );


        const fecharModalProfessores =
            document.getElementById(
                "fecharModalProfessores"
            );


        const modalProfessores =
            document.getElementById(
                "modalProfessores"
            );


        function fecharModalProfessoresFunc() {

            if (!modalProfessores) {
                return;
            }


            modalProfessores.classList.remove(
                "ativo"
            );


            document.body.style.overflow =
                "";

        }


        /* Abrir modal */

        if (
            abrirModalProfessores &&
            modalProfessores
        ) {

            abrirModalProfessores.addEventListener(
                "click",
                () => {

                    modalProfessores.classList.add(
                        "ativo"
                    );


                    document.body.style.overflow =
                        "hidden";

                }
            );

        }


        /* Fechar pelo X */

        if (fecharModalProfessores) {

            fecharModalProfessores.addEventListener(
                "click",
                fecharModalProfessoresFunc
            );

        }


        /* Fechar clicando fora */

        if (modalProfessores) {

            modalProfessores.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target ===
                        modalProfessores
                    ) {

                        fecharModalProfessoresFunc();

                    }

                }
            );

        }


        /* Fechar com ESC */

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape" &&
                    modalProfessores &&
                    modalProfessores.classList.contains(
                        "ativo"
                    )
                ) {

                    fecharModalProfessoresFunc();

                }

            }
        );

    }
);




// =====================================================
// MODAL DE FICHA
// =====================================================

function abrirModalFicha() {

    const modal = document.getElementById("modalFicha");

    if (!modal) return;

    modal.classList.add("ativo");

    // Preenche o formulário com os dados que já aparecem na ficha
    const idade = document.getElementById("fichaIdade");
    const altura = document.getElementById("fichaAltura");
    const peso = document.getElementById("fichaPeso");
    const objetivo = document.getElementById("fichaObjetivo");

    const modalIdade = document.getElementById("modalIdade");
    const modalAltura = document.getElementById("modalAltura");
    const modalPeso = document.getElementById("modalPeso");
    const modalObjetivo = document.getElementById("modalObjetivo");

    if (idade && idade.textContent !== "Não informado") {
        modalIdade.value = idade.textContent;
    }

    if (altura && altura.textContent !== "Não informado") {
        modalAltura.value = altura.textContent;
    }

    if (peso && peso.textContent !== "Não informado") {
        modalPeso.value = peso.textContent;
    }

    if (objetivo && objetivo.textContent !== "Não informado") {
        modalObjetivo.value = objetivo.textContent;
    }
}


function fecharModalFicha() {

    const modal = document.getElementById("modalFicha");

    if (!modal) return;

    modal.classList.remove("ativo");
}


document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        fecharModalFicha();
    }

});

function abrirModalFicha() {

    const modal =
        document.getElementById("modalFicha");

    if (!modal) {
        return;
    }

    modal.classList.add("ativo");


    const idade =
        document.getElementById("fichaIdade");

    const altura =
        document.getElementById("fichaAltura");

    const peso =
        document.getElementById("fichaPeso");

    const objetivo =
        document.getElementById("fichaObjetivo");


    const modalIdade =
        document.getElementById("modalIdade");

    const modalAltura =
        document.getElementById("modalAltura");

    const modalPeso =
        document.getElementById("modalPeso");

    const modalObjetivo =
        document.getElementById("modalObjetivo");


    if (
        idade &&
        idade.textContent !== "Não informado"
    ) {

        modalIdade.value =
            idade.textContent;

    }


    if (
        altura &&
        altura.textContent !== "Não informado"
    ) {

        modalAltura.value =
            altura.textContent;

    }


    if (
        peso &&
        peso.textContent !== "Não informado"
    ) {

        modalPeso.value =
            peso.textContent;

    }


    if (
        objetivo &&
        objetivo.textContent !== "Não informado"
    ) {

        modalObjetivo.value =
            objetivo.textContent;

    }

}


function fecharModalFicha() {

    const modal =
        document.getElementById("modalFicha");

    if (!modal) {
        return;
    }

    modal.classList.remove("ativo");

}


document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        fecharModalFicha();

    }

});


/* =====================================================
   TITANFIT - ÁREA DO PROFESSOR
   INTERAÇÕES DA TELA
===================================================== */
 
 
/* =====================================================
   ACCORDION
===================================================== */

function toggleProfessorSection(button) {

    const content = button.nextElementSibling;

    const icon =
        button.querySelector(".professor-accordion-symbol");

    if (!content) {
        return;
    }

    content.classList.toggle("active");

    if (icon) {

        if (content.classList.contains("active")) {
            icon.textContent = "−";
        } else {
            icon.textContent = "+";
        }

    }
}
/* =====================================================
   BOTÕES DOS CARDS
===================================================== */
 
document.addEventListener("DOMContentLoaded", () => {
 
    const buttons = document.querySelectorAll(".professor-button");
 
    buttons.forEach((button) => {
 
        button.addEventListener("click", () => {
 
            console.log(
                "Botão clicado:",
                button.textContent.trim()
            );
 
        });
 
    });
 
});
 

function abrirModalSolicitacoesProfessor() {

    const modal =
        document.getElementById(
            "modalSolicitacoesProfessor"
        );

    if (!modal) {
        return;
    }

    modal.classList.add("ativo");

    carregarSolicitacoesModalProfessor();
}

function fecharModalSolicitacoesProfessor() {

    const modal =
        document.getElementById(
            "modalSolicitacoesProfessor"
        );

    if (modal) {
        modal.classList.remove("ativo");
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const botaoAbrir =
        document.getElementById(
            "btnVerSolicitacoesProfessor"
        );

    const botaoFechar =
        document.getElementById(
            "fecharSolicitacoesProfessor"
        );

    if (botaoAbrir) {

        botaoAbrir.addEventListener(
            "click",
            abrirModalSolicitacoesProfessor
        );

    }

    if (botaoFechar) {

        botaoFechar.addEventListener(
            "click",
            fecharModalSolicitacoesProfessor
        );

    }

});