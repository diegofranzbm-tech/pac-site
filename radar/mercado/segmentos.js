// Preços dos catálogos oficiais consultados em 22/11/2026, em centavos.
const segmentItems = {
  acougue: [
    ["Filé de peito de frango Nat IQF · 1 kg", [[1748, "Filé De Peito De Frango Nat 1kg Iqf", "https://www.bistek.com.br/file-de-peito-de-frango-nat-1kg-iqf-1858653/p"], [2259, "Filé de Peito Frango NAT IQF 1kg", "https://super.angeloni.com.br/file-de-peito-frango-nat-iqf-1kg-4093797/p"]]],
    ["Sobrecoxa de frango Nat IQF · 1 kg", [[1439, "Sobrecoxa De Frango Nat 1kg Iqf", "https://www.bistek.com.br/sobrecoxa-de-frango-nat-1kg-iqf-1985078/p"], [1395, "Sobrecoxa de Frango NAT IQF 1Kg", "https://super.angeloni.com.br/sobrecoxa-de-frango-nat-iqf-1kg-4010669/p"]]],
    ["Linguiça toscana Seara · 600 g", [[2057, "Linguiça Toscana Seara 600g", "https://www.bistek.com.br/linguica-toscana-seara-600g-2364050/p"], [2199, "Linguiça SEARA Toscana Congelada 600g", "https://super.angeloni.com.br/5459942-linguica-seara-toscana-congelada-600g/p"]]],
  ],
  higiene: [
    ["Creme dental Sorriso Dentes Brancos · 90 g", [[586, "Creme Dental Sorriso 90g Branco", "https://www.bistek.com.br/creme-dental-sorriso-90g-branco-691500/p"], [539, "Creme Dental Clareador SORRISO Dentes Brancos 90g", "https://super.angeloni.com.br/creme-dental-sorriso-dentes-brancos-90g-385891/p"]]],
    ["Papel higiênico folha dupla · 4 rolos de 30 m", [[821, "Papel Higienico Doble C/4 30m Fd", "https://www.bistek.com.br/papel-higienico-doble-c4-30m-fd-1923960/p"], [799, "Papel Higiênico SUPERPEL Neutro Folha Dupla com 4 Rolos 30 Metros cada", "https://super.angeloni.com.br/5218869-papel-higienico-superpel-neutro-folha-dupla-com-4-rolos-30-metros-cada/p"]]],
    ["Sabonete Phebo Naturelle · 90 g", [[594, "Sabonete Phebo 90g Naturelle", "https://www.bistek.com.br/sabonete-phebo-90g-naturelle-687146/p"], [599, "Sabonete PHEBO Naturelle 90g", "https://super.angeloni.com.br/sabonete-phebo-naturelle-90g-4740/p"]]],
    ["Kit Pantene Liso Extremo · 350 ml + 175 ml", [[4632, "Kit Shampoo 350ml + Condicionador 175ml Pantene Liso Extremo", "https://www.bistek.com.br/sha350mlcond175ml-pantene-liso-extr-2015404/p"], [2590, "1 Kit PANTENE PRO-V Liso Extremo Shampoo  350ml + Condicionador  175ml", "https://super.angeloni.com.br/kit-pantene-liso-extremo-shmapoo-350ml-condicionador-175ml-4529461/p"]]],
  ],
  limpeza: [
    ["Detergente neutro Ypê · 500 ml", [[306, "Detergente Ypê Neutro 500ml", "https://www.bistek.com.br/detergente-liquido-ype-500ml-neutro-715999/p"], [299, "Detergente YPÊ Neutro 500ml", "https://super.angeloni.com.br/detergente-ype-neutro-500ml-1229185/p"]]],
    ["Água sanitária Qboa · 1 L", [[512, "Água Sanitária Qboa 1 Litro", "https://www.bistek.com.br/agua-sanitaria-qboa-1-litro-714895/p"], [499, "Água Sanitária Q'BOA 1L", "https://super.angeloni.com.br/agua-sanitaria-q-boa-1l-388/p"]]],
    ["Desinfetante Pinho Sol Original · 1 L", [[2057, "Pinho Sol Original Desinfetante 1l", "https://www.bistek.com.br/desinfetante-pinho-sol-1l-original-1463691/p"], [1889, "Desinfetante Pinho Sol Original 1l", "https://super.angeloni.com.br/desinfetante-pinho-sol-original-1l-1986899/p"]]],
    ["Sabão em pó Surf Cuidado do Coco · 800 g", [[862, "Lava Roupa Po Surf 800g Nv For.C.Coco Sc", "https://www.bistek.com.br/lava-roupa-po-surf-800g-nv-forccoco-sc-2102110/p"], [999, "Sabão em Pó SURF Cuidado do Coco 800g", "https://super.angeloni.com.br/sabao-em-po-surf-cuidado-do-coco-800g-5459290/p"]]],
  ],
};

