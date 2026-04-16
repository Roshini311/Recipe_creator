import os
import json
import re
import requests
from bs4 import BeautifulSoup
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

os.environ["GOOGLE_API_KEY"] = "YOUR_GEMINI_API_KEY"

def fetch_and_parse_html(url: str) -> str:
    headers = {
        'User-Agent': 'Mozilla/5.0'
    }
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, 'html.parser')

    for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
        tag.extract()

    text = soup.get_text(separator=' ')
    text = " ".join(text.split())

    return text[:12000]


def clean_llm_json(content: str) -> dict:
    content = content.strip()
    content = re.sub(r"^```json", "", content)
    content = re.sub(r"^```", "", content)
    content = re.sub(r"```$", "", content)

    match = re.search(r"\{.*\}", content, re.DOTALL)
    if not match:
        raise ValueError("No JSON found")

    return json.loads(match.group())


def extract_recipe_data(url: str) -> dict:
    raw_text = fetch_and_parse_html(url)

    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0)

    prompt = PromptTemplate(
        input_variables=["text"],
        template="""
        You are a strict JSON generator.

        Return ONLY valid JSON. No explanation.

        Structure:
        {
            "title": "",
            "cuisine": "",
            "prep_time": "",
            "cook_time": "",
            "ingredients": [{"quantity": "", "unit": "", "item": ""}],
            "instructions": [],
            "difficulty": "",
            "nutrition_panel": {"calories": "", "protein": "", "carbs": "", "fat": ""},
            "substitutions": [{"original": "", "substitute": ""}],
            "related_recipes": [],
            "shopping_list_categories": {}
        }

        Ingredients MUST be structured.

        Text:
        {text}
        """
    )

    chain = prompt | llm
    result = chain.invoke({"text": raw_text})

    data = clean_llm_json(result.content)
    data["source_url"] = url

    return data