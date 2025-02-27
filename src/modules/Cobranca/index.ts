import { CobrancaController } from "./CobrancaController";
import { CobrancaExtractor } from "./CobrancaExtractor";

export const cobrancaExtractor = new CobrancaExtractor();
export const cobrancaController = new CobrancaController(cobrancaExtractor);