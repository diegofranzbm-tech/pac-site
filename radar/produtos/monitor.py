"""Colchões queen 158x198: preços diários reais e histórico por SKU/vendedor."""
import gzip
import json
import math
import os
import re
import time
import unicodedata
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone, timedelta
from pathlib import Path
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent
TZ = ZoneInfo('America/Sao_Paulo')
SOURCES = [
    {'id':'probel','name':'Probel · loja oficial','adapter':'vtex','url':'https://www.probel.com.br/colchao/','endpoint':'https://www.probel.com.br/api/catalog_system/pub/products/search/colchao?ft=queen&_from=0&_to=49','limit':'Até 50 produtos da categoria Colchão na busca queen'},
    {'id':'orthocrin','name':'Orthocrin · loja oficial','adapter':'shopify','url':'https://orthocrin.com.br/collections/tamanho-queen','endpoint':'https://orthocrin.com.br/collections/tamanho-queen/products.json?limit=250','limit':'Até 250 produtos da coleção Queen'},
    {'id':'sleepcalm','name':'Sleep Calm · loja oficial','adapter':'sleepcalm','url':'https://sleepcalm.com.br/produto/colchao-original','endpoint':'https://sleepcalm.com.br/produto/colchao-original','limit':'Colchão Original: variantes queen 158x198 de espuma e molas, separadas por SKU'},
]

TYPE_LABELS={'espuma':'Espuma','molas':'Molas','hibrido':'Híbrido (molas + espuma)','nao-informado':'Tipo não informado'}

def construction(text):
    text=norm(text)
    if 'hibrid' in text:return 'hibrido'
    if re.search(r'mola|pocket|superlastic|miracoil|prolastic',text):return 'molas'
    if 'espuma' in text:return 'espuma'
    return 'nao-informado'

def norm(value):
    return ''.join(c for c in unicodedata.normalize('NFD',str(value)) if not unicodedata.combining(c)).lower()

def mattress_only(title):
    title=norm(title)
    return 'colchao' in title and not re.search(r'\b(?:kit|conjunto|box|base|cabeceira|protetor|capa|travesseiro|conjugado)\b',title)

def positive(value):
    try:
        value=float(value)
        return round(value,2) if math.isfinite(value) and value>0 else None
    except (TypeError,ValueError): return None

def cm(values,expected):
    values=values if isinstance(values,list) else [values]
    dimensions=[]
    for value in values:
        match=re.fullmatch(r'\s*(\d+(?:[.,]\d+)?)\s*(cm|m)?\s*',str(value),re.I)
        if match:
            number=float(match[1].replace(',','.'))*(100 if match[2]=='m' else 1)
            dimensions.append(number)
    return bool(dimensions) and all(abs(number-expected)<.01 for number in dimensions)

def parse_vtex(data, source):
    if not isinstance(data,list): raise ValueError('Catálogo Probel fora do formato esperado')
    rows=[]
    for product in data:
        title=product.get('productName','')
        if not mattress_only(title):continue
        for item in product.get('items',[]):
            # Primeiro as dimensões do SKU, depois as dimensões publicadas do produto.
            if item.get('isKit'):continue
            if not (cm(item.get('Largura',product.get('Largura')),158) and cm(item.get('Comprimento',product.get('Comprimento')),198)):continue
            for seller in item.get('sellers',[]):
                offer=seller.get('commertialOffer',{})
                if not item.get('itemId') or not seller.get('sellerId'):continue
                price=positive(offer.get('Price'))
                available=bool(offer.get('IsAvailable',False) and offer.get('AvailableQuantity',0)>0 and price)
                pix=[positive(v.get('TotalValuePlusInterestRate')) for v in offer.get('Installments',[]) if str(v.get('PaymentSystemName','')).lower()=='pix' and v.get('NumberOfInstallments')==1]
                pix=[p for p in pix if p]
                images=item.get('images',[])
                rows.append(dict(id='probel:'+str(item['itemId'])+':'+str(seller['sellerId']),source_id=source['id'],store=source['name'],seller=seller.get('sellerName',source['name']),sku=str(item['itemId']),name=item.get('nameComplete') or title,brand=product.get('brand','Probel'),size='158 × 198 cm',variant=str(item.get('name','')),url=product.get('link','')+'?skuId='+str(item['itemId']),image=images[0].get('imageUrl') if images else None,price=price if available else None,pix_price=min(pix) if pix and available else None,available=available,basis='catalogo-brl',condition='Preço de catálogo em BRL, sem frete. Pix informado à parte quando explícito.'))
    return rows

def parse_shopify(data,source):
    if not isinstance(data,dict) or not isinstance(data.get('products'),list):raise ValueError('Catálogo Orthocrin fora do formato esperado')
    rows=[]
    for product in data['products']:
        if not mattress_only(product.get('title','')):continue
        for variant in product.get('variants',[]):
            title=variant.get('title','')
            if not re.search(r'(?<!\d)158\s*[x×]\s*198(?!\d)',title,re.I):continue
            if not variant.get('id') or not product.get('handle'):continue
            price=positive(variant.get('price'))
            available=variant.get('available') is True and price is not None
            images=product.get('images',[])
            rows.append(dict(id='orthocrin:'+str(variant['id']),source_id=source['id'],store=source['name'],seller='Orthocrin',sku=str(variant['id']),name=product['title'],brand=product.get('vendor','Orthocrin'),size='158 × 198 cm',variant=title,url='https://orthocrin.com.br/products/'+product['handle']+'?variant='+str(variant['id']),image=images[0].get('src') if images else None,price=price if available else None,pix_price=None,available=available,basis='catalogo-brl',condition='Preço de catálogo em BRL, sem frete. Descontos adicionais de Pix ou cupom não aplicados.'))
    return rows

