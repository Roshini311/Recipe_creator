from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class RecipeURL(BaseModel):
    url: str

class MealPlannerRequest(BaseModel):
    recipe_ids: List[int]

class RecipeBase(BaseModel):
    title: str
    source_url: str
    cuisine: Optional[str] = None
    prep_time: Optional[str] = None
    cook_time: Optional[str] = None
    ingredients: List[str] = []
    instructions: List[str] = []
    nutrition_panel: Optional[Dict[str, Any]] = None
    substitutions: Optional[List[Dict[str, Any]]] = None
    related_recipes: Optional[List[str]] = None
    shopping_list_categories: Optional[Dict[str, List[str]]] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeResponse(RecipeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
