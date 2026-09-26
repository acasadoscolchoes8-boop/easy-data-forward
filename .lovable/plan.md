# Corrigir os erros de execução da página inicial

## Diagnóstico
- Os arquivos citados pelo relatório (`src/pages/Index.tsx` e `src/components/Features.tsx`) não pertencem à versão atual do site.
- A versão atual é um pacote estático, mas perdeu o comando de inicialização/compilação; por isso a prévia pode carregar uma aplicação antiga e exibir erros que não existem no código atual.

## Implementação
1. Restaurar os comandos do pacote estático e o servidor local que abre a pasta gerada.
2. Gerar novamente a versão atual do site em `dist/`, sem alterar conteúdo ou aparência.
3. Validar a página inicial e as páginas públicas no navegador, confirmando ausência dos erros `value is not a function` e `name is not a function`.
4. Conferir o resultado da compilação antes de concluir.
