# Corrigir publicação na KingHost

## Objetivo
Fazer `mannescolchoes.com.br` abrir o pacote estático já validado, em vez de retornar 403/404.

## Alterações
- Ajustar a automação do GitHub para publicar por padrão na pasta pública `/www/` da KingHost.
- Atualizar as instruções para deixar claro que `KINGHOST_FTP_DIRECTORY` deve apontar para a pasta pública vinculada ao domínio, usando `/www/` como padrão.
- Manter a possibilidade de substituir essa pasta pela variável do GitHub caso o painel da conta mostre outro caminho.
- Validar novamente o pacote, a configuração da automação e os caminhos das páginas.

## Limite externo
O envio real depende dos dados FTP já cadastrados nos segredos do GitHub. Depois da execução da automação, confirmarei publicamente se o domínio deixou de responder 403/404.
