// Menores preços por filial da coleta de 4 e 5/02/2026, em centavos.
const physicalItems = [
  ["Arroz parboilizado", "5 kg", [1198, 1429, 1179, 1099, 1589]],
  ["Feijão preto", "1 kg", [419, 429, 438, 649, 499]],
  ["Açúcar refinado", "1 kg", [299, 378, 325, 349, 369]],
  ["Café", "500 g", [2890, 2297, 1579, 2589, 2899]],
  ["Farinha de trigo", "1 kg", [218, 279, 269, 289, 299]],
  ["Farinha de mandioca", "1 kg", [599, 489, 469, 359, 1249]],
  ["Macarrão espaguete", "500 g", [248, 259, 239, 349, 359]],
  ["Óleo de soja", "900 ml", [728, 747, 728, 839, 799]],
  ["Margarina", "500 g", [625, 727, 379, 679, 619]],
  ["Sardinha em lata", "125 g", [659, 597, 499, 679, 629]],
  ["Leite integral", "1 L", [469, 447, 478, 539, 549]],
  ["Leite em pó", "400 g", [1768, 1547, 1698, 1379, 1799]],
  ["Achocolatado", "350 g", [1099, 897, 1198, 939, 999]],
  ["Extrato de tomate", "300 g", [578, 599, 198, 799, 699]],
  ["Biscoito água e sal", "400 g", [559, 459, 369, 729, 799]],
  ["Acém bovino", "1 kg", [3490, 3587, 4398, 4800, 4359]],
  ["Coxa e sobrecoxa de frango", "1 kg", [699, 1998, 1197, 1069, 1399]],
  ["Sabão em pó", "800 g", [1990, 1385, 2997, 499, 1799]],
  ["Papel higiênico", "4 rolos", [295, 349, 949, 799, 1219]],
  ["Creme dental", "90 g", [299, 429, 499, 499, 619]],
];

const physicalStores = [
  { name: "Brasil Atacadista", area: "Rio Tavares", address: "Rod. SC-405, 373" },
  { name: "Bistek", area: "Costeira do Pirajubaé", address: "Rua João Cancio Jaques, 49" },
  { name: "Fort Atacadista", area: "Campeche", address: "Rod. Francisco Magno Vieira, 405" },
  { name: "Imperatriz", area: "Centro", address: "Av. Mauro Ramos, 982" },
  { name: "Angeloni", area: "Agronômica", address: "Av. Gov. Irineu Bornhausen, 5288" }
];
const money = cents => currency.format(cents / 100);
const ranked = physicalStores.map((store, column) => ({
  ...store, total: physicalItems.reduce((sum, [, , prices]) => sum + prices[column], 0)
})).sort((a, b) => a.total - b.total);
const lowestTotal = ranked[0].total;
const splitTotal = physicalItems.reduce((sum, [, , prices]) => sum + Math.min(...prices), 0);

document.querySelector("#physical-basket").innerHTML = `
  <thead><tr><th scope="col">Produto</th>${physicalStores.map(({ name, area }) =>
    `<th scope="col">${name}<small>${area}</small></th>`).join("")}</tr></thead>
  <tbody>${physicalItems.map(([name, unit, prices]) => {
    const lowest = Math.min(...prices);
    return `<tr><th scope="row">${name}<small>${unit}</small></th>
      ${prices.map(price => price === lowest
        ? `<td class="lowest-price"><strong>${money(price)}</strong><small>Menor preço</small></td>`
        : `<td>${money(price)}</td>`).join("")}</tr>`;
  }).join("")}</tbody>
  <tfoot><tr><th scope="row">Total da cesta</th>${physicalStores.map(({name}) =>
    `<td>${money(ranked.find(store => store.name === name).total)}</td>`).join("")}</tr></tfoot>`;

document.querySelector("#physical-ranking").innerHTML = ranked.map(({ name, area, address, total }) => `
  <li><div class="rank-total"><strong>${name}</strong><b>${money(total)}</b></div>
  <small>${area} · ${address}</small>
  <small>${total === lowestTotal ? "Menor total da coleta" : `+${money(total - lowestTotal)} sobre o menor total`}</small></li>`).join("");
document.querySelector("#split-budget").innerHTML = `
  <strong>${money(splitTotal)}</strong>
  <p>Comprando cada item na loja mais barata. Economia de ${money(lowestTotal - splitTotal)} antes do deslocamento.</p>`;

const dateParts = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit"
}).formatToParts(new Date());
const dateValues = Object.fromEntries(dateParts.map(({type, value}) => [type, value]));
const todayInFlorianopolis = `${dateValues.year}-${dateValues.month}-${dateValues.day}`;
const printedOfferStatus = todayInFlorianopolis > "2026-11-22" ? "Encerrada" : "Consulte o estoque";
document.querySelector("#physical-offers").innerHTML = `
  <article><h3>Angeloni · Trindade</h3>
    <small>19 a 22/11/2026 · ${printedOfferStatus}</small>
    <ul class="offer-prices">
      <li>Café Melitta, 500 g <strong>R$ 22,90</strong></li>
      <li>Leite integral Tirol, 1 L <strong>R$ 4,29</strong></li>
      <li>Azeite Monte Romano, 500 ml <strong>R$ 19,90</strong></li>
    </ul>
    ${external("Ver encarte oficial de Santa Catarina", "https://statics.angeloni.com.br/encartes/Tematica/SemanalAngeloni_SC.pdf")}
  </article>
  <article><h3>Imperatriz · Trindade</h3>
    <p>Rua Lauro Linhares, 2010. Consulte a comunidade da filial e confira se o preço exige ativação no Super Clube.</p>
    ${external("Consultar ofertas da loja", "https://superimperatriz.com.br/")}
  </article>
  <article><h3>Fort Atacadista · Florianópolis</h3>
    <p>Selecione a filial para ver as campanhas e as condições de compra no atacado.</p>
    ${external("Ver encartes por loja", "https://www.fortatacadista.com.br/encartes/")}
  </article>`;
