import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import ExtractRecipe from "./pages/ExtractRecipe";
import History from "./pages/History";
import MealPlanner from "./pages/MealPlanner";
import { ChefHat, History as HistoryIcon, ListChecks } from "lucide-react";

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Extract Recipe", icon: <ChefHat className="w-5 h-5" /> },
    { path: "/history", label: "History", icon: <HistoryIcon className="w-5 h-5" /> },
    { path: "/planner", label: "Meal Planner", icon: <ListChecks className="w-5 h-5" /> }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-8">
        <div className="font-bold text-xl text-slate-900 flex items-center gap-2">
          <span className="bg-orange-500 text-white p-1.5 rounded-lg">
            <ChefHat className="w-5 h-5" />
          </span>
          RecipeExtractor
        </div>
        
        <div className="flex gap-1 h-full">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 h-full border-b-2 transition-colors ${
                location.pathname === item.path 
                  ? "border-orange-500 text-orange-600 font-medium" 
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navigation />
        <main className="max-w-6xl mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<ExtractRecipe />} />
            <Route path="/history" element={<History />} />
            <Route path="/planner" element={<MealPlanner />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;