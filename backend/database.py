import os
from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/recipes")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True)
    url = Column(String)
    data = Column(JSON)

Base.metadata.create_all(bind=engine)

def save_recipe(url, data):
    db = SessionLocal()
    recipe = Recipe(url=url, data=data)
    db.add(recipe)
    db.commit()
    db.close()

def get_all_recipes():
    db = SessionLocal()
    recipes = db.query(Recipe).all()
    db.close()

    return [{"url": r.url, "data": r.data} for r in recipes]