from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# sqlite bdd interna, archivito, para app moviles
#declarative traduce 

engine = create_engine("sqlite:///./producto.db")#al poner create engine se crea un pul de conexiones automatico.

SessionLocal = sessionmaker(
    autoflush = False,
    autocommit = False,
    bind = engine
)

Base = declarative_base()
def obtener_db():
    db = SessionLocal()
    try:
        yield db #transmitir 
    except:
        print("Ocurrió un error en la captura de datos")
    finally:
        db.close()