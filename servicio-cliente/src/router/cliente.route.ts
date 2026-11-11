import type { FastifyInstance } from "fastify";
import {
    obtenerClienteId,
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    validarDatos,
    validarTelefono
} from '../controllers/cliente.controller';

export const valiDatos = (req: any, res: any, next: any) => {
    try {
        validarDatos(req.body);
        next();
    } catch (error) {
        console.log("Error en la validación de datos");
        res.code(400).send({"mensaje": "Error en la validación de datos"});
    }
};

export const valiTelefono = (req: any, res: any, next: any) => {
    try {
        validarTelefono(req.body.telefono);
        next();
    } catch (error) {
        console.log("Error en la validación del teléfono");
        res.code(400).send({"mensaje": "Error en la validación del teléfono"});
    }
};

export const clienteRouter = (app: FastifyInstance) => {
    app.get("/clientes", obtenerClientes);

    app.get("/cliente/:id", async (req, res) =>{
        try {
            const {id} = req.params as any;
            await obtenerClienteId(id);
        }catch (error) {
            console.log("Error al obtener todos los clientes");
            res.code(400).send({"mensaje": "Error al obtener los clientes"});
        }
    });

    app.post("/cliente", async (req, res) =>{
        try {
            const cliente = req.body;
            await crearCliente(cliente);
        }catch (error) {
            console.log("Error al crear cliente");
            res.code(400).send({"mensaje": "Error al crear el cliente"});
        }
    });
    app.put("/cliente/:id", async (req, res) =>{
        try {
            const {id} =req.params as any;
            const cliente = req.body;
            await actualizarCliente(id, cliente);
        }catch (error) {
            console.log("Error al actualizar cliente");
            res.code(400).send({"mensaje": "Error al actualizar el cliente"});
        }
    });

    app.delete("/cliente/:id", async (req, res) =>{
        try {
            const {id} = req.params as any;
           return await eliminarCliente(id);
        }catch (error) {
            console.log("Error al eliminar cliente");
            res.code(400).send({"mensaje": "Error al eliminar el cliente"});
        }   
    });

};
