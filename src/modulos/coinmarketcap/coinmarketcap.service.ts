import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { HistorialPrecios } from 'src/modelos/historial_precios/historial_precios';
import { Cryptocurrencies } from 'src/modelos/cryptocurrencies/cryptocurrencies';

@Injectable()
export class CoinmarketcapService {
    constructor(
        @InjectRepository(Cryptocurrencies)
        private cryptoRepo: Repository<Cryptocurrencies>,
        @InjectRepository(HistorialPrecios)
        private historyRepo: Repository<HistorialPrecios>,
    ) { }


    async fetchAndSaveCryptoData(): Promise<string> {
        const { data } = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY },
        });

        for (const crypto of data.data) {
            let cryptoEntity = await this.cryptoRepo.findOne({ where: { symbol: crypto.symbol } });

            if (!cryptoEntity) {
                cryptoEntity = this.cryptoRepo.create({
                    symbol: crypto.symbol,
                    name: crypto.name,
                    slug: crypto.slug,
                    isActive: true,
                });
                await this.cryptoRepo.save(cryptoEntity);
            }

            const quote = crypto.quote.USD;
            const price = this.historyRepo.create({
                criptoId: cryptoEntity.idCripto,
                priceUsd: quote.price,
                volume24h: quote.volume_24h,
                percentChange24h: quote.percent_change_24h,
                timestamp: new Date(quote.last_updated),
            });


            await this.historyRepo.save(price);
        }

        return 'Datos actualizados correctamente.';
    }
}
