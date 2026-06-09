/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Leaf, Bookmark, Gem, Bot, ChevronDown, Trash2, Crown, MessageCircle, X } from 'lucide-react';

interface CalcResult {
  cost: number;
  retail: number;
  wholesale: number;
  mp: number;
  hidden: number;
  labor: number;
}

interface CatalogItem extends CalcResult {
  id: number;
  name: string;
}

interface Recipe {
  id: number;
  name: string;
  wax: string;
  frag: string;
  temp: string;
  notes: string;
}

const premiumRecipes = [
  { name: "Santuario de Paz", effect: "Relajación Profunda", wax: "180g Cera Soja", blend: "10g Lavanda, 6g Manzanilla, 4g Vainilla", bot: "Lavanda seca, Manzanilla", temp: "58°C" },
  { name: "Amanecer Cítrico", effect: "Energía y Concentración", wax: "180g Cera Soja", blend: "8g Naranja Dulce, 7g Pomelo Rosado, 5g Menta", bot: "Naranja deshidratada, Caléndula", temp: "Permitir capa firme por peso" },
  { name: "Romance de Época", effect: "Sensualidad y Elegancia", wax: "180g Cera Soja", blend: "9g Rosa Damascena, 7g Peonía, 4g Sándalo", bot: "Pétalos de rosa, Pan de oro", temp: "Oro: aplicar casi sólido" },
  { name: "Sueño de Cuna", effect: "Seguro para Bebés (Carga 6%)", wax: "188g Cera Soja", blend: "8g Manzanilla Romana, 4g Lavanda", bot: "Avena, Manzanilla", temp: "Moldes pastel" },
  { name: "Hogar Pet-Friendly", effect: "Seguro Mascotas (Carga 8%)", wax: "184g Cera Soja", blend: "10g Naranja Dulce, 6g Cedro", bot: "NINGUNA (Evitar ingestión)", temp: "Moldes textura" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'calc' | 'recipes' | 'catalog' | 'help'>('calc');
  
  // Calc State
  const [calcForm, setCalcForm] = useState({
    waxPrice: '',
    waxQty: '',
    essPrice: '',
    essQty: '',
    packPrice: '',
    hourly: '',
    minutes: ''
  });
  const [calcResult, setCalcResult] = useState<CalcResult | null>(null);
  const [saveName, setSaveName] = useState('');
  
  // Catalog State
  const [catalog, setCatalog] = useState<CatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem('ia_catalog');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recipe State
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('ia_recipes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [recipeForm, setRecipeForm] = useState({
    name: '',
    wax: '',
    frag: '',
    temp: '',
    notes: ''
  });
  
  const [showPremiumOptions, setShowPremiumOptions] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('ia_catalog', JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    localStorage.setItem('ia_recipes', JSON.stringify(recipes));
  }, [recipes]);

  const handleCalcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCalcForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculateCost = () => {
    const waxKgPrice = parseFloat(calcForm.waxPrice) || 0;
    const waxGrams = parseFloat(calcForm.waxQty) || 0;
    const essPriceMl = parseFloat(calcForm.essPrice) || 0;
    const essMl = parseFloat(calcForm.essQty) || 0;
    const packPrice = parseFloat(calcForm.packPrice) || 0;
    const hourlyRate = parseFloat(calcForm.hourly) || 0;
    const minutes = parseFloat(calcForm.minutes) || 0;

    const waxCost = (waxKgPrice / 1000) * waxGrams;
    const essCost = essPriceMl * essMl;
    const mp = waxCost + essCost;
    const hidden = (mp + packPrice) * 0.15; // 15% costos ocultos
    const labor = (hourlyRate / 60) * minutes;

    const total = mp + packPrice + hidden + labor;
    const retail = total * 3.5;
    const wholesale = total * 2;

    setCalcResult({ mp, hidden, labor, cost: total, retail, wholesale });
  };

  const saveToCatalog = () => {
    if (!saveName.trim() || !calcResult) {
      alert("Ingresa un nombre y calcula primero.");
      return;
    }
    const newItem: CatalogItem = {
      id: Date.now(),
      name: saveName.trim(),
      ...calcResult
    };
    setCatalog(prev => [...prev, newItem]);
    alert("Producto guardado con éxito.");
    setSaveName('');
  };

  const deleteCatalogItem = (id: number) => {
    setCatalog(prev => prev.filter(item => item.id !== id));
  };

  const handleRecipeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRecipeForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveRecipe = () => {
    if (!recipeForm.name.trim()) return;
    const newRecipe: Recipe = {
      id: Date.now(),
      name: recipeForm.name,
      wax: recipeForm.wax,
      frag: recipeForm.frag,
      temp: recipeForm.temp,
      notes: recipeForm.notes
    };
    setRecipes(prev => [...prev, newRecipe]);
    setRecipeForm({ name: '', wax: '', frag: '', temp: '', notes: '' });
  };

  const deleteRecipe = (id: number) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => prev === id ? null : id);
  };

  return (
    <div className="font-sans antialiased min-h-screen pb-20">
      <header className="w-full px-4 md:px-12 pt-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-ivory">
        <div className="flex flex-col">
          <span className="text-gold uppercase tracking-[0.2em] text-[11px] font-bold mb-1">Artesanía Aromática</span>
          <h1 className="font-serif italic text-4xl text-sageGreen flex items-center">
            <Leaf className="w-8 h-8 mr-2" />
            Imperio de los Aromas
          </h1>
        </div>
        <nav className="flex gap-8 mb-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button 
            onClick={() => setActiveTab('calc')} 
            className={`text-sm font-semibold whitespace-nowrap pb-1 ${activeTab === 'calc' ? 'border-b-2 border-gold text-darkText' : 'text-gray-400 hover:text-dustyRose transition-colors'}`}
          >
            Calculadora
          </button>
          <button 
            onClick={() => setActiveTab('recipes')} 
            className={`text-sm font-semibold whitespace-nowrap pb-1 ${activeTab === 'recipes' ? 'border-b-2 border-gold text-darkText' : 'text-gray-400 hover:text-dustyRose transition-colors'}`}
          >
            Recetario
          </button>
          <button 
            onClick={() => setActiveTab('catalog')} 
            className={`text-sm font-semibold whitespace-nowrap pb-1 ${activeTab === 'catalog' ? 'border-b-2 border-gold text-darkText' : 'text-gray-400 hover:text-dustyRose transition-colors'}`}
          >
            Catálogo
          </button>
          <button 
            onClick={() => setActiveTab('help')} 
            className={`text-sm font-semibold whitespace-nowrap pb-1 ${activeTab === 'help' ? 'border-b-2 border-gold text-darkText' : 'text-gray-400 hover:text-dustyRose transition-colors'}`}
          >
            Asistencia
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-12 py-6">
        {activeTab === 'calc' && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="font-serif text-3xl mb-6 text-sageGreen">Calculadora de Precios</h2>
            <div className="glass-card rounded-xl p-6 mb-6">
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Costo Cera por Kg ($)</label>
                    <input name="waxPrice" value={calcForm.waxPrice} onChange={handleCalcChange} type="number" className="w-full bg-ivory border-none rounded-xl px-4 py-2 text-sm focus:ring-1 ring-gold outline-none" placeholder="Ej: 10.00" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Cera usada por placa (g)</label>
                    <input name="waxQty" value={calcForm.waxQty} onChange={handleCalcChange} type="number" className="w-full bg-ivory border-none rounded-xl px-4 py-2 text-sm focus:ring-1 ring-gold outline-none" placeholder="Ej: 80" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Costo Esencia por ml ($)</label>
                    <input name="essPrice" value={calcForm.essPrice} onChange={handleCalcChange} type="number" className="w-full bg-ivory border-none rounded-xl px-4 py-2 text-sm focus:ring-1 ring-gold outline-none" placeholder="Ej: 0.30" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Esencia usada por placa (ml/g)</label>
                    <input name="essQty" value={calcForm.essQty} onChange={handleCalcChange} type="number" className="w-full bg-ivory border-none rounded-xl px-4 py-2 text-sm focus:ring-1 ring-gold outline-none" placeholder="Ej: 10" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Costo de Empaque unitario ($)</label>
                    <input name="packPrice" value={calcForm.packPrice} onChange={handleCalcChange} type="number" className="w-full bg-ivory border-none rounded-xl px-4 py-2 text-sm focus:ring-1 ring-gold outline-none" placeholder="Ej: 1.50" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Tu tarifa por hora ($)</label>
                    <input name="hourly" value={calcForm.hourly} onChange={handleCalcChange} type="number" className="w-full bg-ivory border-none rounded-xl px-4 py-2 text-sm focus:ring-1 ring-gold outline-none" placeholder="Ej: 15.00" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Tiempo de elaboración (min)</label>
                    <input name="minutes" value={calcForm.minutes} onChange={handleCalcChange} type="number" className="w-full bg-ivory border-none rounded-xl px-4 py-2 text-sm focus:ring-1 ring-gold outline-none" placeholder="Ej: 15" />
                  </div>
                </div>
                <button type="button" onClick={calculateCost} className="w-full mt-6 bg-sageGreen hover:bg-[#8f9d78] text-white font-bold py-4 rounded-2xl shadow-lg shadow-sageGreen/20 transition-all">
                  Calcular Costos
                </button>
              </form>
            </div>

            {calcResult && (
              <div className="bg-white rounded-[40px] p-8 shadow-md border border-[#f0ece4] relative overflow-hidden animate-in zoom-in duration-300 mt-8">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-sageGreen opacity-5 rounded-full pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-serif text-darkText mb-1">Resultados</h3>
                    <p className="text-gold text-sm font-medium italic">Análisis de Costos</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-gray-400">Total Unitario</div>
                    <div className="text-4xl font-serif text-sageGreen">${calcResult.cost.toFixed(2)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="border-l-2 border-sageGreen pl-4">
                    <span className="block text-[11px] uppercase tracking-tighter text-gray-400">Retail Sugerido</span>
                    <span className="text-xl font-bold">${calcResult.retail.toFixed(2)}</span>
                  </div>
                  <div className="border-l-2 border-gold pl-4">
                    <span className="block text-[11px] uppercase tracking-tighter text-gray-400">Mayorista</span>
                    <span className="text-xl font-bold">${calcResult.wholesale.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-ivory rounded-3xl p-6">
                  <h4 className="text-xs font-bold uppercase mb-4 tracking-widest text-sageGreen">Desglose</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-600">Materia Prima</span>
                      <span className="font-semibold">${calcResult.mp.toFixed(2)}</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-600">Costos Ocultos (15%)</span>
                      <span className="font-semibold">${calcResult.hidden.toFixed(2)}</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-600">Mano de Obra</span>
                      <span className="font-semibold">${calcResult.labor.toFixed(2)}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-8 pt-6 border-t border-[#f0ece4] flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text" 
                    value={saveName}
                    onChange={e => setSaveName(e.target.value)}
                    placeholder="Escribe el nombre del producto..." 
                    className="flex-1 bg-ivory border-none rounded-2xl px-4 py-3 text-sm focus:ring-1 ring-gold outline-none"
                  />
                  <button onClick={saveToCatalog} className="whitespace-nowrap bg-sageGreen hover:bg-[#8f9d78] text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-sageGreen/20 transition-all flex items-center justify-center">
                    <Bookmark className="w-4 h-4 mr-2" /> Guardar Catálogo
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === 'recipes' && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-3xl text-sageGreen">Mi Recetario</h2>
              <button onClick={() => setShowPremiumOptions(true)} className="bg-sageGreen/10 text-sageGreen hover:bg-sageGreen/20 border border-sageGreen/20 px-6 py-2 rounded-2xl font-bold shadow-sm transition-colors cursor-pointer flex items-center">
                <Gem className="w-4 h-4 mr-2" /> Premium
              </button>
            </div>

            <div className="glass-card rounded-[32px] p-6 lg:p-8 mb-8 border border-[#f0ece4]">
              <h3 className="font-serif text-xl mb-6 text-sageGreen">Añadir Nueva Receta</h3>
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Nombre</label>
                  <input name="name" value={recipeForm.name} onChange={handleRecipeChange} type="text" placeholder="Ej: Brisa de Eucalipto" className="w-full bg-ivory border-none rounded-xl px-4 py-3 text-sm focus:ring-1 ring-gold outline-none" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Tipo de Cera</label>
                    <input name="wax" value={recipeForm.wax} onChange={handleRecipeChange} type="text" placeholder="Ej: Soja BP" className="w-full bg-ivory border-none rounded-xl px-4 py-3 text-sm focus:ring-1 ring-gold outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Fragancia</label>
                    <input name="frag" value={recipeForm.frag} onChange={handleRecipeChange} type="text" placeholder="Ej: 10%" className="w-full bg-ivory border-none rounded-xl px-4 py-3 text-sm focus:ring-1 ring-gold outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Vertido</label>
                    <input name="temp" value={recipeForm.temp} onChange={handleRecipeChange} type="text" placeholder="Ej: 65°C" className="w-full bg-ivory border-none rounded-xl px-4 py-3 text-sm focus:ring-1 ring-gold outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Notas</label>
                  <textarea name="notes" value={recipeForm.notes} onChange={handleRecipeChange} placeholder="Salida, Corazón, Fondo, Decoración..." className="w-full bg-ivory border-none rounded-xl px-4 py-3 text-sm focus:ring-1 ring-gold outline-none" rows={3}></textarea>
                </div>
                <button type="button" onClick={saveRecipe} className="w-full mt-4 bg-sageGreen hover:bg-[#8f9d78] text-white font-bold py-4 rounded-2xl shadow-lg shadow-sageGreen/20 transition-all cursor-pointer">
                  Guardar Receta
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipes.map(rec => (
                <div key={rec.id} className="bg-white rounded-[32px] p-6 border border-[#f0ece4] shadow-sm relative group hover:shadow-md transition-shadow">
                  <button onClick={() => deleteRecipe(rec.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h4 className="font-bold text-lg mb-2 pr-6">{rec.name}</h4>
                  <div className="text-xs text-gray-600 grid grid-cols-2 gap-1 mb-2">
                    <p><strong>Cera:</strong> {rec.wax}</p>
                    <p><strong>Fragancia:</strong> {rec.frag}</p>
                    <p><strong>Vertido:</strong> {rec.temp}°C</p>
                  </div>
                  {rec.notes && <p className="text-xs text-gray-500 italic mt-2 border-t pt-2">{rec.notes}</p>}
                </div>
              ))}
              {recipes.length === 0 && (
                <p className="text-gray-500 col-span-full">Aún no tienes recetas guardadas.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'catalog' && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="font-serif text-3xl mb-6 text-sageGreen">Catálogo de Productos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalog.map(item => (
                <div key={item.id} className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-[#f0ece4] relative group">
                  <button onClick={() => deleteCatalogItem(item.id)} className="absolute top-6 right-6 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition cursor-pointer bg-white rounded-full p-2 shadow-sm border border-ivory">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h3 className="font-serif text-2xl mb-1 pr-6 text-darkText">{item.name}</h3>
                  <div className="text-[10px] uppercase font-bold text-gray-400 mb-6 tracking-wide">Costo: ${item.cost.toFixed(2)}</div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="border-l-2 border-sageGreen pl-3">
                      <span className="block text-[10px] uppercase tracking-tighter text-gray-400">Retail Sugerido</span>
                      <span className="text-lg font-bold">${item.retail.toFixed(2)}</span>
                    </div>
                    <div className="border-l-2 border-gold pl-3">
                      <span className="block text-[10px] uppercase tracking-tighter text-gray-400">Mayorista</span>
                      <span className="text-lg font-bold">${item.wholesale.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {catalog.length === 0 && (
                <p className="text-gray-500 col-span-full">Aún no tienes productos guardados.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'help' && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="font-serif text-3xl mb-6 text-sageGreen">Centro de Asistencia</h2>
            
            <div className="bg-sageGreen/10 border border-sageGreen/20 rounded-[32px] p-8 text-center mb-8 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-sageGreen opacity-5 rounded-full pointer-events-none"></div>
              <h3 className="font-serif text-2xl font-bold mb-2 text-sageGreen">¿Problemas con tu placa?</h3>
              <p className="mb-6 text-sm text-gray-600">Consulta a tu maestro artesano impulsado por IA.</p>
              <a href="https://gemini.google.com/gem/0562d0cce8e5" target="_blank" rel="noreferrer" className="inline-flex items-center bg-white border border-[#f0ece4] text-sageGreen font-bold py-3 px-8 rounded-full shadow-sm hover:shadow-md transition-all">
                <Bot className="w-5 h-5 mr-2" /> Consultar a El Experto Aromático
              </a>
            </div>

            <h3 className="font-serif text-2xl mb-4 text-gray-700">Troubleshooting Rápido</h3>
            <div className="space-y-3">
              {[
                { 
                  id: 'acc1', 
                  title: '¿Manchas blancas? (Frosting)', 
                  cause: 'La cera se enfrió muy rápido. Reacción natural de la soja.', 
                  solution: 'Pasa rápidamente un secador de pelo o pistola de calor sobre la superficie por 3-5 segundos. Al secarse, quedará brillante.' 
                },
                { 
                  id: 'acc2', 
                  title: '¿Gotas de aceite? (Sudoración)', 
                  cause: 'Exceso de esencia o fue añadida cuando la cera estaba muy fría (< 70°C).', 
                  solution: 'Absorbe suavemente con toalla de papel y reposa 48h. Si continúa, vuelve a derretir y añade un poco de cera pura.' 
                },
                { 
                  id: 'acc3', 
                  title: '¿Se hundió el centro? (Sinkholes)', 
                  cause: 'La cera se vertió muy caliente y se contrajo al enfriar.', 
                  solution: 'Calienta cera sobrante y vierte una fina capa (1-2mm) para rellenar el cráter, o nivela con pistola de calor.' 
                }
              ].map(item => (
                <div key={item.id} className="bg-white rounded-3xl p-2 border border-[#f0ece4] mb-3 shadow-sm hover:shadow-md transition-shadow">
                  <button 
                    onClick={() => toggleAccordion(item.id)} 
                    className="w-full text-left p-4 font-bold text-darkText hover:text-sageGreen flex justify-between items-center cursor-pointer transition-colors"
                  >
                    <span className="font-serif text-lg">{item.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openAccordion === item.id ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                    className={`bg-white/60 px-4 overflow-hidden transition-all duration-300 ${openAccordion === item.id ? 'max-h-[500px] py-4 border-t border-white' : 'max-h-0'}`}
                  >
                    <p className="text-sm text-gray-600 mb-2"><strong>Causa:</strong> {item.cause}</p>
                    <p className="text-sm text-gray-600"><strong>Solución:</strong> {item.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Premium Recipes Modal */}
      {showPremiumOptions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 border border-[#f0ece4]">
            <button onClick={() => setShowPremiumOptions(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition cursor-pointer bg-ivory rounded-full p-2">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-3xl text-sageGreen mb-6 flex items-center">
              <Crown className="w-8 h-8 mr-3 text-gold" /> Recetas Premium
            </h2>
            <div className="space-y-4">
              {premiumRecipes.map((r, i) => (
                <div key={i} className="p-6 border border-[#f0ece4] rounded-3xl bg-ivory hover:shadow-sm transition-shadow">
                  <h3 className="font-bold text-xl text-darkText mb-1">{r.name}</h3>
                  <span className="inline-block px-3 py-1 bg-sageGreen/10 text-sageGreen text-[10px] font-bold uppercase tracking-wider rounded-full mb-4">{r.effect}</span>
                  <ul className="text-sm text-gray-600 space-y-3">
                    <li className="flex justify-between border-b border-white pb-2"><strong className="text-gray-400 uppercase text-[10px] tracking-wider">Base</strong> {r.wax}</li>
                    <li className="flex justify-between border-b border-white pb-2"><strong className="text-gray-400 uppercase text-[10px] tracking-wider">Blend</strong> {r.blend}</li>
                    <li className="flex justify-between border-b border-white pb-2"><strong className="text-gray-400 uppercase text-[10px] tracking-wider">Botánica</strong> {r.bot}</li>
                    <li className="flex justify-between pb-1"><strong className="text-gray-400 uppercase text-[10px] tracking-wider">Temp/Técnica</strong> {r.temp}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <a 
        href="https://gemini.google.com/gem/0562d0cce8e5" 
        target="_blank" 
        rel="noreferrer" 
        className="fixed bottom-6 right-6 bg-gold text-white p-4 rounded-full shadow-2xl hover:bg-dustyRose transition duration-300 transform hover:scale-110 z-40 flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
