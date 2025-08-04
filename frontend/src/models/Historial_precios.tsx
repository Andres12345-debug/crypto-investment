export class cryptocurrencies {
    public id: number;
    public criptoId: string;
    public priceUsd: string;
    public volume24h: string;
    public percentChange24h: boolean;
    public timestamp: Date;

    constructor(id: number, criptoId: string, priceUsd: string,
        volume24h: string, percentChange24h: boolean, timestamp: Date) {
        this.id = id;
        this.criptoId = criptoId;
        this.priceUsd = priceUsd;
        this.volume24h = volume24h;
        this.percentChange24h = percentChange24h;
        this.timestamp = timestamp;
    }
}