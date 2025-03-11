import { AutenticacaoService } from "../../Autenticacao/AutenticacaoService";
import { ArvoreDocumentoService } from "../../GetArvoreDocumento/ArvoreDocumentoService";
import { CapaService } from "../../GetCapaDoPassiva/CapaService";
import { IInfoUploadDTO } from "../../GetInformationFromSapiensForPicaPau/dto";
import { TarefaService } from "../../GetTarefa/TarefaService";
import { SislabraService } from "../../Sislabra/SislabraService";
import { ICobrancaDTO } from "../interfaces/ICobrancaDTO";
import { ICobrancaExtracted } from "../interfaces/ICobrancaExtracted";
import { buscarInfoForMinuta } from "./../../GetInformationFromSapiensForPicaPau/BuscarImpedimentos/utils/buscarInfoForMinuta";

/**
 * Classe responsável por orquestrar a extração de informações do SAPIENS.
 * 
 * Esta classe utiliza serviços para: autenticação do usuário, busca de tarefas e busca de documentos (capa e sislabra).
 * Cada serviço atualiza a etiqueta e retorna os erros tratados, cabendo a classe retornar um objeto indicando o sucesso ou falha da operação.
 * 
 * @example
 * ```typescript
 * const extractor = new CobrancaExtractor(
 *   autenticacaoService,
 *   tarefaService,
 *   documentoService,
 *   capaService,
 *   sislabraService
 * );
 * 
 * const data: ICobrancaDTO = {
 *   login: { usuario: "user", senha: "pass" },
 *   tarefa: { id: "123", pasta: { NUP: "456", chaveAcesso: "789" } },
 *   etiqueta: "COBRANCA"
 * };
 *
 * try {
 *      const result = await extractor.execute(data);
 *      if (result.success) {
 *          console.log("Dados extraídos:", result.data);
 *      } else {
 *          console.log("Erro tratado:", result.error);
 *      }
 * }
 * catch (error) {
 *      console.error("Erro não tratado:", error.message);
 * }
 *  
 * ```
 */
export class CobrancaExtractor {
    constructor(
        private readonly autenticacaoService: AutenticacaoService,
        private readonly tarefaService: TarefaService,
        private readonly arvoreDocumentoService: ArvoreDocumentoService,
        private readonly capaService: CapaService,
        private readonly sislabraService: SislabraService
    ) {}

    /**
     * Método principal que sintetiza todo o processamento utilizando as dependências injetas via construtor.
     * 
     * - Chama os serviços necessários para extração, autenticação e tarefas.
     * 
     * @param data Objeto do tipo `ICobrancaDTO` com informações vindas Frontend.
     * @returns Uma resposta JSON com os dados (ou com um erro tratado) ou um erro não tratado, se ocorrer.
     * 
     */
    async execute(
        data: ICobrancaDTO
    ): Promise<{ 
        success: boolean; 
        data?: ICobrancaExtracted;
        error?: string 
    }> {
        try {
            const tarefaId = data.tarefa.id;

            const { cookie, usuario } = await this.autenticacaoService.autenticar(
                data.login
            );

            const tarefas = await this.tarefaService.buscarTarefa(
                cookie, 
                usuario.id, 
                data.etiqueta,
                tarefaId
            );

            if (!tarefas[0].pasta.processoJudicial) {
                throw new Error("TAREFA NÃO POSSUI PROCESSO JUDICIAL");
            }

            const documentos = await this.arvoreDocumentoService.buscarArvoreDocumentos(
                cookie,
                data.tarefa.pasta.NUP,
                data.tarefa.pasta.chaveAcesso,
                data.tarefa.id
            );

            const capaFormatada = await this.capaService.buscarCapa(
                data.tarefa.pasta.NUP, 
                cookie, data.tarefa.id
            );

            const sislabraCobrado = await this.sislabraService.buscarSislabraCobrado(
                documentos, 
                cookie, 
                data.tarefa.id
            );

            const informacoesRequerenteRequerido = await buscarInfoForMinuta(capaFormatada);

            const infoUpload: IInfoUploadDTO = {
                usuario,
                etiqueta: data.etiqueta,
                numeroProcesso: tarefas[0].pasta.processoJudicial.numero,
                nup: data.tarefa.pasta.NUP,
                tarefa_id: tarefas[0].id,
                pasta_id: tarefas[0].pasta.id,
                usuario_setor: tarefas[0].setorResponsavel_id,
                interessados: tarefas[0].pasta.interessados,
                infoMinuta: informacoesRequerenteRequerido,
                subirMinuta: data.subirMinuta
            }
            
            return {
                success: true,
                data: {
                    cookie,
                    tarefaId,
                    infoUpload,
                    capa: capaFormatada,
                    sislabra: sislabraCobrado
                }
            };
        } catch (error) {
            console.error('Erro no extrator do Cobrança: ', error.message);
            
            if (error.message.includes("TAREFA NÃO ENCONTRADA") ||
                error.message.includes("ERRO AO BUSCAR DOCUMENTOS") ||
                error.message.includes("CAPA NÃO ENCONTRADA") ||
                error.message.includes("SISLABRA NÃO EXISTE")) {
                return { success: false, error: error.message };
            }

            throw error;
        }
    }
}
