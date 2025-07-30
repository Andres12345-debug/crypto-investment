import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinmarketcapService } from './coinmarketcap.service';
import { CoinmarketcapController } from './coinmarketcap.controller';
import { Cryptocurrencies } from 'src/modelos/cryptocurrencies/cryptocurrencies';
import { HistorialPrecios } from 'src/modelos/historial_precios/historial_precios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cryptocurrencies, HistorialPrecios])
  ],
  controllers: [CoinmarketcapController],
  providers: [CoinmarketcapService],
})
export class CoinmarketcapModule {}
