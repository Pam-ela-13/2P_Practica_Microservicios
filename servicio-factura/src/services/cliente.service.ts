import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import 'dotenv/config';

@Injectable()
export class ClienteService {
  private readonly url = process.env.URL_CLIENTES;

  async verificarCliente(codigo: number): Promise<void> {
    if (!Number.isInteger(codigo) || codigo <= 0 || codigo > 2147483647) {
      throw new BadRequestException('Código de cliente inválido');
    }

    if (!this.url) {
      throw new ServiceUnavailableException('Falta configurar URL_CLIENTES');
    }

    let respuesta: Response;
    try {
      respuesta = await fetch(`${this.url.replace(/\/$/, '')}/${codigo}`, {
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      throw new ServiceUnavailableException('Servicio de clientes no disponible');
    }

    if (respuesta.status === 404) {
      throw new NotFoundException(`El cliente con código ${codigo} no existe`);
    }

    if (!respuesta.ok) {
      throw new ServiceUnavailableException('No se pudo verificar el cliente');
    }
  }
}