const fortWeekend = {
  until: "2026-11-22", dates: "20 a 22/11/2026",
  url: "https://brcatalogos.com.br/fort/ofertas-semana-f-santa-catarina"
};
const branchOffers = {
  acougue: {
    ...fortWeekend,
    items: [
      "Coração da alcatra ou maminha Friboi · R$ 48,78/kg · limite de 10 kg por cliente",
      "Linguiças congeladas de 600 g e 700 g · 50% na segunda unidade · preço-base não divulgado"
    ],
    note: "Alcatra e maminha são cortes diferentes dos itens da tabela. Para a linguiça, o desconto exige duas embalagens elegíveis e o encarte informa apenas o percentual. O valor por quilo depende do preço-base na loja."
  },
  higiene: {
    ...fortWeekend,
    items: ["Papel higiênico Duetto · 18 rolos, folha dupla de 30 m ou tripla de 20 m · R$ 17,90 (R$ 0,99 por rolo)"],
    note: "Compare a versão folha dupla de 30 m com os pacotes de 4 rolos da tabela. A versão tripla de 20 m tem outra metragem e espessura."
  },
  limpeza: {
    until: "2026-11-30", dates: "16 a 30/11/2026",
    url: "https://brcatalogos.com.br/fort/ofertas-lamina-perfumaria-santa-catarina",
    items: [
      "Água sanitária Ypê · 1 L · R$ 3,49",
      "Lava-roupas em pó Surf · 5,6 kg · R$ 32,90 (R$ 5,88/kg) ou R$ 29,90 no Clube Mais (R$ 5,34/kg)",
      "Lava-roupas líquido Tixan Ypê · refil de 900 ml · R$ 9,98 (R$ 11,09/L)"
    ],
    note: "A água sanitária Ypê tem o mesmo volume da Qboa e outra marca. O Surf do encarte tem embalagem maior e outra fragrância. Para comparar o refil líquido com o sabão em pó, consulte o rendimento por lavagem."
  }
};

function localStoreCoverage(segment) {
  const {until, dates, url, items, note} = branchOffers[segment];
  const status = todayInFlorianopolis > until ? "Encerrado" : "Sujeito a estoque";
  return `
    <div class="branch-coverage">
      <article>
        <h3>Fort Atacadista · Santo Antônio de Lisboa</h3>
        <small>Encarte presencial · ${dates} · ${status}</small>
        <ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>
        <p class="comparison-note"><strong>Como comparar.</strong> ${note}</p>
        <div class="links">
          ${external("Ver encarte", url)}
          ${external("Consultar loja 810", "https://www.fortatacadista.com.br/3074/televendas")}
        </div>
      </article>
      <article>
        <h3>Imperatriz · Trindade</h3>
        <p>Rua Lauro Linhares, 2010. Preços vigentes dos itens do ranking ainda sem confirmação pública para a filial.</p>
        <div class="links">
          ${external("Consultar comunidade de ofertas", "https://linkme.bio/imperatriz")}
          ${external("Ver loja no site oficial", "https://superimperatriz.com.br/")}
        </div>
      </article>
    </div>`;
}

const fortSadia = {
  until: "2026-11-22", dates: "9 a 22/11/2026",
  url: "https://brcatalogos.com.br/fort/ofertas-seu-dia-pede-sadia-santa-catarina"
};
const fortSegmentOffers = {
  acougue: [
    null, null,
    {cents: 1798, product: "Linguiça toscana Perdigão · 600 g", campaign: fortSadia,
      note: "Outra marca · R$ 16,98 no Clube Mais"}
  ],
  higiene: [
    null,
    {cents: Math.round(1790 * 4 / 18), paid: 1790, product: "Duetto folha dupla de 30 m · 18 rolos",
      campaign: fortWeekend, note: "Equivalente a 4 rolos"},
    {cents: 429, product: "Sabonete Francis Luxo · 90 g", campaign: branchOffers.limpeza,
      note: "Outra marca · R$ 3,99 no Clube Mais"},
    {cents: 2290, product: "Kit TRESemmé · 350 ml + 175 ml", campaign: branchOffers.limpeza,
      note: "Outra marca · R$ 21,90 no Clube Mais"}
  ],
  limpeza: [
    null,
    {cents: 349, product: "Água sanitária Ypê · 1 L", campaign: branchOffers.limpeza, note: "Outra marca"},
    null,
    {cents: 649, product: "Sabão em pó Girando Sol · 800 g", campaign: branchOffers.limpeza, note: "Outra marca"}
  ]
};

const brasilSegmentOffers = {
  acougue: [null, {...brasilChicken, note: "Outra marca e apresentação"}, null],
  higiene: [
    null,
    {...brasilPaper, cents: Math.round(brasilPaper.cents * 120 / brasilPaper.quantity),
      paid: brasilPaper.cents, note: "Equivalente a 120 m de folha dupla"},
    {...brasilSoap, cents: Math.round(brasilSoap.cents * 90 / 85),
      paid: brasilSoap.cents, note: "Equivalente a 90 g · R$ 3,00 por barra de 85 g no Clube Brasil"},
    null
  ],
  limpeza: [
    null,
    {cents: 220, paid: 1099, product: "Água sanitária Girando Sol · 5 L", campaign: brasilWeek,
      note: "Equivalente a 1 L"},
    null,
    {...brasilPowder, cents: Math.round(brasilPowder.cents * 0.8 / brasilPowder.quantity),
      paid: brasilPowder.cents, note: "Equivalente a 800 g · outra marca"}
  ]
};

