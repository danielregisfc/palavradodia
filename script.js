// --- DICIONÁRIO ---
let dicionario = new Set();
let jogoPronto = false;

fetch("palavras.txt")
    .then(resp => resp.text())
    .then(texto => {
        const lista = texto.split("\n").map(p => p.trim().toUpperCase()).filter(p => p.length === 5);
        dicionario = new Set(lista);
        console.log(`Dicionário carregado: ${dicionario.size} palavras`);
        jogoPronto = true;
        novoJogo();
    })
    .catch(erro => {
        console.error("Erro ao carregar palavras:", erro);
        alert("Erro ao carregar dicionário. Verifica o ficheiro palavras.txt.");
    });

// --- GRADE 6x5 ---
const grid = document.getElementById("grid");
const tileGrid = [];

function criarGrade() {
    grid.innerHTML = "";
    tileGrid.length = 0;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        tileGrid[i] = [];
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            row.appendChild(tile);
            tileGrid[i][j] = tile;
        }
        grid.appendChild(row);
    }
}

// --- TECLADO VIRTUAL ---
const layoutTeclado = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
];

const teclasMapa = {};
const tecladoDiv = document.getElementById("keyboard");

function criarTeclado() {
    tecladoDiv.innerHTML = "";
    // Limpar referências antigas
    for (const key in teclasMapa) {
        delete teclasMapa[key];
    }

    layoutTeclado.forEach(linha => {
        const linhaDiv = document.createElement("div");
        linhaDiv.classList.add("teclado-linha");

        linha.forEach(tecla => {
            const btn = document.createElement("button");
            btn.classList.add("tecla");
            btn.innerText = tecla;

            if (tecla === "ENTER" || tecla === "⌫") {
                btn.classList.add("wide");
            }

            if (tecla.length === 1) {
                teclasMapa[tecla] = btn;
            }

            btn.addEventListener("click", () => {
                if (!jogoPronto || jogoTerminado) return;

                if (tecla === "⌫") {
                    tratarBackspace();
                } else if (tecla === "ENTER") {
                    tratarEnter();
                } else {
                    tratarLetra(tecla);
                }
            });

            linhaDiv.appendChild(btn);
        });

        tecladoDiv.appendChild(linhaDiv);
    });
}

// --- CONTROLO DE JOGO ---
let palavraSecreta = "";
let linhaAtual = 0;
let colunaAtual = 0;
let jogoTerminado = false;
const mensagemEl = document.getElementById("mensagem");
const btnNovoJogo = document.getElementById("btnNovoJogo");

const prioridadeCor = { "correct": 3, "present": 2, "absent": 1 };
const estadoTeclas = {};

function novoJogo() {
    // Sortear palavra aleatória do dicionário
    const arrayPalavras = Array.from(dicionario);
    palavraSecreta = arrayPalavras[Math.floor(Math.random() * arrayPalavras.length)];

    // Resetar estado
    linhaAtual = 0;
    colunaAtual = 0;
    jogoTerminado = false;

    // Limpar classes das teclas
    for (const letra in estadoTeclas) {
        delete estadoTeclas[letra];
    }

    // Recriar grade e teclado
    criarGrade();
    criarTeclado();

    // Esconder mensagem e botão
    mensagemEl.className = "mensagem escondida";
    btnNovoJogo.classList.add("escondida");

    console.log("Nova palavra sorteada! (dica para debug)");
}

// Botão "Jogar novamente"
btnNovoJogo.addEventListener("click", () => {
    novoJogo();
});

function tratarLetra(letra) {
    if (colunaAtual < 5) {
        tileGrid[linhaAtual][colunaAtual].innerText = letra;
        colunaAtual++;
    }
}

function tratarBackspace() {
    if (colunaAtual > 0) {
        colunaAtual--;
        tileGrid[linhaAtual][colunaAtual].innerText = "";
    }
}

