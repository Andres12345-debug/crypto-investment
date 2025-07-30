import { Controller, Get } from '@nestjs/common';
import { CoinmarketcapService } from './coinmarketcap.service';

@Controller('coinmarketcap')
export class CoinmarketcapController {
  constructor(private readonly coinService: CoinmarketcapService) {}

  @Get('update')
  actualizarDatos() {
    return this.coinService.fetchAndSaveCryptoData();
  }

}
