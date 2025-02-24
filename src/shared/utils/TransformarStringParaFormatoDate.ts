export function converterDatasParaDate(texto: any): Date[] {
  const regex = /\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\/\d{4}/g;
  const matches = texto.match(regex);

  if (!matches) {
    return [];
  }

  const datas = matches.map((match) => {
    const partes = match.split('/').map((parte) => parseInt(parte));

    if (partes.length === 3) {
      // Caso seja "dia/mês/ano"
      return new Date(partes[2], partes[1] - 1, partes[0]);
    } else if (partes.length === 2) {
      return new Date(partes[1], partes[0] - 1, 30);
    }

  });

  return datas;
}
  