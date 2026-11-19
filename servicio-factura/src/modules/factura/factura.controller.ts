import { Controller, Delete, Param, Patch, Post, Body, Get } from '@nestjs/common';
import { FacturaService } from './factura.service.js';
import { DetalleFactura } from '../../models/detalle-factura.model.js';

@Controller('factura')
export class FacturaController {
    constructor(private readonly facturaService: FacturaService) { }

    @Get()
    listar() {
        return this.facturaService.listar();
    }
    @Get(':codigo')
    consultar(@Param('codigo') codigo: string,) {
        return this.facturaService.consultar(codigo);
    }

    @Post()
    crear(@Body() data: any) {
        return this.facturaService.crear(data);
    }

    @Patch(':codigo')
    actualizar(@Param('codigo') codigo: string, @Body() data: Partial<any>) {
        return this.facturaService.actualizar(codigo, data);
    }

    @Delete(':codigo')
    eliminar(@Param('codigo') codigo: string) {
        return this.facturaService.eliminar(codigo);
    }

    @Post(':codigo/detalles')
    agregarDetalle(@Param('codigo') codigo: string, @Body() data: any) {
        return this.facturaService.agregarDetalle(codigo, data);
    }

    @Delete(':codigo/detalles/:codigoDetalle')
    eliminarDetalle(@Param('codigo') codigo: string, @Param('codigoDetalle') codigoDetalle: number) {
        return this.facturaService.eliminarDetalle(codigo, Number(codigoDetalle));
    }
    @Patch(':codigo/detalles/:codigoDetalle')
    actualizarDetalle(
        @Param('codigo') codigo: string,
        @Param('codigoDetalle') codigoDetalle: string,
        @Body() data: Partial<DetalleFactura>
    ) {
        return this.facturaService.actualizarDetalleFactura(
            codigo,
            Number(codigoDetalle),
            data
        );
    }

}
