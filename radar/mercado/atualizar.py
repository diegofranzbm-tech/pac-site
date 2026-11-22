"""Consulta os mesmos produtos publicados nos catálogos públicos do Mercado."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import quote, urlsplit
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "precos.js"
PREFIX = "const marketPriceRefresh = "
OFFER = re.compile(
    r'\[\d+, (?:[\d.]+, )?"[^"\n]+", "(https://(?:www\.bistek\.com\.br|super\.angeloni\.com\.br)/[^"]+)"\]'
)
CATEGORY_QUERIES = {
    "https://super.angeloni.com.br/frios-e-laticinios/leite": ("leite italac integral 400g", "italac", "400g"),
    "https://super.angeloni.com.br/achocolatados-nestle": ("achocolatado nescau 350g", "nescau", "350g"),
}


def check_price(url):
    parsed = urlsplit(url)
    endpoint = f"https://{parsed.netloc}/api/catalog_system/pub/products/search"
    if url in CATEGORY_QUERIES:
        query, brand, size = CATEGORY_QUERIES[url]
        endpoint += "?ft=" + quote(query)

        def matches(product):
            name = product["productName"].casefold().replace(" ", "")
            return brand in name and size in name and "integral" in name if brand == "italac" else (
                brand in name and size in name and "menos" not in name and "cilíndrico" not in name
            )
    else:
        endpoint += parsed.path
        slug = parsed.path.strip("/").removesuffix("/p")

        def matches(product):
            return product["linkText"] == slug

    try:
        result = subprocess.run(
            ["curl", "--fail", "--silent", "--show-error", "--location", "--max-time", "15", endpoint],
            capture_output=True, check=True,
        )
        products = json.loads(result.stdout)
        prices = [
            offer["Price"]
            for product in products if matches(product)
            for sku in product["items"]
            for seller in sku["sellers"]
            if (offer := seller["commertialOffer"])["AvailableQuantity"] > 0 and offer["Price"] > 0
        ]
        if len({price for price in prices}) == 1:
            return int((Decimal(str(prices[0])) * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    except (subprocess.SubprocessError, ValueError, KeyError, TypeError) as error:
        print(f"{url}: {error}")
    return None


def main():
    urls = sorted({
        url for name in ("cesta.js", "segmentos.js", "frequentes.js")
        for url in OFFER.findall((ROOT / name).read_text(encoding="utf-8"))
    })
    if not urls:
        raise RuntimeError("Nenhum produto encontrado nas tabelas do Mercado.")
    today = datetime.now(ZoneInfo("America/Sao_Paulo")).date().isoformat()
    previous = json.loads(OUTPUT.read_text(encoding="utf-8").removeprefix(PREFIX).strip().removesuffix(";"))
    with ThreadPoolExecutor(max_workers=8) as pool:
        results = dict(zip(urls, pool.map(check_price, urls)))
    verified = sum(price is not None for price in results.values())
    payload = {
        "checked": today,
        "verified": verified,
        "total": len(urls),
        "products": {
            url: {"cents": price, "date": today} if price is not None else previous["products"][url]
            for url, price in results.items()
            if price is not None or url in previous["products"]
        },
    }
    temp = OUTPUT.with_suffix(".tmp")
    temp.write_text(PREFIX + json.dumps(payload, indent=2, ensure_ascii=False) + ";\n", encoding="utf-8")
    temp.replace(OUTPUT)
    print(f"Catálogos em {today}: {verified}/{len(urls)} preços confirmados.")


if __name__ == "__main__":
    main()
