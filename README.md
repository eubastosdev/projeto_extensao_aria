# Web para Todos

**Acessibilidade digital começa quando todas as pessoas são consideradas.**

O **Web para Todos** é um projeto autoral de extensão universitária dedicado a ampliar a conversa sobre acessibilidade e inclusão de pessoas com deficiência em aplicações web e em outras experiências digitais. A proposta combina informação, exemplos interativos e uma atividade formativa para aproximar o tema da comunidade.

## Contexto

A internet participa de atividades essenciais: estudar, trabalhar, acessar serviços, buscar informação e se comunicar. Apesar disso, muitas interfaces ainda pressupõem que toda pessoa enxerga, ouve, compreende e interage da mesma maneira. Uma imagem sem descrição, um vídeo sem legenda, um controle que exige mouse ou uma instrução confusa podem transformar uma tarefa simples em uma barreira.

Essas barreiras não estão nas pessoas. Elas surgem de escolhas feitas ao planejar, escrever, desenhar e desenvolver produtos digitais. Por isso, a acessibilidade deve fazer parte do projeto desde o início e ser avaliada com a participação de quem utiliza diferentes formas de acesso.

## Proposta

O projeto usa o próprio site como espaço de aprendizagem. Enquanto conhece o tema, o visitante encontra recursos e exemplos que mostram como uma experiência digital pode oferecer diferentes caminhos para chegar ao mesmo conteúdo. A linguagem busca ser clara para quem está começando, sem deixar de apresentar práticas úteis para quem cria aplicações.

A proposta contempla diferentes necessidades, incluindo as relacionadas à visão, à audição, à mobilidade e à compreensão. Nenhuma dessas categorias representa todas as experiências de uma pessoa com deficiência; elas servem como ponto de partida para reconhecer barreiras e conversar sobre soluções.

## Objetivo

**Objetivo geral:** promover a conscientização sobre a importância da acessibilidade digital e incentivar a criação de aplicações mais inclusivas.

**Objetivos específicos:**

- Explicar, de forma acessível, como barreiras digitais afetam a participação das pessoas.
- Apresentar exemplos de boas práticas de conteúdo, interação e desenvolvimento web.
- Permitir que o público compare barreiras e correções em um laboratório interativo.
- Estimular a reflexão por meio de um quiz e de uma proposta de workshop.
- Oferecer o conteúdo audiovisual em formatos complementares, como legendas, transcrição e interpretação em Libras.

## Para quem é

O Web para Todos se dirige ao público geral, a estudantes, educadores e a pessoas que participam da criação de produtos digitais. O conteúdo foi pensado para apoiar tanto uma visita individual quanto conversas em sala de aula, eventos e ações de extensão.

## A experiência

O percurso começa com uma introdução à acessibilidade digital e apresenta situações em que diferentes pessoas podem encontrar obstáculos. No laboratório, o visitante escolhe uma barreira e observa uma alternativa mais acessível. O quiz retoma as ideias centrais. Uma proposta de workshop organiza a discussão e convida os participantes a aplicar o aprendizado em uma pequena atividade.

O projeto também reserva espaço para uma apresentação em vídeo acompanhada de legendas, transcrição textual e interpretação em Libras. Esses formatos ampliam as formas de acompanhar a mensagem e reforçam, na própria experiência, o princípio de que informação importante deve estar disponível por mais de um caminho.

## Compromisso com a acessibilidade

O site foi concebido com navegação por teclado, foco visível, estrutura semântica e opções de leitura como ajuste do tamanho do texto, alto contraste e destaque de links. Esses recursos expressam a proposta do projeto, mas a acessibilidade é um processo contínuo: conteúdos, vídeos e interações devem ser revisados e testados com pessoas que usam diferentes tecnologias e estratégias de acesso.

## Como acessar e executar

O site está publicado em <https://webparatodos.vercel.app>.

Para rodar no seu computador não há instalação nem etapa de build: clone o repositório e abra o arquivo `index.html` no navegador. Para avançar o vídeo pela barra de tempo, use um servidor local que aceite requisições parciais, como a extensão Live Server do VS Code.

## Estrutura do projeto

| Caminho | Conteúdo |
|---|---|
| `index.html` | Página única, com todas as seções do site |
| `css/styles.css` | Estilos, modo de alto contraste e adaptação a telas pequenas |
| `js/main.js` | Menu de ajustes de leitura, laboratório, quiz e player de vídeo |
| `images/` | Ícone do site e capas dos vídeos |
| `legendas/` | Legenda do vídeo em `.vtt`, usada pelo player, e em `.srt` |
| `videos/` | Vídeo principal; a versão em Libras entra como `video-libras.mp4` |

## Vídeo

O vídeo de conscientização foi gerado na plataforma HeyGen, com avatar e voz sintéticos, a partir de um roteiro autoral. Ele tem legenda sincronizada com a fala e transcrição publicada no site.

A versão em Libras está em produção. Quando o arquivo `videos/video-libras.mp4` for adicionado, o site passa a exibi-la ao lado do vídeo principal, com reprodução sincronizada.

## Como a acessibilidade foi verificada

- Verificação automática com axe-core, nas regras da WCAG 2.2 nível AA, em telas de 320, 375, 768, 1024 e 1280 pixels: nenhuma violação.
- Navegação completa pela tecla Tab, contraste do foco, texto ampliado ao máximo e modo de alto contraste.
- Player testado com o vídeo real, incluindo a legenda.

O site ainda não foi testado com leitores de tela reais nem por pessoas com deficiência. Testes automáticos identificam apenas parte dos problemas de acessibilidade.

## Autoria e licenciamento

**Autoria:** Luiz Ricardo (@eubastosdev).

O código-fonte do projeto está disponível sob a **Licença MIT**. Os textos, roteiros, legendas, ilustrações e demais materiais educativos originais incluídos no projeto estão disponíveis sob a **Creative Commons Atribuição 4.0 Internacional (CC BY 4.0)**. Essa licença permite compartilhar e adaptar o conteúdo, inclusive comercialmente, com o devido crédito ao autor, indicação de alterações e referência à licença.

O escopo de cada licença e os respectivos termos estão em [Licenciamento](LICENSE.md).

## Referências de orientação

- [W3C Web Accessibility Initiative — WCAG em resumo](https://www.w3.org/WAI/standards-guidelines/wcag/glance/)
- [W3C Web Accessibility Initiative — mídia acessível](https://www.w3.org/WAI/media/av/)