function tratarEnter() {
    if (colunaAtual === 5) {
        // Montar palavra digitada
        let palavraDigitada = "";
        for (let i = 0; i < 5; i++) {
            palavraDigitada += tileGrid[linhaAtual][i].innerText;
        }

        // Validar se é uma palavra do dicionário
        if (!dicionario.has(palavraDigitada)) {
            mostrarMensagem("⚠️ Palavra não encontrada no dicionário!", "aviso");
            // Limpar a linha e permitir digitar novamente
            for (let i = 0; i < 5; i++) {
                tileGrid[linhaAtual][i].innerText = "";
            }
            colunaAtual = 0;
            return;
        }

        verificarPalavra();
    } else {
        alert("Palavra incompleta!");
    }
}

// Teclado físico
document.addEventListener("keydown", (e) => {
    if (!jogoPronto || jogoTerminado) return;

    const tecla = e.key;

    if (tecla === "Backspace") {
        tratarBackspace();
    } else if (/^[a-zA-Z]$/.test(tecla)) {
        tratarLetra(tecla.toUpperCase());
    } else if (tecla === "Enter") {
        tratarEnter();
    }
});

function atualizarTeclas(palavraDigitada, resultado) {
    for (let i = 0; i < 5; i++) {
        const letra = palavraDigitada[i];
        const novaCor = resultado[i];

        if (!estadoTeclas[letra] || prioridadeCor[novaCor] > prioridadeCor[estadoTeclas[letra]]) {
            estadoTeclas[letra] = novaCor;
            const btn = teclasMapa[letra];
            if (btn) {
                btn.classList.remove("correct", "present", "absent");
                btn.classList.add(novaCor);
            }
        }
    }
}

function verificarPalavra() {
    let palavraDigitada = "";
    for (let i = 0; i < 5; i++) {
        palavraDigitada += tileGrid[linhaAtual][i].innerText;
    }

    // PASSAGEM 1: Marcar verdes e contar disponibilidade
    const resultado = ["", "", "", "", ""];
    const disponivel = {};

    for (let i = 0; i < 5; i++) {
        const letra = palavraDigitada[i];
        if (letra === palavraSecreta[i]) {
            resultado[i] = "correct";
        } else {
            disponivel[letra] = (disponivel[letra] || 0);
        }
    }

    for (let i = 0; i < 5; i++) {
        const letra = palavraSecreta[i];
        if (resultado[i] !== "correct") {
            disponivel[letra] = (disponivel[letra] || 0) + 1;
        }
    }

    // PASSAGEM 2: Marcar amarelas ou cinza
    for (let i = 0; i < 5; i++) {
        if (resultado[i] === "correct") {
            tileGrid[linhaAtual][i].classList.add("correct");
        } else {
            const letra = palavraDigitada[i];
            if (disponivel[letra] && disponivel[letra] > 0) {
                resultado[i] = "present";
                disponivel[letra]--;
                tileGrid[linhaAtual][i].classList.add("present");
            } else {
                resultado[i] = "absent";
                tileGrid[linhaAtual][i].classList.add("absent");
            }
        }
    }

    // Atualizar cores do teclado virtual
    atualizarTeclas(palavraDigitada, resultado);

    linhaAtual++;
    colunaAtual = 0;

    // Verificar se acertou
    const ganhou = resultado.every(r => r === "correct");
    if (ganhou) {
        jogoTerminado = true;
        mostrarMensagem("🎉 Parabéns! Você acertou a palavra do DIA!", "vitoria");
        btnNovoJogo.classList.remove("escondida");
        return;
    }

    // Verificar se não tem mais tentativas
    if (linhaAtual >= 6) {
        jogoTerminado = true;
        mostrarMensagem(`😞 Ficaste sem tentativas! A palavra era: ${palavraSecreta}`, "derrota");
        btnNovoJogo.classList.remove("escondida");
    }
}

function mostrarMensagem(texto, tipo) {
    mensagemEl.innerText = texto;
    mensagemEl.className = "mensagem " + tipo;

    // Avisos desaparecem automaticamente após 2 segundos
    if (tipo === "aviso") {
        setTimeout(() => {
            mensagemEl.className = "mensagem escondida";
        }, 2000);
    }
}
