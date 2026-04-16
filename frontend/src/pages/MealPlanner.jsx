import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function MealPlanner() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [shoppingList, setShoppingList] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/recipes`);
      setRecipes(resp.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecipe = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleGenerate = async () => {
    if (selectedIds.size === 0) return;
    setGenerating(true);
    try {
      const resp = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/meal-planner/shopping-list`, {
        recipe_ids: Array.from(selectedIds)
      });
      setShoppingList(resp.data);
    } catch (e) {
      console.error(e);
      alert('Failed to generate shopping list.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Meal Planner</h2>
        <p className="text-slate-600 mt-1">Select multiple recipes to magically generate a consolidated shopping list.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-lg mb-4">Select Recipes ({selectedIds.size})</h3>
            
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {recipes.length === 0 && <p className="text-slate-500 text-sm py-4">No recipes available yet. Extract some first!</p>}
                {recipes.map(r => (
                  <button
                    key={r.id}
                    onClick={() => toggleRecipe(r.id)}
                    className={`flex items-start text-left gap-3 p-4 rounded-xl border-2 transition-all ${
                      selectedIds.has(r.id) 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${selectedIds.has(r.id) ? 'text-orange-500' : 'text-slate-300'}`} />
                    <div>
                      <div className={`font-medium ${selectedIds.has(r.id) ? 'text-orange-900' : 'text-slate-700'}`}>{r.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{r.ingredients.length} ingredients</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {recipes.length > 0 && (
               <div className="mt-6 border-t border-slate-100 pt-6">
                 <button 
                  onClick={handleGenerate}
                  disabled={selectedIds.size === 0 || generating}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-all shadow disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                   {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-orange-400" />}
                   Generate Shopping List
                 </button>
               </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
           {shoppingList && (
             <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg p-1 animate-in slide-in-from-right-8 duration-500">
                <div className="bg-white rounded-xl p-6 h-full">
                  <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-orange-500" />
                    Shopping List
                  </h3>
                  
                  <div className="space-y-6">
                    {Object.entries(shoppingList).map(([category, items]) => (
                      <div key={category}>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{category}</h4>
                        <ul className="space-y-2">
                          {items.map((item, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-700 items-start">
                              <span className="w-4 h-4 rounded border border-slate-300 text-transparent flex justify-center items-center flex-shrink-0 mt-0.5 hover:bg-orange-50 hover:border-orange-500 cursor-pointer transition-colors hover:text-orange-500">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
