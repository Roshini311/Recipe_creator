import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, ExternalLink, X, Navigation } from 'lucide-react';

export default function History() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Recipe History</h2>
          <p className="text-slate-600 mt-1">All your previously extracted recipes.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-600">
                  <th className="p-4">Title</th>
                  <th className="p-4">Cuisine</th>
                  <th className="p-4">Date Added</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recipes.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500">No recipes extracted yet.</td>
                  </tr>
                )}
                {recipes.map(recipe => (
                  <tr key={recipe.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{recipe.title}</td>
                    <td className="p-4 text-slate-600">{recipe.cuisine || '-'}</td>
                    <td className="p-4 text-slate-500 text-sm">{new Date(recipe.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedRecipe(recipe)}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center justify-end gap-1 ml-auto"
                      >
                        View Details <Navigation className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedRecipe && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-2xl font-bold">{selectedRecipe.title}</h3>
              <button onClick={() => setSelectedRecipe(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow space-y-6">
              <a href={selectedRecipe.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-orange-600 hover:underline">
                <ExternalLink className="w-4 h-4" /> Original Source
              </a>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Ingredients</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex gap-2"><span className="text-orange-400">•</span> {ing}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3">Instructions</h4>
                  <ol className="space-y-3 text-sm text-slate-700">
                    {selectedRecipe.instructions.map((inst, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="font-medium text-slate-400">{i + 1}.</span> {inst}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
