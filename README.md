# Recipe Extractor & Meal Planner

A full-stack application that extracts recipes from any food blog URL using BeautifulSoup & LangChain (powered by Gemini), stores them in a PostgreSQL database (via SQLAlchemy), and provides an interface built with React & Tailwind CSS.

## Features
- **Smart Extraction:** No generic APIs used. We scrape HTML and use Langchain-Google-GenAI to extract structured data.
- **AI Enhancements:** Automatically generates nutrition facts, substitutions, related recipes, and categorize ingredients for shopping lists.
- **Recipe History:** View all your previously extracted recipes.
- **Meal Planner:** Select multiple recipes to generate a consolidated shopping list using Gemini.

## Requirements
- Python 3.9+
- Node.js 18+
- PostgreSQL
- Gemini API Key

## Setup Backend
1. `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Activate it: `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt` (or manually if requirements.txt isn't generated: `fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv langchain-google-genai langchain beautifulsoup4 requests`)
5. Create `.env` file in `backend/` and set `DATABASE_URL` and `GEMINI_API_KEY`.
6. Run server: `uvicorn main:app --reload`

## Setup Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Evaluator Notes
Check out `prompts/` directory for the LLM system prompts used.
