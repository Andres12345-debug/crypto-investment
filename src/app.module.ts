import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConexionModule } from './config/conexion/conexion.module';
import { ConfigModule } from '@nestjs/config';
import { Cryptocurrencies } from './modelos/cryptocurrencies/cryptocurrencies';
import { CoinmarketcapModule } from './modulos/coinmarketcap/coinmarketcap.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true,envFilePath:".env"}), ConexionModule, CoinmarketcapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
