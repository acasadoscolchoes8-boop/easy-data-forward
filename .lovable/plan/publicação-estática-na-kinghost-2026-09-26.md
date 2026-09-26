# Publicação estática na Kinghost

## Objetivo
Preparar este pacote estático para ser enviado automaticamente do GitHub à hospedagem Kinghost, sem alterar a versão hospedada na Lovable.

## Implementação
- Manter o pacote estático atual na raiz, incluindo `_shell.html`, `assets`, SEO e regras do Apache.
- Adicionar um fluxo do GitHub Actions que valide os arquivos e publique por FTP/FTPS na Kinghost quando houver atualização da branch principal.
- Adicionar um script de validação/empacotamento e registrar os comandos necessários para geração e conferência antes da publicação.
- Documentar os segredos exigidos no GitHub e o procedimento de ativação.

## Validação
- Conferir referências de arquivos, páginas públicas e sintaxe das regras de hospedagem.
- Simular a publicação em um servidor Apache local quando possível.
- Validar a definição do GitHub Actions; o envio real dependerá das credenciais FTP da Kinghost cadastradas no repositório.

## Limite conhecido
A versão estática exibe o site e mantém o WhatsApp, mas o envio automático do quiz por e-mail depende do servidor da Lovable e não funciona na hospedagem estática da Kinghost.
