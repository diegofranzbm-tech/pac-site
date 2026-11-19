(() => {
  const find = id => document.getElementById(id);
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const timestamp = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo',
  });
  const day = value => value.split('-').reverse().join('/');
  const when = value => value ? timestamp.format(new Date(value)) : '—';
  const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const agency = row => row.source === 'decolar' ? 'Decolar' : 'CVC';
  const text = (tag, value, className) => {
    const node = document.createElement(tag);
    node.textContent = value;
    if (className) node.className = className;
    return node;
  };
  function link(url, label) {
    const node = text('a', label, 'button');
    const target = new URL(url);
    if (target.protocol === 'https:' && ['www.decolar.com', 'www.cvc.com.br'].includes(target.hostname)) {
      node.href = target.href;
      node.target = '_blank';
      node.rel = 'noopener noreferrer';
    }
    return node;
  }

  let data = { offers: {}, sources: {} };
  let selected = '';
  const valid = row => row.listed && Date.now() - new Date(row.last_seen).getTime() < 48 * 3600000;
  const past = row => row.start < new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(new Date());

  function card(row) {
    const node = text('article', '', 'card');
    const body = text('div', '', 'body');
    const details = [row.destination, row.origin ? 'Saída de ' + row.origin : '', row.nights ? row.nights + ' noites' : '',
      row.all_inclusive ? 'All inclusive' : ''].filter(Boolean);
    const dates = day(row.start) + (row.end ? ' a ' + day(row.end) : '');
    body.append(text('div', agency(row), 'store'), text('h3', row.name), text('p', dates, 'small'));
    if (details.length) body.append(text('p', details.join(' · '), 'small'));
    body.append(text('div', money.format(row.price), 'price'),
      text('p', row.kind === 'package' ? 'Por pessoa · aéreo + resort' : 'Por pessoa por diária · hospedagem', 'small'));
    if (row.nights) body.append(text('p', money.format(row.price / row.nights) + ' por pessoa por noite do pacote', 'small'));
    body.append(text('p', (valid(row) ? 'Observado em ' : 'Leitura anterior · ') + when(row.last_seen), 'small'));
    const links = text('div', '', 'links');
    const history = text('button', 'Ver histórico', 'secondary');
    history.onclick = () => {
      selected = row.id;
      find('history-search').value = '';
      renderHistoryOptions();
      find('history').scrollIntoView({ behavior: 'smooth' });
    };
    links.append(link(row.url, 'Ver na agência ↗'), history);
    body.append(links);
    node.append(body);
    return node;
  }

  function renderHistoryOptions() {
    const query = normalize(find('history-search').value.trim());
    const archived = Object.values(data.offers).filter(row =>
      normalize([row.name, row.destination, agency(row)].join(' ')).includes(query));
    archived.sort((a, b) => Number(valid(b) && !past(b)) - Number(valid(a) && !past(a)) ||
      a.name.localeCompare(b.name, 'pt-BR') || a.start.localeCompare(b.start));
    if (!archived.some(row => row.id === selected)) selected = archived[0]?.id || '';
    const label = row => [row.name, agency(row), day(row.start), row.kind === 'package' ? 'Pacote' : 'Diária'].join(' · ');
    find('offer').replaceChildren(...archived.map(row => new Option(label(row), row.id)));
    find('offer').value = selected;
    renderHistory();
  }

  function renderHistory() {
    const row = data.offers[selected];
    const daily = Object.entries(row?.history || {}).sort(([a], [b]) => a.localeCompare(b));
    const weekly = find('history-period').value === 'week';
    const buckets = new Map();
    for (const [observed, price] of daily) {
      const monday = new Date(observed + 'T12:00:00Z');
      monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() + 6) % 7);
      buckets.set(weekly ? monday.toISOString().slice(0, 10) : observed, [observed, price]);
    }
    const latest = daily.at(-1)?.[1];
    const previous = daily.at(-2)?.[1];
    const variation = previous > 0 ? (latest - previous) / previous : null;
    find('history-period-title').textContent = weekly ? 'Semana de' : 'Data da busca';
    find('history-date-title').hidden = !weekly;
    find('history-last').textContent = latest === undefined ? '—' : money.format(latest);
    find('history-lowest').textContent = daily.length ? money.format(Math.min(...daily.map(([, price]) => price))) : '—';
    find('history-change').textContent = variation === null ? '—' :
      variation.toLocaleString('pt-BR', { style: 'percent', maximumFractionDigits: 1, signDisplay: 'exceptZero' });
    const unit = row?.kind === 'night' ? 'Preço por pessoa por diária.' : 'Preço por pessoa pelo pacote.';
    find('history-note').textContent = daily.length ? unit + ' ' + (weekly
      ? 'Última leitura de cada semana com coleta.'
      : (daily.length === 1 ? 'Uma leitura registrada até agora.' : daily.length + ' dias com preços registrados.'))
      : 'Nenhuma leitura para esta seleção.';
    find('history-rows').replaceChildren(...[...buckets].reverse().map(([period, [observed, price]]) => {
      const tr = document.createElement('tr');
      tr.append(text('td', day(period)));
      if (weekly) tr.append(text('td', day(observed)));
      tr.append(text('td', money.format(price)));
      return tr;
    }));
  }

  function renderBrazil(offers) {
    const brazil = offers.filter(row => row.country === 'BR' && row.all_inclusive);
    brazil.sort((a, b) => Number(valid(b)) - Number(valid(a)) || a.price - b.price);
    find('brazil-count').textContent = brazil.length === 1 ? '1 oferta encontrada' : brazil.length + ' ofertas encontradas';
    for (const [id, kind] of [['brazil-packages', 'package'], ['brazil-nights', 'night']]) {
      const rows = brazil.filter(row => row.kind === kind);
      find(id).replaceChildren(...(rows.length ? rows.map(card) : [text('p', 'Nenhuma oferta nesta categoria.', 'empty')]));
    }
  }

  function render() {
    const all = Object.values(data.offers).filter(row => !past(row));
    renderBrazil(all);
    const current = all.filter(row => row.kind === 'package' && valid(row));
    find('total').textContent = current.length;
    find('lowest').textContent = current.length ? money.format(Math.min(...current.map(row => row.price))) : '—';
    find('last').textContent = when(data.last_run);
    const query = normalize(find('query').value.trim());
    const supplier = find('agency').value;
    const kind = find('kind').value;
    const sort = find('sort').value;
    const rows = all.filter(row => row.kind === kind && (!supplier || agency(row) === supplier) &&
      (!find('inclusive').checked || row.all_inclusive) && normalize(row.name + ' ' + row.destination).includes(query));
    const unit = row => row.price / (row.nights || 1);
    rows.sort((a, b) => Number(valid(b)) - Number(valid(a)) ||
      (sort === 'date' ? a.start.localeCompare(b.start) : sort === 'night' ? unit(a) - unit(b) : a.price - b.price));
    find('count').textContent = rows.length === 1 ? '1 oferta' : rows.length + ' ofertas';
    find('cards').replaceChildren(...(rows.length ? rows.map(card) : [text('p', 'Nenhuma oferta nesta seleção.', 'empty')]));
    if (!selected) selected = rows[0]?.id || '';
    renderHistoryOptions();
    const sources = Object.values(data.sources);
    const failed = sources.filter(source => source.status === 'error');
    find('notice').hidden = !failed.length;
    find('notice').textContent = failed.length ? 'A última consulta falhou em ' +
      failed.map(source => source.name).join(', ') + '. Confira a data de cada preço.' : '';
    find('sources').replaceChildren(...sources.map(source => {
      const item = document.createElement('li');
      item.append(link(source.url, source.name), text('p',
        (source.status === 'error' ? 'Falha na consulta' : source.status === 'manual' ? 'Leitura da vitrine pública' : 'Consulta concluída') +
        ' · Última leitura válida: ' + when(source.last_success), 'small'));
      return item;
    }));
  }

  async function load() {
    find('reload').disabled = true;
    try {
      const response = await fetch('./data.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('dados indisponíveis');
      data = await response.json();
      render();
      if (location.hash === '#all-inclusive-brasil') find('all-inclusive-brasil').scrollIntoView();
    } catch {
      find('notice').hidden = false;
      find('notice').textContent = 'Os dados do monitor estão indisponíveis.';
    } finally {
      find('reload').disabled = false;
    }
  }
  find('reload').onclick = load;
  find('history-period').onchange = renderHistory;
  find('history-search').oninput = renderHistoryOptions;
  find('offer').onchange = event => { selected = event.target.value; renderHistory(); };
  for (const id of ['query', 'agency', 'kind', 'sort', 'inclusive']) find(id).addEventListener('input', render);
  load();
})();
