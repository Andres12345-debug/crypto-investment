export class cryptocurrencies {
    public idCripto: number;
    public name: string;
    public symbol: string;
    public slug: string;
    public isActive: boolean;

    constructor(idCripto: number, name: string,
        symbol: string, slug: string,
        isActive: boolean) {
        this.idCripto = idCripto;
        this.name = name;
        this.symbol = symbol;
        this.slug = slug;
        this.isActive = isActive;
    }
}