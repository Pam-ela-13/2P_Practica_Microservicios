import {Cliente} from '../models/cliente.model';

export const obtenerClientes = async() => {
    return Cliente.findAll();
}
export const obtenerClienteId = async (id: number) =>{
    const cliente = await Cliente.findByPk(id);
    if(!cliente){
        throw Error('Cliente no encontrado');
    }
    return cliente;
}
//ORM SIQUALIZE PARA NO PONER SENTENCIAS SQL
//FUNCION FLECHA 
export const crearCliente = async (data: any) => {
    if (data!)
        throw Error('Datos incorrectos');
    return await Cliente.create(data);
}
//
export const actualizarCliente = async (id: number, data: any) => {
    const cliente = await Cliente.findByPk(id);
    if(!cliente){
        throw Error('Cliente no encontrado');
    }
    await cliente.update(data);
    return cliente
}
//
export const eliminarCliente = async (id: number) => {
    const cliente = await Cliente.findByPk(id);
    if(!cliente){
        throw Error('Cliente no encontrado');
    }
    await cliente.destroy();
    return {mensaje: 'Cliente eliminado correctamente'};
}

//validación que los datos existan codigo modular 

export const validarDatos = (data: any) => {
    if (!data || Object.keys(data).length === 0) {
        throw Error('Datos incorrectos');
    }
};

//validar que el telefono tenga 10 digitos
export const validarTelefono = (telefono: string) => {
    if (!/^\d{10}$/.test(telefono)) {
        throw Error('El teléfono debe tener 10 dígitos');
    }
}; 