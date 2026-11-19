from datetime import date, datetime
import unittest

from monitor import ZONE, parse_cvc_packages, parse_cvc_resorts, parse_decolar, parse_decolar_morro, record

TODAY = date(2026, 11, 19)
DECOLAR = """
<h3>Pacotes para Punta Cana</h3>
<h5>Serenade Punta Cana Beach &amp; Spa Resort</h5>
<div>Hotel + Aéreo sex 09 abr - qua 14 abr</div>
<div>Economize R$ 379</div><div>Preço por pessoa <b>R$3.261</b></div><s>R$3.640</s>
<h5>Outro Resort</h5><div>Hotel + Aéreo dom 20 dez - sáb 26 dez</div>
<div>Preço por pessoa R$ 1.000</div>
"""
CVC = """
<h2>Pacotes internacionais</h2><p>8 dias | 7 noites</p>
<h3>Pacote Punta Cana Saindo de São Paulo</h3>
<ul><li>Aéreo ida e volta</li><li>Hospedagem All Inclusive</li><li>Saída: 01/06/2027</li></ul>
<p>12x R$ 469</p><p>Total por pessoa R$ 5.625</p>
<h3>Pacote para Cancún Saindo de São Paulo</h3>
<p>Aéreo ida e volta Hospedagem Saída: 02/06/2027 Total por pessoa R$ 4.000</p>
"""
RESORTS = """
<h3>Resorts El Aram Imirá Beach Resort Natal</h3>
<p>All Inclusive</p><p>Check-in: 21/02/2027</p>
<p>Diária R$ a partir de R$ 573 Por pessoa em apto duplo</p>
"""

class TravelMonitorTests(unittest.TestCase):
    def test_decolar_uses_advertised_total_and_validates_year(self):
        row, = parse_decolar(DECOLAR, TODAY)
        self.assertEqual((row["price"], row["start"], row["end"], row["nights"]),
                         (3261, "2027-04-09", "2027-04-14", 5))
        self.assertEqual(parse_decolar(DECOLAR, date(2027, 4, 10)), [])

    def test_cvc_packages_require_all_inclusive_or_resort_and_airfare(self):
        row, = parse_cvc_packages(CVC, TODAY)
        self.assertEqual((row["origin"], row["price"], row["nights"], row["kind"]),
                         ("São Paulo", 5625, 7, "package"))

    def test_cvc_daily_prices_stay_separate(self):
        row, = parse_cvc_resorts(RESORTS, TODAY)
        self.assertEqual((row["price"], row["kind"], row["nights"]), (573, "night", None))

    def test_cvc_uses_the_published_domestic_section(self):
        foreign = RESORTS.replace("El Aram Imirá Beach Resort Natal", "Resort de Punta Cana")
        domestic, international = parse_cvc_resorts(
            "<h2>Resorts Nacionais</h2>" + RESORTS + "<h2>Resorts Internacionais</h2>" + foreign, TODAY)
        self.assertEqual(domestic["country"], "BR")
        self.assertIsNone(international["country"])

    def test_decolar_classifies_confirmed_domestic_destinations(self):
        row, = parse_decolar(DECOLAR.replace("Pacotes para Punta Cana", "Pacotes para João Pessoa"), TODAY)
        self.assertEqual(row["country"], "BR")
        self.assertIsNone(parse_decolar(DECOLAR, TODAY)[0]["country"])

    def test_morro_uses_the_room_price_for_two_guests_in_2027(self):
        html = """
        <h5>Topázio Pousada</h5><p>1 noite, 2 pessoas a partir de R$ 256 R$221</p>
        <p>Data de referência: 5 março 2027</p>
        <h5>Outra pousada</h5><p>1 noite, 2 pessoas a partir de R$ 100</p>
        <p>Data de referência: 5 dezembro 2026</p>
        """
        row, = parse_decolar_morro(html, TODAY)
        self.assertEqual((row["price"], row["guests"], row["start"], row["kind"]), (221, 2, "2027-03-05", "night"))
        self.assertFalse(row["all_inclusive"])

    def test_failed_collection_preserves_previous_observation(self):
        data = {"offers": {}, "sources": {}}
        row, = parse_cvc_packages(CVC, TODAY)
        first = datetime(2026, 11, 19, 11, tzinfo=ZONE)
        later = datetime(2026, 11, 20, 11, tzinfo=ZONE)
        record(data, row["source"], [row], first)
        record(data, row["source"], [], later, "HTTP 403")
        self.assertEqual(data["offers"][row["id"]]["history"], {"2026-11-19": 5625})
        self.assertEqual(data["sources"][row["source"]]["status"], "error")
        record(data, row["source"], [], later)
        self.assertFalse(data["offers"][row["id"]]["listed"])
