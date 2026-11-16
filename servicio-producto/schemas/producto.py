from pydantic import BaseModel, ConfigDict

class ProductoCreate(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    stock: int

class ProductoResponse(BaseModel):
    codigo: int
    nombre: str
    descripcion: str
    precio: float
    stock: int
    model_config= ConfigDict(from_attributes=True)

