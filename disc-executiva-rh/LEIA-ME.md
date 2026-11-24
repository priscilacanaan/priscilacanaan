# Teste DISC · Executiva RH

Avaliação de perfil comportamental DISC personalizada para a Executiva RH.
Tudo em um único arquivo: `index.html`. Abre em qualquer navegador, sem instalar nada.

## Como funciona
1. A pessoa preenche nome, e-mail, cargo, empresa, objetivo e consultor(a), e aceita o termo da LGPD.
2. Responde 24 situações de trabalho, marcando a frase **MAIS** e a **MENOS** parecida com ela.
3. Recebe na hora o relatório: perfil predominante (D, I, S, C ou combinação, ex.: DI), gráfico dos 4 fatores,
   pontos fortes, pontos de atenção, como se comunicar, e uma seção **Leitura para o RH**
   (motivadores, áreas com afinidade, sugestões de desenvolvimento e perguntas para entrevista).
4. Botões para **salvar em PDF** e **baixar as respostas em CSV** (abre no Excel).

## Cálculo
- Cada "mais" soma 1 ponto ao fator; cada "menos" tira 1. Saldo de -24 a +24, convertido para 0–100%.
- Se o 2º fator ficar a até 15 pontos do 1º, o perfil é combinado (ex.: DI, SC).

## Personalizar
- **Cores da marca:** no topo do `index.html`, troque `--marca` e `--marca-2`.
- **Logo:** troque o bloco `<div class="logo">ERH</div>` por `<img src="logo.png" ...>`.
- **Perguntas e textos:** ficam nas listas `PERGUNTAS` e `PERFIS`, dentro do `<script>`.

## Observação
As respostas não são enviadas para nenhum servidor: o resultado fica no navegador da pessoa.
Para receber os resultados automaticamente, o próximo passo é ligar o teste a um banco de dados ou formulário.
