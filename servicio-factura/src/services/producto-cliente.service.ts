import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import 'dotenv/config';
import { Producto } from '../models/producto.model.js';

@Injectable()
export class ProductoClienteService {
  private readonly url = process.env.PRODUCT_SERVICE_URL;

  async consultar(codigo: number): Promise<Producto> {
    if (!this.url) {
      throw new ServiceUnavailableException('Falta configurar PRODUCT_SERVICE_URL');
    }

    let respuesta: Response;
    try {
      respuesta = await fetch(`${this.url.replace(/\/$/, '')}/${codigo}`, {
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      throw new ServiceUnavailableException('Servicio de productos no disponible');
    }

    if (respuesta.status === 404 || respuesta.status === 400) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (!respuesta.ok) {
      throw new ServiceUnavailableException('Error al consultar el microservicio de productos');
    }

    return (await respuesta.json()) as Producto;
  }
}
