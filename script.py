import os
origem = "dicionario.txt"
destino = "dicionario5letras.txt"


try:
    with open(origem, "r", encoding="utf-8") as arquivo:
        palavras = arquivo.read().splitlines()
        total_linhas_origem = len(palavras)
        print(f"Arquivo lido com sucesso. Total de Palavras: {total_linhas_origem}")
        palavras_filtradas = [p.strip() for p in palavras if len(p.strip()) == 5]
        total_filtradas = len(palavras_filtradas)
    with open(destino, "w", encoding="utf-8") as novo_arquivo:
        novo_arquivo.write("\n".join(palavras_filtradas))
    
    print(f"Filtro concluído!")
    print(f"Palavras com 5 letras salvas em: '{novo_arquivo}'")


except FileNotFoundError:
    print(f"❌ Erro: O arquivo '{origem}' não foi encontrado.")
    print("Certifique-se de que o script Python está na mesma pasta que o arquivo .txt.")