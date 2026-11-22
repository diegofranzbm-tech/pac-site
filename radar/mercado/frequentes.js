// Valores em centavos. A quantidade converte o preço da embalagem para a unidade de comparação.
const frequentItems = [
  ["Heineken lata", "litro", [[616, 0.35, "Cerveja Heineken Lata 350ml", "https://www.bistek.com.br/cerveja-heineken-lata-350ml-990167/p"], [579, 0.35, "Cerveja HEINEKEN Lata 350ml", "https://super.angeloni.com.br/cerveja-heineken-lata-350ml-5120431/p"]], ""],
  ["Água mineral com gás, 500 ml", "litro", [[180, 0.5, "Água Mineral Da Pedra Com Gás 500ml", "https://www.bistek.com.br/agua-mineral-da-pedra-com-gas-500ml-2013800/p"], [129, 0.5, "Água Mineral SANTA CATARINA com Gás 500ml", "https://super.angeloni.com.br/agua-mineral-santa-catarina-com-gas-500ml-524018/p"]], ""],
  ["Pernil suíno", "kg", [[2469, 1, "Pernil Suíno Sem Tempero 1kg", "https://www.bistek.com.br/pernil-suino-stempero-embalagem-1kg-3030261/p"], [1949, 1, "Pernil Suino SEARA Reserva com Pele Pedaço Resfriado Kg", "https://super.angeloni.com.br/pernil-suino-seara-reserva-com-pele-pedaco-resfriado-kg-4821174/p"]], "O catálogo do Bistek informa sem tempero. O Angeloni descreve pernil resfriado com pele."],
  ["Costela suína", "kg", [[9576, 1, "Costela Barbecue Seara Gourmet 1kg", "https://www.bistek.com.br/costela-barbecue-seara-gourmet-1kg-1359967/p"], [2929, 1, "Costela Suína SEARA Pedaço Resfriado kg", "https://super.angeloni.com.br/costela-suina-seara-pedaco-resfriado-kg-4517433/p"]], "Barbecue e costela crua resfriada são preparações diferentes."],
  ["Queijo mussarela fatiado", "kg", [[1851, 0.3, "Queijo Mussarela Président Fatiado 300g", "https://www.bistek.com.br/queijo-mussarela-president-300g-fatiado-2114186/p"], [1939, 0.3, "Queijo Mussarela PRESIDENT Fatiado 300g", "https://super.angeloni.com.br/queijo-mussarela-president-fatiado-300g-4804119/p"]], ""],
  ["Sabão em pó para roupas", "kg", [[862, 0.8, "Lava Roupa Po Surf 800g Nv For.C.Coco Sc", "https://www.bistek.com.br/lava-roupa-po-surf-800g-nv-forccoco-sc-2102110/p"], [999, 0.8, "Sabão em Pó SURF Cuidado do Coco 800g", "https://super.angeloni.com.br/sabao-em-po-surf-cuidado-do-coco-800g-5459290/p"]], ""],
  ["Amaciante concentrado", "litro", [[2256, 0.75, "Amaciante De Roupa Concentrado Brisa Intenso Downy Refil 750ml", "https://www.bistek.com.br/amaciante-concdowny-750ml-bintenso-rf-2311321/p"], [1999, 0.75, "Amaciante de Roupa DOWNY Concentrado Brisa Intenso Refil 750ml", "https://super.angeloni.com.br/5323149-amaciante-de-roupa-downy-concentrado-brisa-intenso-refil-750ml/p"]], ""],
  ["Papel higiênico folha dupla, 30 m", "rolo", [[821, 4, "Papel Higienico Doble C/4 30m Fd", "https://www.bistek.com.br/papel-higienico-doble-c4-30m-fd-1923960/p"], [799, 4, "Papel Higiênico SUPERPEL Neutro Folha Dupla com 4 Rolos 30 Metros cada", "https://super.angeloni.com.br/5218869-papel-higienico-superpel-neutro-folha-dupla-com-4-rolos-30-metros-cada/p"]], "Marcas diferentes, com a mesma metragem e folha dupla."],
  ["Sabonete em barra", "un.", [[594, 1, "Sabonete Phebo 90g Naturelle", "https://www.bistek.com.br/sabonete-phebo-90g-naturelle-687146/p"], [599, 1, "Sabonete PHEBO Naturelle 90g", "https://super.angeloni.com.br/sabonete-phebo-naturelle-90g-4740/p"]], ""],
  ["Saco de lixo, 30 L", "saco", [[1844, 20, "Saco P/Lixo Dover Roll 30l C/20 Resist", "https://www.bistek.com.br/saco-plixo-dover-roll-30l-c20-resist-1988697/p"], [1899, 20, "Saco de Lixo DOVER ROLL Resist! com 20 Unidades 30L", "https://super.angeloni.com.br/saco-de-lixo-dover-roll-resist-com-20-unidades-30l-4649414/p"]], ""],
  ["Esponja multiuso", "un.", [[594, 1, "Esponja Scotch-Brite Multiuso Unitária", "https://www.bistek.com.br/esponja-scotch-brite-multiuso-unitaria-717070/p"], [519, 1, "Esponja SCOTCH-BRITE Multiuso com 1 Unidade", "https://super.angeloni.com.br/esponja-scotch-brite-multiuso-com-1-unidade-1996/p"]], ""],
  ["Maçã Gala", "kg", [[617, 0.5, "Maçã Gala Embalagem 500g", "https://www.bistek.com.br/maca-gala-embalagem-500g-3031802/p"], [1679, 1, "Maçã Gala kg", "https://super.angeloni.com.br/maca-gala-kg-164534/p"]], ""],
  ["Limão Tahiti", "kg", [[504, 0.3, "Limão Tahiti Embalagem 300g Aprox. 3 Unid.", "https://www.bistek.com.br/limao-tahiti-embalagem-300g-3031780/p"], [1719, 1, "Limão Tahity Kg", "https://super.angeloni.com.br/limao-tahity-kg-164364/p"]], ""],
  ["Laranja pera", "kg", [[339, 0.5, "Laranja Pera Embalagem 500g Aprox. 3 Unid.", "https://www.bistek.com.br/laranja-pera-embalagem-500g-3031721/p"], [399, 1, "Laranja Pera Kg", "https://super.angeloni.com.br/laranja-pera-kg-163848/p"]], ""],
  ["Cebola comum", "kg", [[741, 0.6, "Cebola 600g Aprox. 4 Unid.", "https://www.bistek.com.br/cebola-600g-3031438/p"], [1299, 1, "Cebola  7 MONTES 1kg", "https://super.angeloni.com.br/5163134-cebola-roxa-7-montes-1kg-1/p"]], ""],
  ["Tomate italiano", "kg", [[1338, 0.5, "Tomate Italiano 500g Aprox. 5 Unid.", "https://www.bistek.com.br/tomate-italiano-500g-3032310/p"], [2399, 1, "Tomate Italiano Kg", "https://super.angeloni.com.br/tomate-italiano-kg-786934/p"]], ""],
  ["Cenoura", "kg", [[504, 0.6, "Cenoura 600g Aprox. 4 Unid.", "https://www.bistek.com.br/cenoura-600g-3031462/p"], [499, 1, "Cenoura Kg", "https://super.angeloni.com.br/cenoura-kg-164607/p"]], ""],
];

