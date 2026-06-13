# Imóveis Ipatinga Tower - Lívia Eller

Site estático para divulgar e organizar imóveis do Ipatinga Tower atendidos pela corretora Lívia Eller, com foco em locação e suporte também para venda.

## Como editar os imóveis

Os imóveis ficam em `assets/js/imoveis.js`. Para publicar uma sala, adicione um objeto no array `window.IMOVEIS_TOWER`:

```js
{
  codigo: "Loja-03-C",
  finalidade: "Locação",
  titulo: "Sala comercial com vista para a BR-381",
  area: "40 m²",
  andar: "12º andar",
  status: "Disponível",
  valor: "Consulte",
  descricao: "Sala pronta para receber escritório, consultório ou atendimento profissional.",
  fotos: ["assets/img/salas/tower-1204-01.jpg"]
}
```

## Como configurar contato

Edite `assets/js/site-config.js` e preencha `whatsappNumber` com DDI + DDD + número, somente dígitos.

Exemplo:

```js
whatsappNumber: "5531999999999"
```

## Fotos

Crie a pasta `assets/img/salas` e coloque as fotos das salas nela. Depois, referencie os caminhos no campo `fotos` de cada imóvel.

Para fotos usadas apenas como referência de padrão, use `assets/img/referencias`. A ideia é cadastrar perfis como "loja duplex com mezanino", "loja padrão com vitrine" ou "módulos compactos", sem precisar fotografar cada unidade idêntica separadamente.

## Publicação

Como o projeto é estático, pode ser publicado no GitHub Pages sem etapa de build. Basta usar a branch `main` e apontar o Pages para a raiz do repositório.
