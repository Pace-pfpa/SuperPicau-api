export function compararPrioridade(prioridade1: string, prioridade2: string) {
    const ordemDePrecedencia = {
      'ELEVADA': 1,
      'ALTA': 2,
      'MEDIA': 3,
      'BAIXA': 4
    };
  
    if (prioridade1 === prioridade2) {
      return prioridade1;
    }
  
    return ordemDePrecedencia[prioridade1] < ordemDePrecedencia[prioridade2] ? prioridade1 : prioridade2;
  }