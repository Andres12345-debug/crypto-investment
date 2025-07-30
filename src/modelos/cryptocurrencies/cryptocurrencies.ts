import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { HistorialPrecios } from "../historial_precios/historial_precios";

@Entity()
export class Cryptocurrencies {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    public idCripto: number;
    @Column({ type: 'varchar', length: 100, nullable: false, name: 'name' })
    public name: string;
    @Column({ type: 'varchar', length: 100, nullable: false, name: 'symbol' })
    public symbol: string;
    @Column({ type: 'varchar', length: 100, nullable: false, name: 'slug' })
    public slug: string;
    @Column({ type: 'boolean', nullable: false, name: 'is_active' })
    public isActive: boolean;

    // Relación con HistorialPrecios
    @OneToOne(() => HistorialPrecios, (objHistorial) => objHistorial.cripto, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: "cod_historial" })
    public historial: HistorialPrecios;
}
