from sqlalchemy.orm import Session
from models.producto import Producto
from schemas.producto import ProductoCreate


def obtener_producto(db: Session):
    return db.query(Producto).all()

def obtener_producto_id(db: Session, codigo: int):
    return db.query(Producto).filter(Producto.codigo == codigo).first()

#crear producto
def crear_producto(db: Session, producto: ProductoCreate):
    nuevo_producto = Producto(
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        precio=producto.precio,
        stock=producto.stock
    )
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)

    return nuevo_producto
    

#Actualizar producto
def actualizar_producto(db: Session, codigo: int, producto: ProductoCreate):
    db_producto = db.query(Producto).filter(Producto.codigo == codigo).first()
    if db_producto:
        for key, value in producto.model_dump().items():
            setattr(db_producto, key, value)
        db.commit()
        db.refresh(db_producto)
    return db_producto



def eliminar_producto(db: Session, codigo:int):
    producto=obtener_producto_id(db, codigo)
    if not producto:
        return None
    
    db.delete(producto)
    db.commit()

    return producto