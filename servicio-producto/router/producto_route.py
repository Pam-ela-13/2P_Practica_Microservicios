from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from config.database import obtener_db
from schemas.producto import ProductoCreate, ProductoResponse
from controllers import producto_controller

router = APIRouter(
    prefix="/productos",
    tags=["productos"]
)
@router.get("", response_model=list[ProductoResponse])
def listar_productos(db: Session = Depends(obtener_db)):
    return producto_controller.obtener_producto(db)

#obtener producto por id
@router.get("/{codigo}", response_model=ProductoResponse)
def busca_producto(codigo: int, db: Session = Depends(obtener_db)):
    producto = producto_controller.obtener_producto_id(db, codigo)
    if not producto :
        raise HTTPException(400, "Producto no encontrado")
    return producto

#post registrar producto
@router.post("", response_model=ProductoResponse)
def registrar_producto(producto: ProductoCreate, db: Session = Depends(obtener_db)):
    return producto_controller.crear_producto(db, producto)

#put actualizar producto
@router.put("/{codigo}", response_model=ProductoResponse)
def modificar_producto(codigo: int, producto: ProductoCreate, db: Session = Depends(obtener_db)):
    producto_actualizado = producto_controller.actualizar_producto(db, codigo, producto)
    if not producto_actualizado:
        raise HTTPException(400, "Producto no encontrado")
    return producto_actualizado

#delete eliminar producto
@router.delete("/{codigo}")
def borrar_producto(codigo: int, db: Session = Depends(obtener_db)):
    producto_eliminado = producto_controller.eliminar_producto(db, codigo)
    if not producto_eliminado:
        raise HTTPException(400, "Producto no encontrado")
    return {"message": "Producto eliminado correctamente"}

