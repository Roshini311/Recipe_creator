from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from database import Base
from datetime import datetime, timezone

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    source_url = Column(String, unique=True, index=True)
    cuisine = Column(String, nullable=True)
    prep_time = Column(String, nullable=True)
    cook_time = Column(String, nullable=True)
    ingredients = Column(JSON) # List of ingredients
    instructions = Column(JSON) # List of instructions
    
    # AI Enhancements
    nutrition_panel = Column(JSON, nullable=True)
    substitutions = Column(JSON, nullable=True)
    related_recipes = Column(JSON, nullable=True)
    shopping_list_categories = Column(JSON, nullable=True) # E.g., Produce, Dairy
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
