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
const suggestedQuantities = [1, 3, 2, 2, 1, 1, 4, 2, 1, 4, 12, 1, 1, 2, 2, 3, 4, 2, 3, 2];
const monthKey = "radar-mercado-compra-mensal-v1";
let quantities = suggestedQuantities.slice();
try {
  const saved = JSON.parse(localStorage.getItem(monthKey));
  if (Array.isArray(saved) && saved.length === physicalItems.length &&
      saved.every(value => Number.isInteger(value) && value >= 0 && value <= 999)) {
    quantities = saved;
  }
} catch {
  // A lista continua editável sem armazenamento.
}

const monthlyTable = document.querySelector("#physical-basket");
monthlyTable.innerHTML = `
  <thead><tr><th scope="col">Produto</th><th scope="col">Qtd. no mês</th>${physicalStores.map(({ name, area }) =>
    `<th scope="col">${name}<small>${area}</small></th>`).join("")}</tr></thead>
  <tbody>${physicalItems.map(([name, unit, prices], row) => {
    const lowest = Math.min(...prices);
    return `<tr><th scope="row">${name}<small>${unit}</small></th>
      <td><input type="number" min="0" max="999" step="1" required inputmode="numeric"
        aria-label="Quantidade mensal de ${name} por referência de ${unit}" value="${quantities[row]}"></td>
      ${prices.map(price => price === lowest
        ? `<td class="lowest-price"><strong>${money(price)}</strong><small>Menor preço</small></td>`
        : `<td>${money(price)}</td>`).join("")}</tr>`;
  }).join("")}</tbody>
  <tfoot><tr><th scope="row">Total mensal</th><td></td>${physicalStores.map(({ name }, column) =>
    `<td id="month-total-${column}" aria-label="Total mensal · ${name}"></td>`).join("")}</tr></tfoot>`;

const monthlyInputs = [...monthlyTable.querySelectorAll("input")];
const ranking = document.querySelector("#physical-ranking");
const summary = document.querySelector("#monthly-summary");
const splitBudget = document.querySelector("#split-budget");

function renderMonthlyBudget() {
  const valid = monthlyInputs.every(input => input.validity.valid);
  const count = quantities.filter(quantity => quantity > 0).length;
  const totals = physicalStores.map((store, column) => ({
    ...store, total: physicalItems.reduce((sum, [, , prices], row) => sum + prices[column] * quantities[row], 0)
  }));
  totals.forEach(({ total }, column) => {
    document.getElementById(`month-total-${column}`).textContent = valid ? money(total) : "—";
  });
  if (!valid || count === 0) {
    summary.textContent = valid ? "Adicione um produto para calcular o orçamento." : "Informe quantidades inteiras de 0 a 999.";
    ranking.innerHTML = "";
    splitBudget.hidden = true;
    return;
  }

  const ranked = totals.sort((a, b) => a.total - b.total);
  const lowestTotal = ranked[0].total;
  const splitTotal = physicalItems.reduce((sum, [, , prices], row) => sum + Math.min(...prices) * quantities[row], 0);
  summary.textContent = `${count} de 20 produtos selecionados · menor total primeiro`;
  ranking.innerHTML = ranked.map(({ name, area, address, total }) => `
    <li><div class="rank-total"><strong>${name}</strong><b>${money(total)}</b></div>
    <small>${area} · ${address}</small>
    <small>${total === lowestTotal ? "Menor orçamento do mês nesta simulação" : `+${money(total - lowestTotal)} sobre o menor total`}</small></li>`).join("");
  splitBudget.hidden = false;
  splitBudget.innerHTML = `
    <strong>${money(splitTotal)}</strong>
    <p>Comprando cada item na loja mais barata. Economia de ${money(lowestTotal - splitTotal)} antes do deslocamento.</p>`;
}

function updateMonthlyBudget() {
  if (monthlyInputs.every(input => input.validity.valid)) {
    quantities = monthlyInputs.map(input => input.valueAsNumber);
    try {
      localStorage.setItem(monthKey, JSON.stringify(quantities));
    } catch {
      // A lista continua editável sem armazenamento.
    }
  }
  renderMonthlyBudget();
}

monthlyTable.addEventListener("input", updateMonthlyBudget);
document.querySelector("#reset-month").addEventListener("click", () => {
  monthlyInputs.forEach((input, row) => { input.value = suggestedQuantities[row]; });
  updateMonthlyBudget();
});
renderMonthlyBudget();

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
