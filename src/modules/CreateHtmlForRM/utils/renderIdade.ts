import { IIdadeDTO } from "../../GetInformationFromSapiensForPicaPau/DossieSuperSapiens/SuperDossieBusiness/CalcularIdade/dtos/IIdadeDTO";

export const renderIdade = (idade: boolean, idadeInfo: IIdadeDTO): string => {
    if (!idade) return "";

    return `
    <p class="impeditivos-field">
      <strong><span>IDADE:</span></strong>
      <span>A parte autora não possui idade suficiente para se beneficiar da aposentadoria por idade híbrida (${idadeInfo.idade} anos).</span>
      <br>
      <span>DATA DE NASCIMENTO: ${idadeInfo.dataNascimento}</span>
      <br>
      <span>DATA DE AJUIZAMENTO: ${idadeInfo.dataAjuizamento}</span>
    </p>
  `;
}