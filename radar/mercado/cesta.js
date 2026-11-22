// Preços dos catálogos oficiais consultados em 22/11/2026, em centavos.
const physicalItems = [
  ["Arroz parboilizado", "5 kg", [[1750, "Arroz Parboilizado Bonitão 5kg Tp1", "https://www.bistek.com.br/arroz-parboilizado-bonitao-5kg-tp1-1550012/p"], [1795, "Arroz Parboilizado KIARROZ 5kg", "https://super.angeloni.com.br/arroz-parboilizado-kiarroz-5kg-121452/p"]]],
  ["Feijão preto", "1 kg", [[668, "Feijao Preto Bom Partido 1kg", "https://www.bistek.com.br/feijao-preto-bom-partido-1kg-2043408/p"], [729, "Feijão Preto URBANO Tipo 1 1kg", "https://super.angeloni.com.br/feijao-preto-urbano-tipo-1-1kg-2876440/p"]]],
  ["Açúcar refinado", "1 kg", [[390, "Açúcar Refinado Da Barra 1kg", "https://www.bistek.com.br/acucar-da-barra-1kg-refinado-1501305/p"], [349, "Açucar Refinado GLOBO 1kg", "https://super.angeloni.com.br/acucar-refinado-globo-1kg-5503951/p"]]],
  ["Café", "500 g", [[1954, "Café Pó União Tradicional Vácuo 500g", "https://www.bistek.com.br/cafe-po-uniao-500g-tradicional-vacuo-2218798/p"], [1790, "Café DUFILTRO Tradicional 500g", "https://super.angeloni.com.br/cafe-dufiltro-tradicional-500g-5523687/p"]]],
  ["Farinha de trigo", "1 kg", [[349, "Farinha Trigo Rosesol 1kg", "https://www.bistek.com.br/farinha-trigo-rosesol-1kg-1465198/p"], [375, "Farinha Trigo FARINA Tradicional Tipo 1 1kg", "https://super.angeloni.com.br/5252815-farinha-trigo-farina-tradicional-tipo-1-1kg/p"]]],
  ["Farinha de mandioca", "1 kg", [[617, "Farinha Mandioca Rocha 1kg Torrada", "https://www.bistek.com.br/farinha-mandioca-rocha-1kg-torrada-2019590/p"], [415, "Farinha Mandioca ENGENHO 1kg", "https://super.angeloni.com.br/5184063-farinha-mandioca-engenho-1kg/p"]]],
  ["Macarrão espaguete", "500 g", [[296, "Macarrão Diana 500g Espaguete", "https://www.bistek.com.br/macarrao-diana-500g-espaguete-1464280/p"], [379, "Massa ORQUÍDEA Espaguete 500g", "https://super.angeloni.com.br/massa-orquidea-espaguete-500g-2132150/p"]]],
  ["Óleo de soja", "900 ml", [[800, "Oleo Soja Coamo 900ml Pet", "https://www.bistek.com.br/oleo-soja-coamo-900ml-pet-1477102/p"], [759, "Óleo de Soja COAMO Refinado 900ml", "https://super.angeloni.com.br/4077167-oleo-de-soja-coamo-refinado-900ml/p"]]],
  ["Margarina", "500 g", [[749, "Margarina Cremosa Com Sal Claybom 500g", "https://www.bistek.com.br/margarina-claybom-500g-c-sal-1510169/p"], [749, "Margarina Claybom Com Sal 500g", "https://super.angeloni.com.br/margarina-claybom-com-sal-500g-3260925/p"]]],
  ["Sardinha em lata", "125 g", [null, null]],
  ["Leite integral", "1 L", [[491, "Leite Piracanjuba Uht Integral 1l", "https://www.bistek.com.br/leite-uht-piracanjuba-1l-integral-ctp-1816110/p"], [429, "Leite Tirol Integral Com Tampa 1l", "https://super.angeloni.com.br/leite-tirol-integral-com-tampa-1l-3852102/p"]]],
  ["Leite em pó", "400 g", [[1542, "Leite Em Pó Integral Instantâneo Aurora 400g", "https://www.bistek.com.br/leite-po-aurora-400g-instintegral-1465988/p"], [1790, "Leite Italac Integral Instantâneo 400g", "https://super.angeloni.com.br/frios-e-laticinios/leite"]]],
  ["Achocolatado", "350 g", [[718, "Achocolatado Pó 3 Corações Chocolatto Lata 350g", "https://www.bistek.com.br/achocolatado-po-3-coracoes-350g-choc-2340453/p"], [1299, "Achocolatado em Pó Nescau Lata 350g", "https://super.angeloni.com.br/achocolatados-nestle"]]],
  ["Extrato de tomate", "300 g", [[287, "Extrato Tomate Bonare 300g Sache", "https://www.bistek.com.br/extrato-tomate-bonare-300g-sache-2142538/p"], [279, "Extrato de Tomate BONARE 300g", "https://super.angeloni.com.br/extrato-de-tomate-bonare-300g-4868887/p"]]],
  ["Biscoito água e sal", "400 g", [null, null]],
  ["Acém bovino", "1 kg", [null, [5390, "Acém Bovino BEST BEEF Pedaço Kg", "https://super.angeloni.com.br/acem-bovino-best-beef-pedaco-kg-4719985/p"]]],
  ["Coxa e sobrecoxa de frango", "1 kg", [null, [1399, "Coxa Sobrecoxa Frango MACEDO Resfriada Kg", "https://super.angeloni.com.br/coxa-sobrecoxa-frango-macedo-resfriada-kg-4823400/p"]]],
  ["Sabão em pó", "800 g", [null, [999, "Sabão em Pó SURF Cuidado do Coco 800g", "https://super.angeloni.com.br/sabao-em-po-surf-cuidado-do-coco-800g-5459290/p"]]],
  ["Papel higiênico", "4 rolos", [[821, "Papel Higienico Doble C/4 30m Fd", "https://www.bistek.com.br/papel-higienico-doble-c4-30m-fd-1923960/p"], [799, "Papel Higiênico SUPERPEL Neutro Folha Dupla com 4 Rolos 30 Metros cada", "https://super.angeloni.com.br/5218869-papel-higienico-superpel-neutro-folha-dupla-com-4-rolos-30-metros-cada/p"]]],
  ["Creme dental", "90 g", [[586, "Creme Dental Sorriso 90g Branco", "https://www.bistek.com.br/creme-dental-sorriso-90g-branco-691500/p"], [659, "Creme Dental SORRISO Fresh Caixa 90g", "https://super.angeloni.com.br/creme-dental-sorriso-fresh-caixa-90g-5434854/p"]]],
];

