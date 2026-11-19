"""Consulta vitrines públicas e mantém uma observação diária por oferta."""
import hashlib
from html.parser import HTMLParser
import json
import re
from datetime import date, datetime, timedelta
from pathlib import Path
from urllib.error import URLError
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

YEAR = 2027
ROOT = Path(__file__).resolve().parent
ZONE = ZoneInfo("America/Sao_Paulo")
DECOLAR = "https://www.decolar.com/ofertas-viagens/pacoteiros"
CVC_RESORTS = "https://www.cvc.com.br/lp/promocoes/resorts-all-inclusive-cvc"
CVC_PACKAGES = "https://www.cvc.com.br/lp/promocoes/viaje-pelo-mundo"
SOURCES = {
    "decolar": ("Decolar · pacotes", DECOLAR),
    "cvc-pacotes": ("CVC · pacotes internacionais", CVC_PACKAGES),
    "cvc-resorts": ("CVC · diárias", CVC_RESORTS),
}
MONTHS = "jan fev mar abr mai jun jul ago set out nov dez".split()
DAYS = "seg ter qua qui sex sáb dom".split()
RESORT = re.compile(r"\bresort\b|all[ -]inclusive", re.I)
AMOUNT = r"(\d{1,3}(?:\.\d{3})+(?:,\d{2})?|\d+(?:,\d{2})?)"

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.heading = None
        self.title = []
        self.body = []
        self.blocks = []
        self.skip = None
        self.feed(html)
        self.finish_block()

    def finish_block(self):
        if self.heading:
            self.blocks.append((self.heading, tidy("".join(self.title)), tidy("".join(self.body))))
        self.title = []
        self.body = []

    def handle_starttag(self, tag, _attrs):
        if self.skip:
            return
        if tag in {"script", "style"}:
            self.skip = tag
        elif re.fullmatch(r"h[1-6]", tag):
            self.finish_block()
            self.heading = tag
            self.in_heading = True
        elif tag in {"div", "p", "li", "br", "section", "article"}:
            self.handle_data(" ")

    def handle_endtag(self, tag):
        if self.skip:
            if tag == self.skip:
                self.skip = None
            return
        if tag == self.heading:
            self.in_heading = False
        elif tag in {"div", "p", "li", "section", "article"}:
            self.handle_data(" ")

    def handle_data(self, data):
        if self.heading and not self.skip:
            (self.title if self.in_heading else self.body).append(data)

    def sections(self):
        return self.blocks

def tidy(text):
    return " ".join(text.split())

def amount(value):
    return round(float(value.replace(".", "").replace(",", ".")), 2)

def offer(source, name, destination, start, price, kind, end=None, origin=""):
    identity = [source, name.casefold(), destination.casefold(), start.isoformat(), str(end), origin, kind]
    return dict(id=hashlib.sha256("|".join(identity).encode()).hexdigest()[:20], source=source,
                name=name, destination=destination, start=start.isoformat(),
                end=end.isoformat() if end else None, price=price, kind=kind,
                nights=(end - start).days if end else None, origin=origin,
                all_inclusive=bool(re.search(r"all[ -]inclusive", name, re.I)),
                url=SOURCES[source][1])

def parse_decolar(html, today):
    sections = Page(html).sections()
    result, destination = [], ""
    pattern = r"hotel\s*\+\s*aéreo.{0,100}?\b(seg|ter|qua|qui|sex|sáb|dom)\s+(\d{1,2})\s+([a-z]{3})\s*[-–]\s*(seg|ter|qua|qui|sex|sáb|dom)\s+(\d{1,2})\s+([a-z]{3})"
    for tag, title, details in sections:
        match_destination = re.match(r"Pacotes para (.+)", title, re.I)
        if match_destination:
            destination = match_destination[1]
            continue
        if not destination or tag not in {"h4", "h5", "h6"} or not RESORT.search(title):
            continue
        period = re.search(pattern, details, re.I)
        price = re.search(r"preço por pessoa\s*R\$\s*" + AMOUNT, details, re.I)
        if not period or not price:
            continue
        weekday, day, month, last_weekday, last_day, last_month = period.groups()
        if month.lower() not in MONTHS or last_month.lower() not in MONTHS:
            continue
        first_month, final_month = MONTHS.index(month.lower()) + 1, MONTHS.index(last_month.lower()) + 1
        try:
            start = date(YEAR, first_month, int(day))
            end = date(YEAR + (final_month < first_month), final_month, int(last_day))
        except ValueError:
            continue
        if (start < today or not 0 < (end - start).days <= 35
                or DAYS[start.weekday()] != weekday.lower() or DAYS[end.weekday()] != last_weekday.lower()):
            continue
        result.append(offer("decolar", title, destination, start, amount(price[1]), "package", end))
    return result

