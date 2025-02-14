import { Veiculo } from "../../dto";

export function deveDesconsiderarVeiculos(veiculos: Veiculo[]): boolean {
    if (veiculos.length > 2) return false;
    return veiculos.every(v => v.tipo === "MOTOCICLETA");
}