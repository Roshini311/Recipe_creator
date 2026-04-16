import os
from dotenv import load_dotenv

# Load env variables from .env
load_dotenv()

from fastapi import FastAPI, HTTPException, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Import our custom modules
import models
import schemas
import crud
from database import engine, get_db
from extractor import extract_recipe_data
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

# Initialize DB Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Recipe Extractor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

@api_router.post("/extract", response_model=schemas.RecipeResponse)
def extract_recipe(req: schemas.RecipeURL, db: Session = Depends(get_db)):
    try:
        # Extract data using the LLM logic
        data = extract_recipe_data(req.url)
        # Create or update recipe in the DB using proper ORM
        recipe = crud.create_recipe(db=db, recipe_data=data, url=req.url)
        return recipe
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/recipes", response_model=List[schemas.RecipeResponse])
def get_recipes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    recipes = crud.get_recipes(db, skip=skip, limit=limit)
    return recipes

@api_router.post("/meal-planner/shopping-list")
def generate_shopping_list(req: schemas.MealPlannerRequest, db: Session = Depends(get_db)):
    # 1. Fetch the recipes requested
    recipes = []
    for r_id in req.recipe_ids:
        recipe = crud.get_recipe(db, r_id)
        if recipe and recipe.ingredients:
            recipes.append(recipe.title + ":\n" + "\n".join(recipe.ingredients))
            
    if not recipes:
        raise HTTPException(status_code=404, detail="No valid ingredients found for selected recipes.")

    ingredients_text = "\n\n".join(recipes)

    # 2. Use Gemini to organize into a shopping list
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0)
        prompt = PromptTemplate(
            input_variables=["text"],
            template='''
            You are a helpful culinary assistant. Group the following list of ingredients into standard grocery store categories 
            (e.g., Produce, Dairy & Eggs, Meat & Seafood, Pantry, Spices).
            Combine similar items and their quantities where possible.
            
            Return ONLY a valid JSON object. 
            Format: {{"Category Name": ["item 1", "item 2"]}}
            
            Ingredients:
            {text}
            '''
        )
        
        chain = prompt | llm
        result = chain.invoke({"text": ingredients_text})
        
        # Clean response
        import re, json
        content = result.content.strip()
        content = re.sub(r"^```json", "", content)
        content = re.sub(r"^```", "", content)
        content = re.sub(r"```$", "", content)
        
        match = re.search(r"\{.*\}", content, re.DOTALL)
        if not match:
            raise ValueError("Failed to map JSON.")
            
        return json.loads(match.group())
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate shopping list. Error: {str(e)}")

app.include_router(api_router)