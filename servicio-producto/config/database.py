from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmake, declarative_base

# sqlite bdd interna, archivito, para app moviles

engine = create_engine("sqlite:/// ./producto.db")