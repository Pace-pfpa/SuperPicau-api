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

    async authenticate(login: LoginDTO) {
        return await loginUseCase.execute(login);
    }

    async getUsuarioId(cookie: string) {
        const usuario = await getUsuarioUseCase.execute(cookie);
        return `${usuario[0].id}`;
    }

    async processTarefa(tarefa: any, cookie: string, resultado: any) {
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

    async fetchTarefaData(tarefa: any, cookie: string) {
        const tarefaId = tarefa.id;
        const objectGetArvoreDocumento: GetArvoreDocumentoDTO = { nup: tarefa.pasta.NUP, chave: tarefa.pasta.chaveAcesso, cookie, tarefa_id: tarefa.id };
        const arrayDeDocumentos = (await getArvoreDocumentoUseCase.execute(objectGetArvoreDocumento)).reverse();

        return { tarefaId, arrayDeDocumentos };
    }

    getDossieSocial(arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[]) {
        return arrayDeDocumentos.find(Documento => Documento.movimento.includes("CADUNICO"));
    }

    async getPaginaDossieSocial(dossieSocial: ResponseArvoreDeDocumentoDTO, cookie: string) {
        const idDossieSocialParaPesquisa = dossieSocial.documentoJuntado.componentesDigitais[0].id;
        const pagina = await getDocumentoUseCase.execute({ cookie, idDocument: idDossieSocialParaPesquisa });
        return new JSDOM(pagina);
    }

    async verifyCapa(tarefa: any, cookie: string) {
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

    async processInteressados(tarefa: any, paginaDossieSocial: any, cpfCapa: string, cookie: string) {
        const buscarTabelaGrupoFamiliar = new BuscarTabelaGrupoFamiliar();
        const arrayCpfsInteressados = await buscarTabelaGrupoFamiliar.execute(paginaDossieSocial);

        const interessadosReq = await GetInteressadosReq(tarefa.pasta_id, cookie);
        const interessadosExistentes = arrayInteressados(interessadosReq);

        const invalidCpfs: string[] = [];
        for (const cpfInteressado of arrayCpfsInteressados) {
            const cpfCorrigido = CorrigirCpfComZeros(cpfInteressado.trim());

            if (cpfCorrigido === cpfCapa || interessadosExistentes.includes(cpfCorrigido)) continue;

            try {
                const pessoa_id = await GetPessoa_id(cpfCorrigido, cookie);
                if (!pessoa_id) throw new Error("CPF NÃO CONSTA NA RECEITA");

                await CreateTarefa(tarefa.pasta_id, pessoa_id, cookie);
            } catch (error) {
                console.error(error);
                invalidCpfs.push(cpfCorrigido);
            }
        }

        return { hasInvalidCpf: invalidCpfs.length > 0, invalidCpfs };
    }

    async updateEtiqueta(cookie: string, etiqueta: string, tarefaId: number) {
        return await updateEtiquetaUseCase.execute({ cookie, etiqueta, tarefaId });
    }

}
