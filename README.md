# Palavra do Dia

Um clone simples e funcional do popular jogo "Wordle", desenvolvido em HTML, CSS e JavaScript puro (Vanilla JS).

## 🎮 Sobre o Jogo

O **Palavra do Dia** é um jogo de adivinhação de palavras onde o objetivo é descobrir a palavra secreta de 5 letras em até 6 tentativas. Após cada tentativa, as letras são coloridas para dar pistas sobre a posição correta:

*   🟩 **Verde (Correct):** A letra está na palavra e na posição correta.
*   🟨 **Amarelo (Present):** A letra está na palavra, mas na posição errada.
*   灰色 **Cinza (Absent):** A letra não existe na palavra.

## 🚀 Tecnologias Utilizadas

*   **HTML5:** Estrutura semântica do jogo.
*   **CSS3:** Estilização, layout e feedback visual.
*   **JavaScript (ES6):** Lógica do jogo, manipulação do DOM e gestão de estado.

## 🛠 Como Executar

Como este projeto utiliza a API `fetch()` para carregar o arquivo `palavras.txt`, ele **precisa** de um servidor local para funcionar corretamente devido às políticas de segurança do navegador (CORS).

### Via Python (recomendado)

Se tiver Python instalado, abra o terminal na pasta do projeto e execute:

```bash
python -m http.server 8000
```

Após executar, abra o seu navegador e acesse: `http://localhost:8000`

## 📂 Estrutura do Projeto

- `index.html`: Estrutura principal da página.
- `script.js`: O motor do jogo e toda a lógica de interação.
- `style.css`: Estilos visuais e animações.
- `palavras.txt`: O dicionário de palavras permitido.

## 🔮 Planos Futuros

Este projeto está em constante evolução. Algumas das melhorias planejadas incluem:

*   [ ] Implementação de `localStorage` para salvar estatísticas de vitórias e derrotas.
*   [ ] Modo Noturno (Dark Mode).
*   [ ] Animações para as tiles (efeito de "virar" e "tremer").
*   [ ] Refatoração do código para módulos ES6.

---

*Desenvolvido por Daniel Régis.*
