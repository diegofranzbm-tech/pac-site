# Radar · Imóveis e Turismo

Versão estática do serviço local. Imóveis são uma fotografia da exportação; o serviço Python local continua responsável por suas coletas e agrupamentos. Fotos usam os links públicos dos anunciantes.

Turismo consulta fontes públicas a cada seis horas em novembro, apenas até 30/11/2026. Guarda estado, falhas, trechos e histórico em turismo/data.json. Resumos e notas possuem data de revisão própria. O botão Recarregar apenas lê a última consulta publicada. A rotina não realiza cadastros ou reservas.

O workflow publica o repositório completo, preservando o site PAC na raiz. Usa GitHub Pages via Actions. Nenhuma dependência externa de Python.