def parse_cvc_resorts(html, today):
    result = []
    for tag, title, details in Page(html).sections():
        checkin = re.search(r"check[ -]?in\s*:\s*(\d{2}/\d{2}/2027)", details, re.I)
        price = re.search(r"diária\s*(?:R\$\s*)?a partir de\s*R\$\s*" + AMOUNT, details, re.I)
        if tag != "h3" or not title.startswith("Resorts ") or not checkin or not price:
            continue
        start = datetime.strptime(checkin[1], "%d/%m/%Y").date()
        if start >= today:
            item = offer("cvc-resorts", title.removeprefix("Resorts "), "", start, amount(price[1]), "night")
            item["all_inclusive"] = "all inclusive" in details.lower()
            result.append(item)
    return result

def parse_cvc_packages(html, today):
    result = []
    previous_details = ""
    for tag, title, details in Page(html).sections():
        route = re.match(r"Pacote (.+?) Saindo de (.+)", title, re.I)
        departure = re.search(r"(?:saída|embarque)\s*:\s*(\d{2}/\d{2}/2027)", details, re.I)
        price = re.search(r"total por pessoa\s*R\$\s*" + AMOUNT, details, re.I)
        duration = re.search(r"(\d{1,2})\s*noites?\b", details, re.I)
        if not duration:
            duration = re.search(r"(\d{1,2})\s*noites?\s*$", previous_details, re.I)
        previous_details = details
        lodging = re.search(r"\bhospedagem\s+(?:com\s+)?all[ -]inclusive\b|\bresort\b", details, re.I)
        if tag != "h3" or not (route and departure and price and lodging and re.search(r"\baéreo\b", details, re.I)):
            continue
        start = datetime.strptime(departure[1], "%d/%m/%Y").date()
        if start < today:
            continue
        end = start + timedelta(days=int(duration[1])) if duration else None
        name = "Pacote All Inclusive em " + route[1] if "inclusive" in lodging[0].lower() else title
        result.append(offer("cvc-pacotes", name, route[1], start, amount(price[1]), "package", end, origin=route[2]))
    return result

def fetch(url):
    request = Request(url, headers={"Accept": "text/html", "User-Agent": "PAC-Radar-Viagem/1.0"})
    with urlopen(request, timeout=25) as response:
        return response.read().decode(response.headers.get_content_charset() or "utf-8", errors="replace")

def collect(source, today):
    if source == "decolar":
        return parse_decolar(fetch(DECOLAR), today)
    if source == "cvc-resorts":
        return parse_cvc_resorts(fetch(CVC_RESORTS), today)
    return parse_cvc_packages(fetch(CVC_PACKAGES), today)

def record(data, source, rows, now, error=None):
    status = data["sources"].setdefault(source, {})
    status.update(checked_at=now.isoformat(), status="error" if error else "ok", error=error)
    if error:
        return
    status.update(last_success=now.isoformat(), count=len(rows))
    for item in data["offers"].values():
        if item["source"] == source:
            item["listed"] = False
    for item in rows:
        prior = data["offers"].get(item["id"], {})
        history = prior.get("history", {})
        history[now.date().isoformat()] = item["price"]
        data["offers"][item["id"]] = dict(item, last_seen=now.isoformat(), listed=True, history=history)

def main():
    path = ROOT / "data.json"
    data = json.loads(path.read_text()) if path.exists() else {"offers": {}, "sources": {}}
    now = datetime.now(ZONE)
    for source, (name, url) in SOURCES.items():
        data["sources"].setdefault(source, {}).update(name=name, url=url)
        try:
            rows = list({item["id"]: item for item in collect(source, now.date())}.values())
            if not rows and now.date() <= date(YEAR, 12, 31):
                raise ValueError("Nenhum preço elegível reconhecido nas páginas consultadas.")
            record(data, source, rows, now)
            print(f"{name}: {len(rows)} ofertas")
        except (URLError, OSError, ValueError) as exc:
            error = str(exc)
            record(data, source, [], now, error)
            print(f"{name}: {error}")
    data["last_run"] = now.isoformat()
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    temporary.replace(path)

if __name__ == "__main__":
    main()
