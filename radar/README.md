# Radar · Imóveis e Turismo

Versão estática do serviço local. Imóveis são uma fotografia da exportação; o serviço Python local continua responsável por suas coletas e agrupamentos. Fotos usam os links públicos dos anunciantes.

Turismo consulta fontes públicas a cada seis horas em novembro, apenas até 30/11/2026. Guarda estado, falhas, trechos e histórico em turismo/data.json. Resumos e notas possuem data de revisão própria. O botão Recarregar apenas lê a última consulta publicada. A rotina não realiza cadastros ou reservas.

Financiamento consulta a API Olinda do Banco Central diariamente às 12h UTC (9h em Brasília, sujeito à fila do GitHub). A fonte é mensal; consulta e período de referência são exibidos separadamente. Compara sete instituições na modalidade pessoa física, taxas de mercado pós-fixadas em TR (903201). A TR é adicional; os valores não são CET nem propostas. Ordena por taxa anual e mantém ausentes ao final, sem substituir por taxas de outro mês. Falhas preservam a última leitura e exibem aviso. A seleção não é um ranking de porte. Arquivos em financiamento/.

O workflow publica o repositório completo, preservando o site PAC na raiz. Usa GitHub Pages via Actions. Nenhuma dependência externa de Python.
