const { JSDOM } = require('jsdom');
import { LoginDTO, loginUseCase } from "../LoginUsuario";
import { getUsuarioUseCase } from "../GetUsuario";
import { getTarefaUseCase } from "../GetTarefa";
import { GetPessoa_id } from "./RequisicaoAxiosTarefas/GetPessoa_id";
import { CreateTarefa } from "./RequisicaoAxiosTarefas/CreateTarefa";
import { GetInteressadosReq } from "./RequisicaoAxiosTarefas/GetInteressadosReq";
import { GetArvoreDocumentoDTO, 
         getArvoreDocumentoUseCase, 
         ResponseArvoreDeDocumentoDTO } from "../GetArvoreDocumento";
import { getDocumentoUseCase } from "../GetDocumento";
import { BuscarTabelaGrupoFamiliar } from "./Helps/BuscarTabelaGrupoFamiliar";
import { getCapaDoPassivaUseCase } from "../GetCapaDoPassiva";
import { getXPathText } from "../../shared/utils/GetTextoPorXPATH";
import { updateEtiquetaUseCase } from "../UpdateEtiqueta";
import { CorrigirCpfComZeros } from "./Helps/CorrigirCpfComZeros";
import { arrayInteressados } from "./Helps/ArrayInteressados";
import { buscarTableCpf, verificarCapaTrue } from "../GetCapaDoPassiva/utils";
import { IinteressadosDTO } from "./dtos/InteressadosDTO";
import { ITarefaResponse } from "../GetTarefa/dtos";
import { JSDOMType } from "../../shared/dtos/JSDOM";
import { GetEnvolvidoGhost } from "./RequisicaoAxiosTarefas/GetEnvolvidoGhost";
import { GetPessoaFisica } from "./RequisicaoAxiosTarefas/GetPessoaFisica";

export class CreateInterestedUseCase {

    async execute(data: IinteressadosDTO) {

        const resultado = this.initializeResultado();
        const cookie = await this.authenticate(data.login);
        const usuario_id = await this.getUsuarioId(cookie);

        const tarefas = await getTarefaUseCase.execute({ cookie, usuario_id, etiqueta: data.etiqueta });
        resultado.totalTarefas = tarefas.length;

        for (const tarefa of tarefas) {
            try {
                await this.processTarefa(tarefa, cookie, resultado);
            } catch (error) {
                console.error(`Erro ao processar tarefa ${tarefa.pasta.NUP}:`, error);
                resultado.erroAoCadastrarEnvolvidos.push(tarefa.pasta.NUP);
            }
        }

        return resultado;
    }

    initializeResultado() {
        return {
            totalTarefas: 0,
            envolvidosCadastrados: 0,
            cpfNaoConstaNaReceita: 0,
            erroAoCadastrarEnvolvidos: [] as string[],
        };
    }

    async authenticate(login: LoginDTO): Promise<string> {
        return await loginUseCase.execute(login);
    }

    async getUsuarioId(cookie: string): Promise<string> {
        const usuario = await getUsuarioUseCase.execute(cookie);
        return `${usuario[0].id}`;
    }

    async processTarefa(tarefa: ITarefaResponse, cookie: string, resultado: any): Promise<void> {
        const { tarefaId, arrayDeDocumentos } = await this.fetchTarefaData(tarefa, cookie);

        const dossieSocial = this.getDossieSocial(arrayDeDocumentos);
        if (!dossieSocial) throw new Error("Dossiê Social não encontrado.");

        const paginaDossieSocial = await this.getPaginaDossieSocial(dossieSocial, cookie);

        const capa = await this.verifyCapa(tarefa, cookie);
        const cpfCapa = buscarTableCpf(capa);

        if (!cpfCapa) {
            await this.updateEtiqueta(cookie, `CPF NÃO ENCONTRADO - (GERAR NOVO DOSSIE)`, tarefaId);
            resultado.cpfNaoConstaNaReceita++;
            return;
        }

        const interessados = await this.processInteressados(tarefa, paginaDossieSocial, cpfCapa, cookie);

        if (interessados.hasInvalidCpf) {
            await this.updateEtiqueta(cookie, `CPF ${interessados.invalidCpfs} NÃO CONSTA NA RECEITA`, tarefaId);
            resultado.cpfNaoConstaNaReceita += interessados.invalidCpfs.length;
        } else {
            await this.updateEtiqueta(cookie, `ENVOLVIDOS CADASTRADOS`, tarefaId);
            resultado.envolvidosCadastrados++;
        }
    }

