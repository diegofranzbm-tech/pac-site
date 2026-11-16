# PAC · Planejamento de cursos

Site estático para acompanhamento dos calendários dos cursos e consulta da escala mensal de serviço do CEBM.

## Arquivos

- `Calendarios de Ensino.html`: página principal e visualização da escala de novembro de 2026.
- `cfo2025-data.js`, `choe-data.js`, `cfp2026-data.js`: dados usados pelos calendários de cursos.
- `matrix-rain.png`: imagem de fundo Matrix, de Jamie Zawinski, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:The.Matrix.glmatrix.2.png), usada com atribuição.

Mantenha os arquivos do site na mesma pasta ao abrir localmente ou publicar. A página pode ser servida por qualquer hospedagem estática.

## Cursos FUNCIONAL · atualização de 16/11/2026

Os sete links da seção Cursos FUNCIONAL foram conferidos na pasta de favoritos FUNCIONAL do Chrome. A lista inclui CFS 2026 e os novos links de SEMET Oficial e SEMET SGT.

`cursos-funcional-data.js` contém as programações e os dados de VISOR lidos das exportações originais: CFO 2025 (quatro semestres), CFS 2026 (dois pelotões), CHOE, CFP 2026 (quatro pelotões), Oficial Temporário e SGT Temporário. Células mescladas são respeitadas por turma; abas duplicadas, contadores e visões derivadas não são somados ao calendário. O arquivo `cursos-atualizacao-resumo.json` registra a cobertura da atualização.

CFO 2026 retornou HTTP 401 ao exportar: seu link foi preservado e a interface informa leitura restrita. Não foram publicados dados locais antigos como se fossem uma leitura atual da planilha. É necessária uma exportação atualizada ou acesso de leitura para concluir esse calendário.

A interface usa os dados publicados por padrão. CSVs previamente importados continuam no navegador e podem ser selecionados com “Usar CSV importado neste navegador”. Novas importações ativam essa opção automaticamente. As métricas por data continuam sendo estimativas de programação, sem confirmação de presença ou realização da aula.