const segmentStores = [...catalogStores, {name: "Fort Santo Antônio de Lisboa"}];

function renderSegmentRanking(stores, rows) {
  const totals = stores.map(({name}, column) => ({
    name,
    total: rows.reduce((sum, row) => sum + row.prices[column], 0)
  })).sort((a, b) => a.total - b.total);
  const lowest = totals[0].total;
  return `<ol>${totals.map(({name, total}) => `<li><div class="rank-total"><strong>${name}</strong><b>${money(total)}</b></div>
    <small>${total === lowest ? "Menor subtotal" : `+${money(total - lowest)} sobre o menor subtotal`}</small></li>`).join("")}</ol>`;
}

for (const [segment, items] of Object.entries(segmentItems)) {
  const rows = items.map(([product, originalOffers], index) => {
    const offers = originalOffers.map(([cents, name, url]) => [marketQuote(url, cents).cents, name, url]);
    const fort = fortSegmentOffers[segment][index];
    const active = fort && todayInFlorianopolis <= fort.campaign.until;
    const prices = offers.map(([cents]) => cents);
    if (active) prices.push(fort.cents);
    return {product, offers, fort, active, prices, brasil: brasilSegmentOffers[segment][index]};
  });
  const common = rows.filter(({active}) => active);
  const brasilCommon = rows.filter(({brasil}) => isActiveOffer(brasil));
  const includeFort = brasilCommon.length > 0 && brasilCommon.every(({active}) => active);
  const brasilRankStores = [...(includeFort ? segmentStores : catalogStores), brasilStore];
  const brasilRankRows = brasilCommon.map(row => ({
    prices: [...(includeFort ? row.prices : row.prices.slice(0, catalogStores.length)), row.brasil.cents]
  }));
  document.querySelector(`#${segment}-ranking`).innerHTML = `
    <div class="table-wrap segment-prices segment-prices-fort" tabindex="0" role="region" aria-labelledby="${segment}">
      <table>
        <thead><tr><th scope="col">Produto</th>${[...segmentStores, brasilStore].map(({name}) =>
          `<th scope="col">${name}</th>`).join("")}</tr></thead>
        <tbody>${rows.map(({product, offers, fort, active, prices, brasil}) => {
          const best = Math.min(...prices);
          const fortCell = fort ? `<td class="${active && fort.cents === best ? "lowest-price" : ""}">
            ${external(money(fort.cents), fort.campaign.url)}
            <small>${fort.product}${fort.paid ? ` · pacote ${money(fort.paid)}` : ""}</small>
            <small>${fort.note} · ${fort.campaign.dates}${active ? "" : " · encerrado"}</small>
          </td>` : '<td><small>Preço sem confirmação</small></td>';
          const brasilCell = brasil ? `<td>
            ${external(money(brasil.cents), brasil.campaign.url)}
            <small>${brasil.product}${brasil.paid ? ` · pacote ${money(brasil.paid)}` : ""}</small>
            ${brasilOfferDetails(brasil)}
          </td>` : '<td><small>Preço sem confirmação</small></td>';
          return `<tr><th scope="row">${product}</th>${offers.map(([cents, name, url]) =>
            `<td class="${cents === best ? "lowest-price" : ""}">
              <a href="${url}" target="_blank" rel="noopener" aria-label="${name} · ${money(cents)}">${money(cents)}</a><small>${marketDateLabel(marketQuote(url, cents).date)}</small>
            </td>`).join("")}${fortCell}${brasilCell}</tr>`;
        }).join("")}</tbody>
      </table>
    </div>
    <aside class="market-ranking" aria-label="Classificação por subtotal">
      <h3>Fort, Bistek e Angeloni</h3>
      ${common.length ? `<p>${common.length} de ${items.length} itens em comum. Inclui marcas alternativas na mesma medida.</p>
        ${renderSegmentRanking(segmentStores, common)}` : "<p>Sem oferta do Fort dentro da validade para estes itens.</p>"}
      <h3>Comparação com Brasil Atacadista</h3>
      ${brasilCommon.length ? `<p>${brasilCommon.length} de ${items.length} itens em comum, com alternativas na mesma medida.</p>
        ${renderSegmentRanking(brasilRankStores, brasilRankRows)}` : "<p>Sem oferta do Brasil Atacadista dentro da validade para estes itens.</p>"}
      <h3>Seleção completa · Bistek e Angeloni</h3>
      ${renderSegmentRanking(catalogStores, rows)}
    </aside>
    ${localStoreCoverage(segment)}`;
}