const separatePreparations = new Set(["Pernil suíno", "Costela suína"]);
const frequentRows = frequentItems.map(([label, unit, offers, note]) => {
  const unitPrices = offers.map(([cents, quantity]) => Math.round(cents / quantity));
  const lowest = separatePreparations.has(label) ? null : Math.min(...unitPrices);
  const winners = unitPrices.flatMap((price, index) => price === lowest ? [index] : []);
  return {label, unit, offers, note, unitPrices, lowest, winners};
});

document.querySelector("#frequent-prices").innerHTML = `
  <thead><tr><th scope="col">Produto</th>
    ${catalogStores.map(({name}) => `<th scope="col">${name}</th>`).join("")}
  </tr></thead>
  <tbody>${frequentRows.map(({label, unit, offers, note, unitPrices, lowest}) => {
    return `<tr>
      <th scope="row">${label}${note ? `<small>${note}</small>` : ""}</th>
      ${offers.map(([cents, quantity, name, url], index) => `
        <td class="${unitPrices[index] === lowest ? "lowest-price" : ""}">
          <strong>${money(unitPrices[index])}/${unit}</strong>
          <small>${external(name, url)} · ${money(cents)}${quantity === 1 && unit === "kg" ? " por 1 kg" : ""}</small>
        </td>`).join("")}
    </tr>`;
  }).join("")}</tbody>
  <tfoot><tr>
    <th scope="row">Onde vale mais a pena comprar<small>Por menor preço por medida. Pernil e costela têm preparos ou apresentações diferentes.</small></th>
    ${catalogStores.map(({name}, index) => {
      const cheaper = frequentRows.filter(({winners}) => winners.length === 1 && winners[0] === index);
      return `<td><strong>${name} · ${cheaper.length} ${cheaper.length === 1 ? "item" : "itens"}</strong>
        <small>${cheaper.map(({label}) => label).join(", ") || "Sem itens com menor preço exclusivo."}</small></td>`;
    }).join("")}
  </tr></tfoot>`;
