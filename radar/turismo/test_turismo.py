import unittest
from monitor import observe

class MonitorTests(unittest.TestCase):
    def test_change_and_failure_preserve_evidence(self):
        source = {'url':'https://example.com', 'identity':'resort'}
        observe(source, 'first', lambda _: '<p>Resort Black Friday 2026 até 30% OFF '+ 'condições válidas '*20+'</p>')
        self.assertEqual(source['status'], 'acessível')
        observe(source, 'second', lambda _: '<p>Resort Black Friday 2026 até 50% OFF '+ 'condições válidas '*20+'</p>')
        self.assertEqual(source['status'], 'alteração detectada')
        evidence = source['evidence'][:]
        observe(source, 'third', lambda _: 'access denied')
        self.assertEqual(source['status'], 'falha de consulta')
        self.assertEqual(source['last_success'], 'second')
        self.assertEqual(source['evidence'], evidence)
        self.assertEqual(len(source['history']), 1)

    def test_script_does_not_create_offer(self):
        source = {'url':'https://example.com', 'identity':'resort'}
        observe(source, 'first', lambda _: '<script>Black Friday 2026 90% OFF</script><p>Resort '+ 'informações públicas '*20+'</p>')
        self.assertEqual(source['evidence'], [])

if __name__ == '__main__': unittest.main()
