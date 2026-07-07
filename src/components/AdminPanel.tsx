import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  Lock, KeyRound, PlusCircle, Package, Trash2, X, Tag, 
  DollarSign, Image as ImageIcon, Layers, Search, CheckCircle2, AlertCircle, Upload, Car
} from 'lucide-react';

export default function AdminPanel({ products, onClose }: { products: any[], onClose: () => void }) {
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Tabs: 'add' | 'list' | 'hero'
  const [activeTab, setActiveTab] = useState<'add' | 'list' | 'hero'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  
  // Form state
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    imageUrl: '', 
    purchaseUrl: '',
    category: 'COINS CPM' 
  });
  
  // Hero State
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [isHeroSaving, setIsHeroSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchHero = async () => {
      const docRef = doc(db, 'settings', 'hero');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHeroImageUrl(docSnap.data().imageUrl);
      }
    };
    fetchHero();
  }, []);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isHero: boolean) => {
    const file = e.target.files?.[0];
    if (!file) {
        console.log('No file selected');
        return;
    }
    console.log('File selected:', file.name, isHero ? 'for hero' : 'for product');

    setIsUploading(true);
    setFormError('');
    try {
      const base64Url = await compressImage(file);
      if (isHero) {
        setHeroImageUrl(base64Url);
        console.log('Hero URL state updated');
      } else {
        setNewProduct({ ...newProduct, imageUrl: base64Url });
      }
    } catch (err) {
      console.error('Error processing file:', err);
      setFormError('Erro ao carregar imagem. Verifique se o arquivo é válido.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveHero = async () => {
    console.log('handleSaveHero called. heroImageUrl:', heroImageUrl);
    if (!heroImageUrl) {
        console.log('handleSaveHero: no heroImageUrl');
        setFormError('Selecione uma imagem primeiro.');
        return;
    }
    setIsHeroSaving(true);
    setFormError(''); // Reset errors
    console.log('Saving hero with URL:', heroImageUrl);
    try {
      await setDoc(doc(db, 'settings', 'hero'), { imageUrl: heroImageUrl, updatedAt: Date.now() }, { merge: true });
      console.log('Hero saved successfully');
      setSuccessMsg('Imagem do Hero atualizada com sucesso!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error saving hero:', err);
      setFormError('Erro ao salvar imagem. Verifique a conexão.');
    } finally {
      setIsHeroSaving(false);
    }
  };

  const handleRemoveHero = async () => {
    setIsHeroSaving(true);
    try {
      await deleteDoc(doc(db, 'settings', 'hero'));
      setHeroImageUrl('');
      setSuccessMsg('Imagem do Hero removida com sucesso!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setFormError('Erro ao remover imagem.');
    } finally {
      setIsHeroSaving(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '141007') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Código de acesso incorreto.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-gray-900 p-8 rounded-2xl border border-yellow-500/40 shadow-2xl max-w-md w-full relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-14 h-14 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center justify-center mb-3 text-yellow-500">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Acesso Administrador</h2>
            <p className="text-sm text-gray-400 mt-1">Área restrita à gestão da Sky Dzimba CPM</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => { setPasscode(e.target.value); setAuthError(''); }}
                className="w-full pl-11 pr-4 py-3 bg-gray-800/80 border border-gray-700 text-white rounded-xl focus:outline-none focus:border-yellow-500 placeholder-gray-500 transition-colors"
                placeholder="Introduza o código de acesso"
                autoFocus
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black py-3 rounded-xl font-bold uppercase tracking-wider hover:from-yellow-500 hover:to-yellow-400 transition-all shadow-lg shadow-yellow-500/20 cursor-pointer"
            >
              Autenticar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!newProduct.name.trim() || !newProduct.price.trim()) {
      setFormError('O nome e o preço são obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        createdAt: Date.now()
      });
      setNewProduct({ name: '', price: '', imageUrl: '', purchaseUrl: '', category: 'COINS CPM' });
      setSuccessMsg('Produto adicionado com sucesso!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setFormError('Erro ao adicionar produto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.error('Erro ao remover produto:', err);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.price?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'TODOS' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md p-4 md:p-8 z-50 overflow-y-auto">
      <div className="bg-gray-900 border border-yellow-600/50 rounded-2xl max-w-5xl mx-auto shadow-2xl flex flex-col min-h-[85vh]">
        
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center p-6 border-b border-gray-800 bg-black/40 rounded-t-2xl gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black font-extrabold text-xl shadow-md shadow-yellow-500/20">
              CPM
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-yellow-500 tracking-tight">PAINEL ADMINISTRADOR</h2>
              <p className="text-xs text-gray-400">Gerenciador de catálogo e preços Sky Dzimba</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-lg text-xs text-gray-300 flex items-center gap-2">
              <Package className="w-4 h-4 text-yellow-500" />
              <span>Total: <strong>{products.length}</strong> itens</span>
            </div>
            
            <button 
              onClick={onClose} 
              className="bg-gray-800 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-gray-700 hover:border-red-500/40 p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold uppercase cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Fechar Painel</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-800 px-6 pt-4 gap-2 bg-gray-900/60">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'list' 
                ? 'border-yellow-500 text-yellow-500' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catálogo Ativo ({products.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'add' 
                ? 'border-yellow-500 text-yellow-500' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Adicionar Novo Produto</span>
          </button>
          
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'hero' 
                ? 'border-yellow-500 text-yellow-500' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Gestão do Hero</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1">
          
          {/* TAB 1: LIST PRODUCTS */}
          {activeTab === 'list' && (
            <div className="space-y-6 animate-fade-in">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col md:flex-row gap-4 justify-between bg-gray-800/50 p-4 rounded-xl border border-gray-800">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar por nome ou preço..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  {['TODOS', 'COINS CPM', 'DINHEIRO CPM', 'GAME GUARDIAN'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/20' 
                          : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Table / Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-gray-800/20 rounded-2xl border border-gray-800 border-dashed">
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">Nenhum produto encontrado nesta categoria ou pesquisa.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('TODOS'); }}
                    className="mt-3 text-xs text-yellow-500 underline hover:text-yellow-400 cursor-pointer"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map(p => (
                    <div 
                      key={p.id} 
                      className="bg-gray-800/60 hover:bg-gray-800 border border-gray-700/80 rounded-xl p-4 flex gap-4 items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-14 h-14 bg-gray-900 rounded-lg shrink-0 overflow-hidden border border-gray-700 flex items-center justify-center">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-yellow-600/60" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="inline-block text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase mb-1">
                            {p.category}
                          </span>
                          <h4 className="font-bold text-white text-sm truncate" title={p.name}>{p.name}</h4>
                          <p className="text-yellow-500 font-extrabold text-sm mt-0.5">{p.price} MZM</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleDeleteProduct(p.id)} 
                        className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition-all shrink-0 cursor-pointer"
                        title="Remover Produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADD PRODUCT FORM */}
          {activeTab === 'add' && (
            <div className="max-w-2xl mx-auto bg-gray-800/40 p-6 md:p-8 rounded-2xl border border-gray-800 animate-fade-in">
              <div className="mb-6 pb-4 border-b border-gray-700/80">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-yellow-500" />
                  <span>Cadastrar Novo Produto</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">O produto aparecerá imediatamente no site após o registo.</p>
              </div>

              {successMsg && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {formError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleAddProduct} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-yellow-500" />
                    <span>Nome do Pacote / Produto *</span>
                  </label>
                  <input 
                    className="w-full p-3 bg-gray-900 border border-gray-700 text-white rounded-xl text-sm focus:outline-none focus:border-yellow-500 transition-colors placeholder-gray-600" 
                    placeholder="Ex: 50.000.000 Coins CPM" 
                    value={newProduct.name} 
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Preço Formadado *</span>
                    </label>
                    <input 
                      className="w-full p-3 bg-gray-900 border border-gray-700 text-white rounded-xl text-sm focus:outline-none focus:border-yellow-500 transition-colors placeholder-gray-600 font-medium" 
                      placeholder="Ex: 150,00 MT" 
                      value={newProduct.price} 
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Categoria</span>
                    </label>
                    <select 
                      className="w-full p-3 bg-gray-900 border border-gray-700 text-white rounded-xl text-sm focus:outline-none focus:border-yellow-500 transition-colors" 
                      value={newProduct.category} 
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option>COINS CPM</option>
                      <option>DINHEIRO CPM</option>
                      <option>GAME GUARDIAN</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-yellow-500" />
                    <span>Imagem do Produto (Galeria) *</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, false)}
                      className="hidden"
                      id="productImage"
                      disabled={isUploading}
                    />
                    <label 
                      htmlFor="productImage"
                      className={`flex items-center gap-2 px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-xl text-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-yellow-500'} transition-colors`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploading ? 'A carregar...' : 'Selecionar da Galeria'}</span>
                    </label>
                    {newProduct.imageUrl && !isUploading && (
                      <span className="text-xs text-green-500 font-semibold truncate max-w-[150px]">Imagem carregada!</span>
                    )}
                  </div>
                  
                  <p className="text-[10px] text-gray-500 mt-1.5">Selecione uma imagem do seu dispositivo para carregar automaticamente.</p>
                  
                  {newProduct.imageUrl && (
                    <div className="mt-3 p-2 bg-gray-900/80 rounded-lg border border-gray-700 flex items-center gap-3">
                      <img 
                        src={newProduct.imageUrl} 
                        alt="Pré-visualização" 
                        className="w-12 h-12 object-cover rounded" 
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <span className="text-xs text-gray-400">Pré-visualização da imagem</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-yellow-500" />
                    <span>Link de Compra (URL)</span>
                  </label>
                  <input 
                    className="w-full p-3 bg-gray-900 border border-gray-700 text-white rounded-xl text-sm focus:outline-none focus:border-yellow-500 transition-colors placeholder-gray-600" 
                    placeholder="https://checkout.escalepay.com/..." 
                    value={newProduct.purchaseUrl} 
                    onChange={e => setNewProduct({...newProduct, purchaseUrl: e.target.value})} 
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="px-5 py-3 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 text-sm font-semibold transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || isUploading}
                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-extrabold px-8 py-3 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-yellow-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'A Registar...' : (isUploading ? 'A Carregar Imagem...' : 'Salvar Produto')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: HERO MANAGEMENT */}
          {activeTab === 'hero' && (
            <div className="max-w-2xl mx-auto bg-gray-800/40 p-6 md:p-8 rounded-2xl border border-gray-800 animate-fade-in">
              <div className="mb-6 pb-4 border-b border-gray-700/80">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-yellow-500" />
                  <span>Configurar Imagem do Hero</span>
                </h3>
              </div>

              {successMsg && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {formError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Imagem do Carro (Hero)
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)}
                    className="hidden"
                    id="heroImage"
                    disabled={isUploading}
                  />
                  <label 
                    htmlFor="heroImage"
                    className={`flex items-center gap-2 px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-xl text-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-yellow-500'} transition-colors`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'A carregar...' : 'Selecionar Imagem'}</span>
                  </label>
                  {heroImageUrl && !isUploading && (
                    <span className="text-xs text-green-500 font-semibold truncate max-w-[150px]">Pronta para salvar!</span>
                  )}
                </div>
                
                {heroImageUrl && (
                  <div className="mt-4 p-2 bg-gray-900/80 rounded-lg border border-gray-700 inline-block">
                    <img src={heroImageUrl} alt="Hero" className="w-40 h-24 object-cover rounded" />
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={handleSaveHero}
                  disabled={isHeroSaving || isUploading}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-extrabold px-8 py-3 rounded-xl text-sm uppercase cursor-pointer disabled:opacity-50"
                >
                  {isHeroSaving ? 'A Guardar...' : (isUploading ? 'A Carregar...' : 'Salvar Alterações')}
                </button>
                {heroImageUrl && (
                  <button 
                    onClick={handleRemoveHero}
                    disabled={isHeroSaving}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold px-6 py-3 rounded-xl text-sm uppercase cursor-pointer disabled:opacity-50 border border-red-500/20"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
