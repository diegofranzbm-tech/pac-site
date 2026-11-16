import copy
import json
import unittest
from pathlib import Path
from monitor import SOURCES, parse_vtex, parse_shopify, merge, weekly_points

FIXTURES=Path(__file__).parent/'fixtures'

class ProductTests(unittest.TestCase):
    def vtex(self):return json.loads((FIXTURES/'vtex.json').read_text())
    def shopify(self):return json.loads((FIXTURES/'shopify.json').read_text())

    def test_exact_queen_variant_not_cheapest_single(self):
        rows=parse_shopify(self.shopify(),SOURCES[1])
        self.assertEqual(len(rows),1);self.assertEqual(rows[0]['price'],2426)
        self.assertIn('158X198',rows[0]['variant']);self.assertIn('variant=',rows[0]['url'])

    def test_excludes_box_accessory_and_wrong_dimensions(self):
        original=self.vtex()
        for title in ('Kit Box Queen + Colchão','Colchão com Base Box Queen','Protetor de Colchão Queen'):
            data=copy.deepcopy(original);data[0]['productName']=title
            self.assertEqual(parse_vtex(data,SOURCES[0]),[])
        data=copy.deepcopy(original);data[0]['Largura']=['138 cm']
        self.assertEqual(parse_vtex(data,SOURCES[0]),[])
        data=copy.deepcopy(original);data[0]['items'][0]['Largura']=['138 cm']
        self.assertEqual(parse_vtex(data,SOURCES[0]),[])
        data=copy.deepcopy(original);data[0]['Largura']=['138 cm','158 cm']
        self.assertEqual(parse_vtex(data,SOURCES[0]),[])

    def test_pix_not_confused_with_catalog_price(self):
        row=parse_vtex(self.vtex(),SOURCES[0])[0]
        self.assertEqual(row['price'],1371);self.assertEqual(row['pix_price'],1165.35)

    def test_failure_does_not_create_observation_or_disappear(self):
        rows=parse_vtex(self.vtex(),SOURCES[0]);now='2026-11-16T13:00:00+00:00'
        first=merge({},[(rows,None),([], 'offline')],now)
        result=merge(first,[([], 'bloqueio'),([], 'offline')],'2026-11-17T13:00:00+00:00')
        product=result['products'][0]
        self.assertEqual(len(product['observations']),1);self.assertEqual(product['price'],1371)
        self.assertEqual(product['status'],'error');self.assertEqual(product['last_success'],now)

    def test_no_backfill_daily_upsert_and_weekly_latest(self):
        rows=parse_vtex(self.vtex(),SOURCES[0]);results=[(rows,None),([], 'offline')]
        first=merge({},results,'2026-11-16T13:00:00+00:00')
        same=merge(first,results,'2026-11-16T14:00:00+00:00')
        self.assertEqual(len(same['products'][0]['observations']),1)
        rows[0]['price']=1400
        second=merge(same,results,'2026-11-18T13:00:00+00:00')
        rows[0]['price']=1300
        third=merge(second,results,'2026-11-30T13:00:00+00:00')
        observations=third['products'][0]['observations'];weeks=weekly_points(observations)
        self.assertEqual([o['date'] for o in observations],['2026-11-16','2026-11-18','2026-11-30'])
        self.assertEqual([o['week'] for o in weeks],['2026-11-16','2026-11-30'])
        self.assertEqual([o['price'] for o in weeks],[1400,1300])

    def test_unavailable_is_recorded_as_gap_not_zero(self):
        data=self.vtex();data[0]['items'][0]['sellers'][0]['commertialOffer']['AvailableQuantity']=0
        rows=parse_vtex(data,SOURCES[0]);self.assertIsNone(rows[0]['price'])
        result=merge({},[(rows,None),([], 'offline')],'2026-11-16T13:00:00+00:00')
        observation=result['products'][0]['observations'][0]
        self.assertFalse(observation['available']);self.assertIsNone(observation['price'])

    def test_separate_sellers_have_separate_history(self):
        data=self.vtex();seller=copy.deepcopy(data[0]['items'][0]['sellers'][0]);seller['sellerId']='2'
        data[0]['items'][0]['sellers'].append(seller)
        rows=parse_vtex(data,SOURCES[0]);self.assertEqual(len({r['id'] for r in rows}),2)

if __name__=='__main__':unittest.main()
