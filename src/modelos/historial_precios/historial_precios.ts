import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cryptocurrencies } from "../cryptocurrencies/cryptocurrencies";

@Entity()
export class HistorialPrecios {
    @PrimaryGeneratedColumn({type: 'integer',  name: 'id'})
        public id: number;        
        @Column({type: 'integer', nullable: false, name: 'cripto_id'})
        public criptoId: number;
        @Column({type: 'decimal', precision: 18, scale: 8, nullable: false, name: 'price_usd'})
        public priceUsd: number;
        @Column({type: 'decimal', precision: 18, scale: 8, nullable: false, name: 'volume_24h'})
        public volume24h: number;
        @Column({type: 'decimal', precision: 6, scale: 2, nullable: false, name: 'percent_change_24h'})
        public percentChange24h: number;
        @Column({type: 'timestamp', nullable: false, name: 'timestamp'})
        public timestamp: Date;

                
        // Relación con Cryptocurrencies
        @OneToOne(() => Cryptocurrencies, (objCryptomonedas) => objCryptomonedas.historial)
        public cripto?: Cryptocurrencies;
}
