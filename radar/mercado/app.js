const stores = [
  {
    name: "Angeloni", branch: "Trindade (HU)", address: "Rua Prof. Simão José Hess, 190",
    links: [
      ["Supermercado online", "https://super.angeloni.com.br/"],
      ["Ofertas do encarte", "https://super.angeloni.com.br/ofertas-do-encarte"]
    ]
  },
  {
    name: "Imperatriz", branch: "Trindade", address: "Rua Lauro Linhares, 2010",
    links: [["Ofertas e comunidade da loja", "https://superimperatriz.com.br/"]]
  },
  {
    name: "Bistek", branch: "Monte Verde", address: "Rua Timbaúba, s/n",
    links: [
      ["Ofertas online", "https://www.bistek.com.br/"],
      ["Açougue", "https://www.bistek.com.br/ofertas-de-acougue"],
      ["Limpeza", "https://www.bistek.com.br/ofertas-limpeza"]
    ]
  },
  {
    name: "Fort", branch: "Santo Antônio de Lisboa", address: "Rod. José Carlos Daux, 9580",
    links: [
      ["Encarte oficial · selecione Santo Antônio de Lisboa", "https://www.fortatacadista.com.br/encartes/"],
      ["Folhetos de Florianópolis", "https://www.portafolhetos.com.br/ofertas/florianopolis/fort-atacadista/"]
    ]
  },
  {
    name: "Angeloni · Santa Mônica", branch: "Santa Mônica", address: "Rua Nirberto Haase, 75",
    links: [["Ofertas do encarte", "https://super.angeloni.com.br/ofertas-do-encarte"]]
  },
  {
    name: "Imperatriz · Saco dos Limões", branch: "Saco dos Limões", address: "Rua José Brognoli, 10",
    links: [["Ofertas e comunidade da loja", "https://superimperatriz.com.br/"]]
  }
];

const selections = {
  deals: [
    ["Penne Monte Romano · 500 g", "R$ 6,99 · R$ 13,98/kg", "Angeloni online · consulte pelo CEP", stores[0].links[0][1]],
    ["Azeite Monte Romano · 500 ml", "R$ 19,90 · R$ 39,80/L", "Angeloni online · consulte pelo CEP", "https://super.angeloni.com.br/super-ofertas"],
    ["Ofertas do Super Clube", "", "Imperatriz Trindade · consulte a comunidade da loja e confira se o desconto exige ativação no app.", stores[1].links[0][1]],
    ["Black Friday", "", "Fort · catálogo regional anunciado de 20 a 22/11/2026. Confira se inclui Santo Antônio de Lisboa.", stores[3].links[1][1]]
  ]
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const external = (label, url) => `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;

document.querySelector("#stores").innerHTML = stores.map(({name, branch, address, links}) => {
  const query = encodeURIComponent(`${name} ${branch} Florianópolis`);
  return `<article><h3>${name.endsWith(branch) ? name : `${name} · ${branch}`}</h3>
    ${address ? `<p>${address}</p>` : ""}
    <div class="links">${links.map(([label, url]) => external(label, url)).join("")}
    ${external("Ver no mapa", `https://www.google.com/maps/search/?api=1&query=${query}`)}</div></article>`;
}).join("");

for (const [section, offers] of Object.entries(selections)) {
  document.getElementById(section).innerHTML = offers.map(([title, price, note, url]) =>
    `<article><h3>${title}</h3>${price ? `<strong>${price}</strong>` : ""}
    <small>${note}</small>${external("Consultar fonte", url)}</article>`
  ).join("");
}

const initialMarketDate = "2026-11-22";
function marketQuote(url, initialCents) {
  return marketPriceRefresh.products[url] ?? {cents: initialCents, date: initialMarketDate};
}
function marketDateLabel(date) {
  return date.split("-").reverse().join("/");
}
const refreshNote = document.querySelector("#market-refresh");
if (marketPriceRefresh.checked) {
  refreshNote.textContent = `Consulta de ${marketDateLabel(marketPriceRefresh.checked)}: ${marketPriceRefresh.verified} de ${marketPriceRefresh.total} preços online confirmados. Cada valor indica a data em que foi verificado.`;
}

const dateParts = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit"
}).formatToParts(new Date());
const dateValues = Object.fromEntries(dateParts.map(({type, value}) => [type, value]));
const todayInFlorianopolis = `${dateValues.year}-${dateValues.month}-${dateValues.day}`;

const brasilStore = {name: "Brasil Atacadista", area: "Rio Tavares · encarte presencial"};
const brasilWeek = {
  until: "2026-11-22", dates: "16 a 22/11/2026",
  url: "https://www.portafolhetos.com.br/brasil-atacadista/brasil-atacadista-ofertas-da-semana-de-segunda-feira-16-11-2026-483039/"
};
const brasilBlack = {
  until: "2026-11-22", dates: "20 a 22/11/2026",
  url: "https://www.portafolhetos.com.br/brasil-atacadista/brasil-atacadista-black-friday-de-sexta-feira-20-11-2026-483849/"
};
const brasilPowder = {cents: 1999, quantity: 2.4, product: "Lava-roupas em pó Tixan Ypê · 2,4 kg", campaign: brasilWeek};
const brasilPaper = {cents: 1149, quantity: 240, product: "Plush folha dupla · 12 rolos de 20 m", campaign: brasilWeek};
const brasilSoap = {cents: 499, quantity: 0.085, product: "Sabonete Protex · 85 g", campaign: brasilBlack,
  note: "R$ 3,00 no Clube Brasil"};
const brasilChicken = {cents: 1199, product: "Sobrecoxa Sadia · bandeja de 1 kg", campaign: brasilWeek};
const isActiveOffer = offer => offer && todayInFlorianopolis <= offer.campaign.until;
function brasilOfferDetails(offer) {
  return `<small>${offer.campaign.dates}${isActiveOffer(offer) ? "" : " · encerrado"}${offer.note ? ` · ${offer.note}` : ""}</small>`;
}
