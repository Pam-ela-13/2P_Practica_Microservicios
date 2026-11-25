import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { db } from '../../prisma/db.js';
import { Factura } from '../../models/factura.model.js';
import { DetalleFactura } from '../../models/detalle-factura.model.js';


import { ProductoClienteService } from '../../services/producto-cliente.service.js';
import { ClienteService } from '../../services/cliente.service.js';

@Injectable()
export class FacturaService {
    constructor(
        private readonly productoCliente: ProductoClienteService,
        private readonly clienteService: ClienteService,
    ) { }

    //esto es solo de factura
    async crear(data: Factura) {
        const factura = await db.orm.Factura.where({ codigo: data.codigo }).first();
        if (factura) {
            throw new ConflictException('Código ya existente');
        }
        await this.clienteService.verificarCliente(data.cod_cliente);
        return db.orm.Factura.create({ ...data, fecha: new Date(data.fecha) });
    }

    async listar() {
        return db.orm.Factura.all();
    }

    async consultar(codigo: string) {
        const factura = await db.orm.Factura.where({ codigo: codigo }).first();
        if (!factura) {
            throw new NotFoundException('Factura no encontrada');
        }
        return factura;

    }
    //actualizar solo debe actualizar ciertas cosas, solo patch, solo se puede esditar  
    // No se puede actualizar el código de la factura
    //es patch por el partial
    async actualizar(codigo: string, data: Partial<Factura>) {
        const cambios: Record<string, unknown> = { ...data };
        if (data.fecha) {
            cambios.fecha = new Date(data.fecha);
        }
        const factura = await db.orm.Factura.where({ codigo: codigo }).update(cambios);
        if (!factura) {
            throw new NotFoundException('Factura no encontrada');
        }
        return factura;

    }

    //eliminar
    async eliminar(codigo: string) {
        await this.consultar(codigo);
        await db.orm.Factura.where({ codigo }).delete();
        return { mensaje: `Factura eliminada correctamente` };
    }



    //debo tener en cuenta que debo acceder a otro servicio para obtener el precio del producto, y calcular el subtotal, y luego actualizar el total de la factura
    //detalle de factura, debe ingresar el cod_factura, cod_producto, cantidad 
    async agregarDetalle(codigo: string, detalle: Omit<DetalleFactura, 'codigo' | 'subtotal'>) {
        const factura = await this.consultar(codigo);
        const producto = await this.productoCliente.consultar(detalle.cod_producto);

        const nuevoDetalle: DetalleFactura = {
            ...detalle,
            codigo: (factura.detalles_factura?.length ?? 0) + 1,
            subtotal: detalle.cantidad * producto.precio,
        };

        const detalles = [
            ...(factura.detalles_factura ?? []),
            nuevoDetalle,
        ];

        return db.orm.Factura.where({ codigo }).update({ detalles_factura: detalles });
    }

    //
    async actualizarDetalleFactura(codigo: string, codigoDetalle: number, data: Partial<DetalleFactura>) {
        const factura = await this.consultar(codigo);
        const detalle = factura.detalles_factura.find((d) => d.codigo === codigoDetalle);
        if (!detalle) {
            throw new NotFoundException('Detalle no encontrado');
        }

        const cambios = { ...detalle, ...data, codigo: codigoDetalle };
        cambios.subtotal = await this.calcularSubtotal(cambios.cod_producto, cambios.cantidad);

        return db.orm.Factura.where({ codigo }).update({
            detalles_factura: factura.detalles_factura.map((d) =>
                d.codigo === codigoDetalle ? cambios : d
            )
        });
    }

    //
    async eliminarDetalle(codigo: string, codigoDetalle: number) {
        const factura = await this.consultar(codigo);
        const detalles = (factura.detalles_factura ?? [])
            .filter(detalle => detalle.codigo !== codigoDetalle);

        if (detalles.length === (factura.detalles_factura ?? []).length) {
            throw new NotFoundException('Detalle de factura no encontrado');
        }

        return this.actualizarDetalles(factura, detalles);
    }

    // calcular subtotal automaticamente (precio x cantidad)
    public async calcularSubtotal(cod_producto: number, cantidad: number) {
        const producto = await this.productoCliente.consultar(cod_producto);
        return producto.precio * cantidad;
    }


    //
    private async actualizarDetalles(factura: Factura, detalles: DetalleFactura[]) {
        const total = detalles.reduce((acumulado, detalle) =>
            acumulado + detalle.subtotal, 0);
        const descuento = factura.descuento ?? 0;
        const iva = factura.iva ?? 0;

        return db.orm.Factura.where({ codigo: factura.codigo }).update({
            detalles_factura: detalles,
            total,
            total_a_pagar: total - descuento + iva,
        });
    }



}
