import React, { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, Sparkles, Clock, Utensils } from 'lucide-react';

export default function ExtractRecipe() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError(null);
    setRecipe(null);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/extract`, { url });
      setRecipe(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to extract recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Extract Any Recipe</h1>
        <p className="text-lg text-slate-600">Paste a food blog URL below and our AI will cut through the life stories to fetch just the recipe.</p>
        
        <form onSubmit={handleExtract} className="pt-4">
          <div className="relative flex items-center group">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="url" 
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/best-lasagna-recipe"
              className="w-full pl-12 pr-32 py-4 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all text-lg shadow-sm"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="absolute right-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-medium py-2 px-6 rounded-xl transition-all shadow-md disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Extract
            </button>
          </div>
          {error && <p className="text-red-500 mt-3 font-medium">{error}</p>}
        </form>
      </div>

      {recipe && (
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-8 animate-in zoom-in-95 duration-500">
          <div className="border-b border-slate-100 pb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{recipe.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
              {recipe.cuisine && <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full">{recipe.cuisine}</span>}
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> Prep: {recipe.prep_time || 'N/A'}</div>
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> Cook: {recipe.cook_time || 'N/A'}</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 border-r border-slate-100 pr-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-orange-500"/> Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex gap-3 text-slate-700 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0"></span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Instructions</h3>
              <ol className="space-y-4">
                {recipe.instructions.map((inst, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-semibold text-sm">
                      {i + 1}
                    </span>
                    <p className="text-slate-700 leading-relaxed mt-1">{inst}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mt-4">
            <h3 className="text-lg font-semibold mb-3">AI Enhancements</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {recipe.nutrition_panel && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Nutrition</h4>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                    {Object.entries(recipe.nutrition_panel).map(([k,v]) => (
                      <span key={k} className="bg-white px-2 py-1 rounded-md border border-slate-200">
                        <strong className="capitalize">{k}:</strong> {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {recipe.substitutions && recipe.substitutions.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Substitutions</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {recipe.substitutions.map((sub, i) => (
                      <li key={i}>Swap <span className="font-semibold">{sub.original}</span> for <span className="font-semibold">{sub.substitute}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
