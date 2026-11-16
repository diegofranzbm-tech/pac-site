import unittest
from urllib.parse import urlparse, parse_qs
from monitor import BANKS, MODALITY, build_rows, update, query_url

def records(month='2026-10'):
    return [dict(cnpj8=bank, InstituicaoFinanceira=name, Modalidade=MODALITY, anoMes=month, TaxaJurosAoAno=14-i*.4, TaxaJurosAoMes=.8+i*.01) for i,(bank,name) in enumerate(BANKS.items())]

class RatesTests(unittest.TestCase):
    def test_missing_bank_is_last_without_mixing_month_or_modality(self):
        data=records(); data[0]['anoMes']='2026-09'; data[1]['Modalidade']='outra modalidade'
        rows=build_rows(data,'2026-10')
        values=[r['annual'] for r in rows if r['annual'] is not None]
        self.assertEqual(values,sorted(values)); self.assertEqual(len(rows),7)
        self.assertEqual({r['name'] for r in rows[-2:]},{'Caixa','Banco do Brasil'})

    def test_failure_preserves_rates_and_reference(self):
        previous={'rows':build_rows(records(),'2026-10'),'last_success':'2026-11-15T10:00:00+00:00','reference_month':'2026-10'}
        def unavailable(_): raise ValueError('Fonte indisponível')
        result=update(previous,unavailable,'2026-11-16T10:00:00+00:00')
        self.assertEqual(result['rows'],previous['rows']);self.assertEqual(result['last_success'],previous['last_success'])
        self.assertEqual(result['status'],'error');self.assertNotEqual(result['checked_at'],previous['last_success'])

    def test_new_period_and_correct_query_encoding(self):
        urls=[]
        def get(url): urls.append(url);return records()
        result=update({},get,'2026-11-16T10:00:00+00:00')
        self.assertEqual(result['status'],'ok');self.assertEqual(result['reference_month'],'2026-10')
        self.assertIn("anoMes eq '2026-10'",parse_qs(urlparse(urls[1]).query)['$filter'][0])
        self.assertNotIn('+',urls[1]);self.assertIn('%20',query_url(**{'$orderby':'anoMes desc'}))

    def test_zero_and_nan_not_ranked_as_cheapest(self):
        data=records();data[0]['TaxaJurosAoAno']=0;data[1]['TaxaJurosAoAno']=float('nan')
        rows=build_rows(data,'2026-10');self.assertIsNone(rows[-1]['annual']);self.assertIsNone(rows[-2]['annual'])

    def test_rejects_older_period(self):
        previous={'reference_month':'2026-11','rows':[]}
        result=update(previous,lambda _:records(),'2026-12-01T10:00:00+00:00')
        self.assertEqual(result['status'],'error');self.assertEqual(result['reference_month'],'2026-11')

if __name__=='__main__': unittest.main()
