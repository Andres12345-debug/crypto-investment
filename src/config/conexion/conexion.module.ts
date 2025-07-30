import { Global, Module } from '@nestjs/common';
import { Cryptocurrencies } from 'src/modelos/cryptocurrencies/cryptocurrencies';
import { HistorialPrecios } from 'src/modelos/historial_precios/historial_precios';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Global()
@Module({
    imports: [],
    providers: [
        {
            provide: DataSource,
            inject: [],
            useFactory: async () => {
                try {
                    const poolConexion = new DataSource({
                        type: 'mysql',
                        host: String(process.env.DB_HOST),
                        port: Number(process.env.PORT),
                        username: String(process.env.USER),
                        password: String(process.env.CLAVE),
                        database: String(process.env.BASE_DATOS),
                        synchronize: true,
                        logging: true,
                        namingStrategy: new SnakeNamingStrategy(),
                        entities: [Cryptocurrencies, HistorialPrecios], // Aquí debes agregar tus entidades
                    });

                    await poolConexion.initialize();
                    console.log("Conexión a la base de datos exitosa." + String(process.env.BASE_DATOS));

                    return poolConexion;
                } catch (miError) {
                    console.log("Falló al realizar la conexión");
                    throw miError;
                }
            },
        },
    ],
    exports: [DataSource],
})
export class
    ConexionModule { }
