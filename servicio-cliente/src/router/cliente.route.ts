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

    // Ruta usada por api-gateway y por servicio-factura para validar clientes.
    app.get<{ Params: { id: string } }>("/clientes/:id", async (req, res) => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
            return res.code(400).send({ mensaje: "El ID debe ser un entero positivo válido" });
        }

        try {
            return await obtenerClienteId(id);
        } catch (error) {
            if (error instanceof Error && error.message === "Cliente no encontrado") {
                return res.code(404).send({ mensaje: "Cliente no encontrado" });
            }
            throw error;
        }
    });

    app.post("/clientes", async (req, res) => {
        try {
            const cliente = await crearCliente(req.body);
            return res.code(201).send(cliente);
        } catch (error) {
            return res.code(400).send({ mensaje: error instanceof Error ? error.message : "No se pudo crear el cliente" });
        }
    });

    app.put<{ Params: { id: string } }>("/clientes/:id", async (req, res) => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
            return res.code(400).send({ mensaje: "El ID debe ser un entero positivo válido" });
        }
        try {
            return await actualizarCliente(id, req.body);
        } catch (error) {
            const noExiste = error instanceof Error && error.message === "Cliente no encontrado";
            return res.code(noExiste ? 404 : 400).send({ mensaje: error instanceof Error ? error.message : "No se pudo actualizar el cliente" });
        }
    });

    app.delete<{ Params: { id: string } }>("/clientes/:id", async (req, res) => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
            return res.code(400).send({ mensaje: "El ID debe ser un entero positivo válido" });
        }
        try {
            return await eliminarCliente(id);
        } catch (error) {
            const noExiste = error instanceof Error && error.message === "Cliente no encontrado";
            return res.code(noExiste ? 404 : 400).send({ mensaje: error instanceof Error ? error.message : "No se pudo eliminar el cliente" });
        }
    });

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
            return res.code(201).send(await crearCliente(cliente));
        }catch (error) {
            console.log("Error al crear cliente");
            res.code(400).send({"mensaje": "Error al crear el cliente"});
        }
    });
    app.put("/cliente/:id", async (req, res) =>{
        try {
            const {id} =req.params as any;
            const cliente = req.body;
            return await actualizarCliente(Number(id), cliente);
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
