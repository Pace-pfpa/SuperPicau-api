import { CobrancaExtractor } from "./classes/CobrancaExtractor";
import { CobrancaController } from "./CobrancaController";
import { AutenticacaoService } from "../Autenticacao/AutenticacaoService";
import { TarefaService } from "../GetTarefa/TarefaService";
import { EtiquetaService } from "../UpdateEtiqueta/EtiquetaService";
import { ArvoreDocumentoService } from "../GetArvoreDocumento/ArvoreDocumentoService";
import { CapaService } from "../GetCapaDoPassiva/CapaService";
import { SislabraService } from "../Sislabra/SislabraService";
import { CobrancaImpedimentos } from "./CobrancaImpedimentos";
import MinutaCobranca from "./classes/MinutaCobranca";
import ImpeditivosHtmlCobranca from "./classes/ImpeditivosHtmlCobranca";

const autenticacaoService = new AutenticacaoService();
const etiquetaService = new EtiquetaService();
const sislabraService = new SislabraService(etiquetaService);
const capaService = new CapaService(etiquetaService);
const arvoreDocumentoService = new ArvoreDocumentoService(etiquetaService);
const tarefaService = new TarefaService(etiquetaService);


const cobrancaImpedimentos = new CobrancaImpedimentos();
const cobrancaExtractor = new CobrancaExtractor(
    autenticacaoService, tarefaService, arvoreDocumentoService, capaService, sislabraService
);
export const cobrancaController = new CobrancaController(cobrancaExtractor, cobrancaImpedimentos);

// MINUTA
export const minutaCobranca = new MinutaCobranca()
export const impeditivosHtmlCobranca = new ImpeditivosHtmlCobranca()