    async fetchTarefaData(tarefa: ITarefaResponse, cookie: string): Promise<{
        tarefaId: number;
        arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[];
    }> {
        const tarefaId = tarefa.id;
        const objectGetArvoreDocumento: GetArvoreDocumentoDTO = { nup: tarefa.pasta.NUP, chave: tarefa.pasta.chaveAcesso, cookie, tarefa_id: tarefa.id };
        const arrayDeDocumentos = (await getArvoreDocumentoUseCase.execute(objectGetArvoreDocumento)).reverse();

        return { tarefaId, arrayDeDocumentos };
    }

    getDossieSocial(arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[]): ResponseArvoreDeDocumentoDTO {
        return arrayDeDocumentos.find(Documento => Documento.movimento.includes("CADUNICO"));
    }

    async getPaginaDossieSocial(dossieSocial: ResponseArvoreDeDocumentoDTO, cookie: string) {
        const idDossieSocialParaPesquisa = dossieSocial.documentoJuntado.componentesDigitais[0].id;
        const pagina = await getDocumentoUseCase.execute({ cookie, idDocument: idDossieSocialParaPesquisa });
        return new JSDOM(pagina);
    }

    async verifyCapa(tarefa: ITarefaResponse, cookie: string) {
        const capaContent = await getCapaDoPassivaUseCase.execute(tarefa.pasta.NUP, cookie);
        const capa = new JSDOM(capaContent);

        const isCapaValid = await verificarCapaTrue(capa);
        if (!isCapaValid) {
            const xpathNovaNup = "/html/body/div/div[4]/table/tbody/tr[13]/td[2]/a[1]/b";
            const novaNup = getXPathText(capa, xpathNovaNup).split('(')[0].replace(/[./-]/g, "").trim();
            const novaCapaContent = await getCapaDoPassivaUseCase.execute(novaNup, cookie);
            return new JSDOM(novaCapaContent);
        }

        return capa;
    }

    async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async processInteressados(tarefa: ITarefaResponse, paginaDossieSocial: JSDOMType, cpfCapa: string, cookie: string) {
        const buscarTabelaGrupoFamiliar = new BuscarTabelaGrupoFamiliar();
        const arrayCpfsInteressados = await buscarTabelaGrupoFamiliar.execute(paginaDossieSocial);

        const interessadosReq = await GetInteressadosReq(tarefa.pasta_id, cookie);
        const interessadosExistentes = arrayInteressados(interessadosReq);

        const invalidCpfs: string[] = [];
        for (const cpfInteressado of arrayCpfsInteressados) {
            const cpfCorrigido = CorrigirCpfComZeros(cpfInteressado.trim());

            if (cpfCorrigido === cpfCapa || interessadosExistentes.includes(cpfCorrigido)) continue;

            try {
                // ATIVAR O GHOST
                const envolvidoGhost = await GetEnvolvidoGhost(cpfCorrigido, cookie);
                console.log('--GHOST')
                console.log(envolvidoGhost);
                const pessoaFisica = await GetPessoaFisica(cpfCorrigido, cookie);
                console.log('---PESSOA FÍSICA')
                console.log(pessoaFisica)

                let pessoa_id: any = null;

                try {
                    pessoa_id = await GetPessoa_id(cpfCorrigido, cookie);
                } catch (error) {
                    console.warn(`Erro ao buscar pessoa_id para CPF ${cpfCorrigido}. Tentando novamente após 5 segundos...`);
                    await this.delay(5000);

                    try {
                        pessoa_id = await GetPessoa_id(cpfCorrigido, cookie);
                    } catch (secondError) {
                        console.error(`Erro persistente para CPF ${cpfCorrigido}:`, secondError);
                        throw secondError;
                    }
                }

                if (!pessoa_id) throw new Error("CPF NÃO CONSTA NA RECEITA");

                await CreateTarefa(tarefa.pasta_id, pessoa_id, cookie);
            } catch (error) {
                console.error(`Erro final para CPF ${cpfCorrigido}:`, error);
                invalidCpfs.push(cpfCorrigido);
            }
        }

        return { hasInvalidCpf: invalidCpfs.length > 0, invalidCpfs };
    }

    async updateEtiqueta(cookie: string, etiqueta: string, tarefaId: number) {
        return await updateEtiquetaUseCase.execute({ cookie, etiqueta, tarefaId });
    }

}
