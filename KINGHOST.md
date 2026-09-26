# Publicação na Kinghost pelo GitHub

Este repositório contém a versão estática pronta para hospedagem Apache. O comando de geração captura as páginas públicas completas do site publicado na Lovable, e o GitHub Actions envia somente a pasta `dist-kinghost`.

## 1. Gerar e conferir localmente

```bash
npm run build:kinghost
npm run preview:kinghost
```

Abra `http://localhost:4173`. Para encerrar a prévia, pressione `Ctrl+C`.

Se a URL publicada na Lovable mudar, informe a origem no comando:

```bash
KINGHOST_SOURCE_URL="https://nova-url.lovable.app" npm run build:kinghost
```

## 2. Configurar o repositório no GitHub

Em **Settings → Secrets and variables → Actions**, cadastre estes **Repository secrets** com os dados fornecidos pela Kinghost:

- `KINGHOST_FTP_SERVER`: servidor FTP/FTPS.
- `KINGHOST_FTP_USERNAME`: usuário FTP.
- `KINGHOST_FTP_PASSWORD`: senha FTP.

Na aba **Variables**, configure quando necessário:

- `KINGHOST_FTP_DIRECTORY`: pasta pública vinculada ao domínio. O padrão é `/www/`, que é a pasta pública usual da Kinghost. Só altere se o painel da sua conta indicar outro caminho.
- `KINGHOST_FTP_PROTOCOL`: `ftps` por padrão. Use `ftp` somente se a conta não aceitar FTPS.
- `KINGHOST_FTP_PORT`: `21` por padrão.
- `KINGHOST_SITE_URL`: endereço usado para conferir a publicação. O padrão é `https://mannescolchoes.com.br`.

## 3. Publicar

Envie as alterações para a branch principal:

```bash
git add .
git commit -m "Configura publicação na Kinghost"
git push origin main
```

Se a branch do repositório for `master`, use:

```bash
git push origin master
```

O fluxo **Publicar na Kinghost** será iniciado automaticamente. Também é possível iniciá-lo em **Actions → Publicar na Kinghost → Run workflow**. Depois do envio, a automação testa a página inicial e as cinco páginas internas; se alguma continuar retornando 403 ou 404, a execução será marcada como falha.

Se o domínio mostrar **403 Forbidden**, confirme no FTP que `index.html`, `.htaccess`, `assets` e as pastas das páginas estão diretamente dentro de `www`, e não dentro de `www/dist-kinghost`.

## Observação

A versão estática mantém as páginas e o botão de WhatsApp. O envio automático do quiz por e-mail depende do servidor da Lovable e não é executado pela hospedagem estática da Kinghost.