const catalogStores = [
  { name: "Bistek", area: "Catálogo online" },
  { name: "Angeloni", area: "Catálogo online" }
];
const money = cents => currency.format(cents / 100);
const suggestedQuantities = [1, 3, 2, 2, 1, 1, 4, 2, 1, 4, 12, 1, 1, 2, 2, 3, 4, 2, 3, 2];
const itacorubiOffers = "https://www.instagram.com/superedecasaitacorubi/";
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
  <thead><tr><th scope="col">Produto</th><th scope="col">Qtd. no mês</th>${catalogStores.map(({ name, area }) =>
    `<th scope="col">${name}<small>${area}</small></th>`).join("")}</tr></thead>
  <tbody>${physicalItems.map(([name, unit, prices], row) => {
    const found = prices.filter(Boolean);
    const lowest = found.length === catalogStores.length ? Math.min(...found.map(([cents]) => cents)) : null;
    return `<tr><th scope="row">${name}<small>${unit}</small></th>
      <td><input type="number" min="0" max="999" step="1" required inputmode="numeric"
        aria-label="Quantidade mensal de ${name} por referência de ${unit}" value="${quantities[row]}"></td>
      ${prices.map(offer => {
        if (!offer) return '<td>—</td>';
        const [cents, product, url] = offer;
        return `<td class="${cents === lowest ? "lowest-price" : ""}">
          ${external(money(cents), url)}<small>${product}</small></td>`;
      }).join("")}
      </tr>`;
  }).join("")}</tbody>
  <tfoot><tr><th scope="row">Subtotal dos itens em comum</th><td></td>${catalogStores.map(({ name }, column) =>
    `<td id="month-total-${column}" aria-label="Total mensal · ${name}"></td>`).join("")}</tr></tfoot>`;

const monthlyInputs = [...monthlyTable.querySelectorAll("input")];
const ranking = document.querySelector("#physical-ranking");
const summary = document.querySelector("#monthly-summary");
const splitBudget = document.querySelector("#split-budget");

function renderMonthlyBudget() {
  const valid = monthlyInputs.every(input => input.validity.valid);
  const count = quantities.filter(quantity => quantity > 0).length;
  const comparable = physicalItems.flatMap(([, , offers], row) =>
    quantities[row] > 0 && offers.every(Boolean) ? [row] : []);
  const totals = catalogStores.map((store, column) => ({
    ...store,
    total: comparable.reduce((sum, row) => sum + physicalItems[row][2][column][0] * quantities[row], 0)
  }));
  totals.forEach(({total}, column) => {
    document.getElementById(`month-total-${column}`).textContent =
      valid && comparable.length ? money(total) : "—";
  });

  if (!valid || comparable.length === 0) {
    summary.textContent = valid ? "Selecione produtos com preço nos dois catálogos." : "Informe quantidades inteiras de 0 a 999.";
    ranking.innerHTML = "";
    splitBudget.hidden = true;
    return;
  }

  const ranked = totals.sort((a, b) => a.total - b.total);
  const lowestTotal = ranked[0].total;
  const splitTotal = comparable.reduce((sum, row) =>
    sum + Math.min(...physicalItems[row][2].map(([cents]) => cents)) * quantities[row], 0);
  summary.textContent = `${comparable.length} de ${count} produtos selecionados com preço nos dois catálogos.`;
  ranking.innerHTML = ranked.map(({name, total}) => `
    <li><div class="rank-total"><strong>${name}</strong><b>${money(total)}</b></div>
    <small>${total === lowestTotal ? "Menor subtotal dos itens em comum" : `+${money(total - lowestTotal)} sobre o menor subtotal`}</small></li>`).join("");
  splitBudget.hidden = false;
  splitBudget.innerHTML = `
    <strong>${money(splitTotal)}</strong>
    <p>Somando o menor preço de cada item em comum, antes de frete ou deslocamento.</p>`;

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
  <article><h3>É de Casa · Itacorubi</h3>
    <p>Rod. Admar Gonzaga, 1925. Os preços da cesta ainda aguardam confirmação em uma fonte pública da filial.</p>
    ${external("Ver ofertas da filial no Instagram", itacorubiOffers)}
  </article>
  <article><h3>Angeloni · Santa Mônica e Trindade (HU)</h3>
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
  <article><h3>Imperatriz · Saco dos Limões</h3>
    <p>Rua José Brognoli, 10. Confira as ofertas da filial e as condições do Super Clube.</p>
    ${external("Consultar ofertas da loja", "https://superimperatriz.com.br/")}
  </article>
  <article><h3>Brasil Atacadista · Rio Tavares</h3>
    ${external("Consultar ofertas da filial", "https://brasilatacadista.com.br/whatsapp/")}
  </article>
  <article><h3>Fort Atacadista · Santo Antônio de Lisboa</h3>
    <p>Rod. José Carlos Daux, 9580. Selecione a unidade 810 para ver as campanhas e condições de compra.</p>
    ${external("Ver encartes por loja", "https://www.fortatacadista.com.br/encartes/")}
  </article>`;
