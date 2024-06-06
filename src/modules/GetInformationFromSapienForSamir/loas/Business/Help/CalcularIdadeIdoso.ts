export function calcularIdadeIdoso(dataNasc: string, dataReq: string): number {
    
    function stringParaData(dataString: string): Date | null {

        if (typeof dataString !== 'string') {
            console.error('A entrada não é uma string')
            return null
        }

        const partes = dataString.split('/')
        if (partes.length !== 3) {
            console.error('Formato de data inválido.')
            return null
        }

        const [dia, mes, ano] = partes.map(Number)

        if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
            console.error('A data contém valores inválidos.');
            return null;
        }

        return new Date(ano, mes - 1, dia);
    }
  
    const nascimento = stringParaData(dataNasc);
    const requerimento = stringParaData(dataReq);

    if (nascimento === null || requerimento === null) {
        console.error('Erro ao converter as datas.')
        return -1
    }

    let idade = requerimento.getFullYear() - nascimento.getFullYear();
    const mesNascimento = nascimento.getMonth();
    const diaNascimento = nascimento.getDate();
  
    const mesRequerimento = requerimento.getMonth();
    const diaRequerimento = requerimento.getDate();
  
    if (mesRequerimento < mesNascimento || (mesRequerimento === mesNascimento && diaRequerimento < diaNascimento)) {
        idade--;
    }

    return idade;
}