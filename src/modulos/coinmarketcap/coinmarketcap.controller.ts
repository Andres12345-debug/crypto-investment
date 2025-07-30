import { Controller, Get, Param } from '@nestjs/common';
import { CoinmarketcapService } from './coinmarketcap.service';

@Controller('coinmarketcap')
export class CoinmarketcapController {
  constructor(private readonly coinService: CoinmarketcapService) {}

  @Get('update')
  actualizarDatos() {
    return this.coinService.fetchAndSaveCryptoData();
  }

  //Servicio de historial
  @Get('historial/:symbol')
  async obtenerHistorial(@Param('symbol') symbol: string) {
    return this.coinService.obtenerHistorialPorSimbolo(symbol);
  }

  //Listar todas las criptomonedas
  @Get('lista')
  listarCriptos() {
    return this.coinService.cryptoRepo.find(); // usa el repo directamente
  }

}
