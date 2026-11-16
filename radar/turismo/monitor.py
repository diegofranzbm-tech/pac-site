"""Monitor público de campanhas. Python padrão, sem credenciais ou reservas."""
import hashlib
import json
import re
import os
from datetime import datetime, timezone
from pathlib import Path
from html.parser import HTMLParser
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent

class Text(HTMLParser):
    def __init__(self):
        super().__init__(); self.skip = 0; self.parts = []
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style', 'noscript'): self.skip += 1
    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'noscript'): self.skip = max(0, self.skip - 1)
    def handle_data(self, value):
        if not self.skip and value.strip(): self.parts.append(value.strip())

def extract(html):
    parser = Text(); parser.feed(html)
    return re.sub(r'\s+', ' ', ' '.join(parser.parts)).strip()

def observe(source, now, fetch=None):
    try:
        if fetch is None:
            request = Request(source['url'], headers={'User-Agent': 'TurismoRadar/1.0 (public campaign monitoring)'})
            with urlopen(request, timeout=35) as response:
                if 'text/html' not in response.headers.get('Content-Type', ''): raise ValueError('Formato inesperado')
                raw = response.read(3_000_000).decode('utf-8', 'replace')
        else: raw = fetch(source['url'])
        text = extract(raw)
        if len(text) < 150 or re.search(r'verify you are human|access denied|just a moment|não é um robô', text, re.I):
            raise ValueError('Página bloqueada ou conteúdo insuficiente')
        if not re.search(source['identity'], text, re.I): raise ValueError('Página não corresponde à fonte esperada')
        # Exclui contadores e conteúdo dinâmico geral; registra trechos relevantes.
        excerpts = [text[max(0, m.start()-20):m.end()+70] for m in re.finditer(r'black\s*(?:friday|summer)|\d{1,2}\s*%\s*(?:off|de desconto)|202[67]|R\$\s*[\d.,]+', text, re.I)]
        excerpts = list(dict.fromkeys(excerpts))
        evidence = excerpts[:3]
        digest = hashlib.sha256(json.dumps(excerpts, ensure_ascii=False).encode()).hexdigest()
        previous = source.get('hash')
        changed = bool(previous and previous != digest)
        source.update(status='alteração detectada' if changed else 'acessível', checked_at=now, last_success=now, error=None, hash=digest, evidence=evidence)
        if changed:
            source['changed_at'] = now
            source['history'] = ([{'time': now, 'before': source.get('previous_evidence', []), 'after': evidence}] + source.get('history', []))[:30]
        source['previous_evidence'] = evidence
    except Exception as error:
        source.update(status='falha de consulta', checked_at=now, error=str(error)[:220])

def run():
    data = json.loads((ROOT/'data.json').read_text())
    now = datetime.now(timezone.utc).isoformat()
    # Campanha exclusivamente de 2026; preserva o arquivo para consulta posterior.
    if datetime.now(ZoneInfo('America/Sao_Paulo')).date().isoformat() > '2026-11-30': return
    for resort in data['resorts']:
        for source in resort['sources']: observe(source, now)
    data['last_run'] = now
    temp = ROOT/'data.json.tmp'
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
    os.replace(temp, ROOT/'data.json')
    print('Monitoramento concluído:', now)

if __name__ == '__main__': run()
