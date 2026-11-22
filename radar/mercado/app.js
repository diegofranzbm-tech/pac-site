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
