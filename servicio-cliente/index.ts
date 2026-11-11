/**const server = Bun.serve({
 * 
    port: 3000,
    routes: {
        "/": {
            GET: () => {
                return Response.json({ message: "Hola desde el servidor de bun" });
            },
            POST: () => {
                return Response.json({ message: "Hola desde el servidor de bun" });
            },
        },
    },
});


console.log(`Servidor escuchando en http://localhost:${server.port}`);
*/

import fastify from "fastify";
import { clienteRouter } from "./src/router/cliente.route";
import { sequelize } from "./src/config/database";
const app = fastify({
    logger: true
});

app.register(clienteRouter, {prefix: "/api"});

// EJEMPLO: app.register(ventaRouter, {prefix: "/api"});
//gateway 3000
//cliente 3001
//producto 3002
//...
//factura y detalle 3003 factura es un mismo microservicio
const PORT = Number(process.env.PORT || 3001);
const iniciar = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        await app.listen({
            port: PORT, 
            host: "0.0.0.0"
        });
        console.error("Microservicio cliente ejecutando en el puerto" + PORT);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}
iniciar();