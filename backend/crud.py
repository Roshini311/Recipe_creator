from sqlalchemy.orm import Session
from models import Recipe
import schemas

def get_recipe(db: Session, recipe_id: int):
    return db.query(Recipe).filter(Recipe.id == recipe_id).first()

def get_recipes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Recipe).offset(skip).limit(limit).all()

def create_recipe(db: Session, recipe_data: dict, url: str):
    # Check if recipe already exists
    existing = db.query(Recipe).filter(Recipe.source_url == url).first()
    if existing:
        return existing
        
    db_recipe = Recipe(
        title=recipe_data.get("title", "Unknown Title"),
        source_url=url,
        cuisine=recipe_data.get("cuisine"),
        prep_time=recipe_data.get("prep_time"),
        cook_time=recipe_data.get("cook_time"),
        ingredients=recipe_data.get("ingredients", []),
        instructions=recipe_data.get("instructions", []),
        nutrition_panel=recipe_data.get("nutrition_panel"),
        substitutions=recipe_data.get("substitutions"),
        related_recipes=recipe_data.get("related_recipes"),
        shopping_list_categories=recipe_data.get("shopping_list_categories")
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe
