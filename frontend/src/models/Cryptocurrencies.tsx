import { historialPrecios } from "./Historial_precios";

export class cryptocurrencies {
    public idCripto: number;
    public name: string;
    public symbol: string;
    public slug: string;
    public isActive: boolean;
    public historial?: historialPrecios; // 👈 Historial relacionado
    


    constructor(idCripto: number, name: string,
        symbol: string, slug: string,
        isActive: boolean,
    historial?: historialPrecios) {
        this.idCripto = idCripto;
        this.name = name;
        this.symbol = symbol;
        this.slug = slug;
        this.isActive = isActive;
        this.historial = historial;

    }
}