from fastapi import FastAPI
from config.database import Base, engine

from router.producto_route import router as producto_router
app = FastAPI(
    title="servicio Productos",
    description="Servicio desarrollado en Clases de Arquitectura de software",
    version="1.0.0"
    redirect_slashes=False
)

Base.metadata.create_all(bind=engine)
app.include_router(producto_router, prefix="/api")
@app.get("/")
def inicio():
    return {"message": "Servicio factura ejecutandose con éxito"}
