"""Médias de financiamento habitacional: consulta diária à fonte oficial BCB."""
import json
import math
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode, quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
BASE = 'https://olinda.bcb.gov.br/olinda/servico/taxaJuros/versao/v2/odata/TaxasJurosMensalPorMes'
MODALITY = 'Financiamento imobiliário com taxas de mercado - Pós-fixado referenciado em TR'
SOURCE = 'https://www.bcb.gov.br/estatisticas/reporttxjuros?codigoModalidade=903201&codigoSegmento=1'
BANKS = {
    '00360305': 'Caixa',
    '00000000': 'Banco do Brasil',
    '60701190': 'Itaú',
    '60746948': 'Bradesco',
    '90400888': 'Santander',
    '00416968': 'Inter',
    '01181521': 'Sicredi',
}

def query_url(**params):
    # Olinda exige espaços como %20; '+' em filtros é interpretado como operador.
    return BASE + '?' + urlencode({'$format': 'json', **params}, quote_via=quote)

def fetch(url):
    last = None
    for attempt in range(3):
        try:
            request = Request(url, headers={'User-Agent': 'FloripaRadar/1.0 (public BCB rates)', 'Accept': 'application/json'})
            with urlopen(request, timeout=35) as response:
                data = json.load(response)
            if not isinstance(data.get('value'), list): raise ValueError('Resposta sem tabela de taxas')
            return data['value']
        except Exception as error:
            last = error
            if attempt < 2: time.sleep(attempt + 1)
    raise last

def build_rows(records, month):
    found = {}
    for record in records:
        if record.get('Modalidade') != MODALITY or record.get('anoMes') != month: continue
        bank_id = str(record.get('cnpj8', '')).zfill(8)
        if bank_id not in BANKS: continue
        try:
            annual = float(record['TaxaJurosAoAno'])
            monthly = float(record['TaxaJurosAoMes'])
            if not all(math.isfinite(v) and v > 0 for v in (annual, monthly)): continue
        except (KeyError, ValueError, TypeError): continue
        if bank_id in found: raise ValueError('Mais de uma taxa para a mesma instituição no período')
        found[bank_id] = dict(cnpj8=bank_id, name=BANKS[bank_id], official_name=record['InstituicaoFinanceira'], annual=annual, monthly=monthly, available=True)
    if not found: raise ValueError('Nenhuma taxa válida das instituições acompanhadas no período')
    rows = [found.get(key, dict(cnpj8=key, name=name, annual=None, monthly=None, available=False)) for key, name in BANKS.items()]
    return sorted(rows, key=lambda row: (row['annual'] is None, row['annual'] if row['annual'] is not None else math.inf, row['name']))

def update(previous, get=fetch, now=None):
    now = now or datetime.now(timezone.utc).isoformat()
    result = dict(previous, checked_at=now)
    try:
        latest_url = query_url(**{'$filter': "Modalidade eq '" + MODALITY + "'", '$orderby': 'anoMes desc', '$top': 1})
        latest = get(latest_url)
        if not latest: raise ValueError('Banco Central não retornou período de referência')
        month = latest[0].get('anoMes', '')
        datetime.strptime(month, '%Y-%m')
        if month > now[:7]: raise ValueError('Período de referência futuro')
        if previous.get('reference_month') and month < previous['reference_month']:
            raise ValueError('A fonte retornou período anterior ao último já armazenado')
        url = query_url(**{'$filter': "Modalidade eq '" + MODALITY + "' and anoMes eq '" + month + "'", '$top': 1000})
        records = get(url)
        rows = build_rows(records, month)
        result.update(status='ok', error=None, last_success=now, reference_month=month, modality=MODALITY, indexer='TR', source_url=SOURCE, api_url=url, rows=rows)
    except Exception as error:
        result.update(status='error', error=str(error)[:240])
    return result

def run():
    path = ROOT/'data.json'
    previous = json.loads(path.read_text()) if path.exists() else {'rows': []}
    result = update(previous)
    temp = path.with_suffix('.json.tmp')
    temp.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    os.replace(temp, path)
    print('Financiamento:', result['status'], 'referência:', result.get('reference_month', 'sem dados'))
    return result

if __name__ == '__main__':
    run()