def fetch(url):
    last=None
    for attempt in range(2):
        try:
            req=Request(url,headers={'User-Agent':'ProdutosRadar/1.0 (public catalog price monitoring)','Accept':'application/json','Accept-Encoding':'identity'})
            with urlopen(req,timeout=35) as response: raw=response.read(12_000_000)
            if raw.startswith(b'\x1f\x8b'):raw=gzip.decompress(raw)
            try:return json.loads(raw)
            except json.JSONDecodeError:
                match=re.search(r'<script\b[^>]*\bid=["\']__NEXT_DATA__["\'][^>]*>(.*?)</script>',raw.decode('utf-8'),re.S)
                if not match:raise ValueError('Página sem catálogo estruturado reconhecido')
                return json.loads(match[1])
        except Exception as error:
            last=error
            if attempt==0:time.sleep(1)
    raise last

def collect(source,get=fetch):
    try:
        data=get(source['endpoint'])
        adapters={'vtex':parse_vtex,'shopify':parse_shopify,'sleepcalm':parse_sleepcalm}
        rows=adapters[source['adapter']](data,source)
        for row in rows:
            row.setdefault('type',construction(row['name']))
            row['type_label']=TYPE_LABELS[row['type']]
        if not rows:raise ValueError('Nenhum SKU queen 158x198 reconhecido; verificar formato da fonte')
        return rows,None
    except Exception as error:return [],str(error)[:240]

def parse_sleepcalm(data,source):
    product=data.get('props',{}).get('pageProps',{}).get('product',{})
    if product.get('id')!=11 or normal_name(product.get('name',''))!='colchao original':raise ValueError('Produto Sleep Calm não corresponde ao Original esperado')
    rows=[]
    for child in product.get('children',[]):
        attrs=child.get('attributes',{});size=attrs.get('tamanho','');core=attrs.get('essencial','')
        if not re.fullmatch(r'Queen\s*\(158\s*[x×]\s*198\)',size,re.I) or not child.get('sku'):continue
        price=positive(child.get('price'));available=child.get('stock')=='instock' and price is not None
        images=product.get('gallery_image_url',[])
        rows.append(dict(id='sleepcalm:'+child['sku'],source_id=source['id'],store=source['name'],seller='Sleep Calm',sku=child['sku'],name=child['name'],brand='Sleep Calm',size='158 × 198 cm',variant=size+' · '+core,url=source['url'],image=images[0] if images else None,price=price if available else None,pix_price=None,available=available,basis='catalogo-brl',condition='Preço da variante queen no catálogo, sem frete. Desconto de Pix/boleto deve ser confirmado no checkout.',type=construction(core)))
    return rows

def normal_name(text):return norm(text).strip()

def week_of(day):
    return (day-timedelta(days=day.weekday())).isoformat()

def merge(previous,results,now):
    data=dict(previous)
    products={p['id']:dict(p,type=p.get('type',construction(p['name'])),type_label=p.get('type_label',TYPE_LABELS[construction(p['name'])])) for p in previous.get('products',[])}
    states={s['id']:s for s in previous.get('sources',[])}
    day=datetime.fromisoformat(now).astimezone(TZ).date()
    new_states=[]
    for source,(rows,error) in zip(SOURCES,results):
        state=dict(source,**{k:v for k,v in states.get(source['id'],{}).items() if k not in source})
        state.update(checked_at=now,error=error,status='error' if error else 'ok',matches=len(rows))
        if not error:state['last_success']=now
        new_states.append(state)
        seen=set()
        for row in rows:
            old=products.get(row['id'],{})
            observations=list(old.get('observations',[]))
            observation=dict(date=day.isoformat(),week=week_of(day),time=now,price=row['price'],pix_price=row.get('pix_price'),available=row['available'],basis=row['basis'])
            # Uma observação por dia, produto e condição; reexecuções atualizam o mesmo dia.
            observations=[v for v in observations if v['date']!=day.isoformat()]+[observation]
            observations.sort(key=lambda v:v['date'])
            products[row['id']]=dict(row,first_seen=old.get('first_seen',now),checked_at=now,last_success=now,status='ok' if row['available'] else 'unavailable',error=None,observations=observations)
            seen.add(row['id'])
        for product in products.values():
            if product['source_id']!=source['id'] or product['id'] in seen:continue
            product.update(checked_at=now,status='error' if error else 'not_found',error=error or 'SKU não retornou na consulta limitada. Disponibilidade não confirmada.')
            # Falhas e ausência em busca não geram preço nem indisponibilidade no histórico.
    data.update(version=1,last_run=now,started_at=previous.get('started_at',now),sources=new_states,products=list(products.values()))
    return data

def weekly_points(observations):
    latest={}
    for observation in sorted(observations,key=lambda v:v['time']):latest[observation['week']]=observation
    return [dict(week=week,**{k:v for k,v in row.items() if k!='week'}) for week,row in sorted(latest.items())]

def run():
    path=ROOT/'data.json'
    previous=json.loads(path.read_text()) if path.exists() else {}
    now=datetime.now(timezone.utc).isoformat()
    with ThreadPoolExecutor(max_workers=2) as executor: results=list(executor.map(collect,SOURCES))
    data=merge(previous,results,now)
    temp=path.with_suffix('.json.tmp');temp.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');os.replace(temp,path)
    print('Produtos:',len(data['products']),'SKUs; fontes:',[(s['id'],s['status'],s['matches']) for s in data['sources']])
    return data

if __name__=='__main__':run()
