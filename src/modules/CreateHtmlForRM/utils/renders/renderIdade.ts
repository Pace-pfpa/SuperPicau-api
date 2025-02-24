import { IIdadeDTO } from "../../../GetInformationFromSapiensForPicaPau/DossieSuperSapiens/SuperDossieBusiness/CalcularIdade/dtos/IIdadeDTO";


export const renderIdade = (idade: boolean, idadeInfo: IIdadeDTO): string => {
    if (!idade) return "";

    return `
    <p class="impeditivos-field">
      <strong><span>IDADE MÍNIMA:</span></strong>
      <span> A parte autora não implementou o requisito etário exigido para o benefício pleiteado, na DER. Do mesmo modo, não completou a idade mínima durante a tramitação do processo administrativo, o que ensejaria a reafirmação da DER.</span>
      <br>
      <span>DATA DE AJUIZAMENTO: ${idadeInfo.dataAjuizamento}</span>
      <br>
      <span>DATA DE NASCIMENTO AUTOR: ${idadeInfo.dataNascimento} - (${idadeInfo.idade} anos)</span>
    </p>
  `;
}