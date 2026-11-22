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
  meat: [
    ["Sobrecoxa Macedo · 1 kg", "R$ 10,90/kg", "Angeloni online · consulte pelo CEP", stores[0].links[0][1]],
    ["Fraldinha Montana em peça", "R$ 47,90/kg", "Angeloni online · consulte pelo CEP", stores[0].links[0][1]],
    ["Cortes em promoção", "", "Bistek online · consulte pelo CEP", stores[2].links[1][1]]
  ],
  cleaning: [
    ["Água sanitária Ypê Pro · 5 L", "R$ 19,99 · R$ 4,00/L", "Referência online do Angeloni", "https://super.angeloni.com.br/limpeza-e-lavanderia/agua-sanitaria"],
    ["Água sanitária Qboa · 5 L", "R$ 17,97 · R$ 3,59/L", "Referência online do Bistek", stores[2].links[2][1]],
    ["Folheto de perfumaria e limpeza", "", "Fort · catálogo regional anunciado até 30/11/2026. Confira se inclui Santo Antônio de Lisboa.", stores[3].links[1][1]]
  ],
  deals: [
    ["Penne Monte Romano · 500 g", "R$ 6,99 · R$ 13,98/kg", "Angeloni online · consulte pelo CEP", stores[0].links[0][1]],
    ["Azeite Monte Romano · 500 ml", "R$ 19,90 · R$ 39,80/L", "Angeloni online · consulte pelo CEP", "https://super.angeloni.com.br/super-ofertas"],
    ["Ofertas do Super Clube", "", "Imperatriz Trindade · consulte a comunidade da loja e confira se o desconto exige ativação no app.", stores[1].links[0][1]],
    ["Black Friday", "", "Fort · catálogo regional anunciado de 20 a 22/11/2026. Confira se inclui Santo Antônio de Lisboa.", stores[3].links[1][1]]
  ]
};

const items = [
  ["Frango (kg)", 3], ["Carne moída (kg)", 2], ["Linguiça (kg)", 1],
  ["Arroz (kg)", 5], ["Feijão (kg)", 2], ["Macarrão (kg)", 2],
  ["Óleo (L)", 2], ["Leite (L)", 6], ["Café (kg)", 1], ["Ovos (dúzia)", 2],
  ["Detergente (L)", 2], ["Água sanitária (L)", 2], ["Lava-roupas em pó (kg)", 2],
  ["Esponja (un.)", 3], ["Saco de lixo (un.)", 30], ["Papel higiênico (rolo)", 12]
];

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const external = (label, url) => `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
const storageKey = "radar-mercado-cesta-v1";

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

const numberInput = (key, label, initial = "") =>
  `<input type="number" min="0" step="any" inputmode="decimal" data-key="${key}" aria-label="${label}" value="${initial}">`;

const table = document.querySelector("#basket");
table.innerHTML = `
  <thead><tr><th scope="col">Produto e unidade</th><th scope="col">Quantidade</th>
    ${stores.map(({name}) => `<th scope="col">${name}</th>`).join("")}
  </tr></thead>
  <tbody>${items.map(([label, quantity], row) => `<tr>
    <th scope="row">${label}</th><td>${numberInput(`q-${row}`, `Quantidade · ${label}`, quantity)}</td>
    ${stores.map(({name}, col) => `<td>${numberInput(`p-${col}-${row}`, `Preço · ${name} · ${label}`)}</td>`).join("")}
  </tr>`).join("")}</tbody>
  <tfoot>
    <tr><th scope="row" colspan="2">Frete ou deslocamento</th>
      ${stores.map(({name}, col) => `<td>${numberInput(`f-${col}`, `Frete ou deslocamento · ${name}`)}</td>`).join("")}
    </tr>
    <tr><th scope="row" colspan="2">Total da cesta</th>
      ${stores.map(({name}, col) => `<td id="total-${col}" aria-label="Total · ${name}"></td>`).join("")}
    </tr>
  </tfoot>`;

const inputs = new Map([...table.querySelectorAll("input")].map(input => [input.dataset.key, input]));
try {
  const saved = JSON.parse(localStorage.getItem(storageKey)) || {};
  for (const [key, input] of inputs) {
    if (typeof saved[key] === "string") input.value = saved[key];
  }
} catch {
  // A cesta funciona sem armazenamento local.
}

function number(key) {
  const input = inputs.get(key);
  return input.validity.valid && input.value !== "" ? input.valueAsNumber : null;
}

function updateTotals() {
  const quantities = items.map((_, row) => number(`q-${row}`));
  const selected = quantities.flatMap((quantity, row) => quantity > 0 ? [row] : []);
  const complete = [];
  stores.forEach(({name}, col) => {
    const transport = number(`f-${col}`);
    const quoted = selected.filter(row => number(`p-${col}-${row}`) !== null);
    const subtotal = quoted.reduce((sum, row) =>
      sum + Math.round(quantities[row] * number(`p-${col}-${row}`) * 100), 0);
    const cell = document.getElementById(`total-${col}`);
    if (selected.length && !quantities.includes(null) && quoted.length === selected.length && transport !== null) {
      const cents = subtotal + Math.round(transport * 100);
      cell.textContent = currency.format(cents / 100);
      complete.push({name, cents});
    } else {
      cell.textContent = `${quoted.length}/${selected.length} itens`;
    }
  });

  const comparison = document.querySelector("#comparison");
  if (quantities.includes(null)) {
    comparison.textContent = "Preencha todas as quantidades. Use zero para excluir um item.";
  } else if (complete.length < 2) {
    comparison.textContent = "Complete a cotação de pelo menos duas lojas para comparar os totais.";
  } else {
    const lowest = Math.min(...complete.map(({cents}) => cents));
    const names = complete.filter(({cents}) => cents === lowest).map(({name}) => name);
    comparison.textContent = `Menor total entre ${complete.length} lojas cotadas: ${names.join(" e ")} · ${currency.format(lowest / 100)}.`;
  }
}

table.addEventListener("input", () => {
  updateTotals();
  try {
    localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(
      [...inputs].map(([key, input]) => [key, input.value])
    )));
  } catch {
    // A cotação atual continua disponível na página.
  }
});
updateTotals();
