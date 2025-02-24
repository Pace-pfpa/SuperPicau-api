export const renderRequerimento = (requerimento: boolean): string => {
    if (!requerimento) return "";
  
    return `
      <p class="impeditivos-field">
        <strong>
          <span>AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO / INDEFERIMENTO FORÇADO / REQUERIMENTO PENDENTE DE ANÁLISE ADMINISTRATIVA:</span>
        </strong>
        <span>
          Foi identificada que a) a parte autora não fez o requerimento administrativo (tema 350 STF); b) não apresentou documentos mínimos para análise do INSS (
          <a href="https://redir.stf.jus.br/paginadorpub/paginador.jsp?docTP=TP&amp;docID=7168938" target="_blank">RE 631.240/MG</a>); 
          c) o requerimento está pendente de análise e dentro do prazo estabelecido pelo STF (
          <a href="https://portal.stf.jus.br/processos/downloadPeca.asp?id=15345218477&amp;ext=.pdf" target="_blank">Tema 1.066/STF</a>).
          PREQUESTIONAMENTO: Constituição Federal, artigos 2º e 5º, XXXV, LIV e LV. Código de Processo Civil, artigos 332, 927 e 932.
        </span>
      </p>
    `;
};