import { useEffect, useState, useContext } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ThemeContext } from '../context/ThemeContext';
import { Coins, Banknote, Car, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  category: string;
  purchaseUrl?: string;
}

const categoryConfig: { [key: string]: { icon: any } } = {
  'COINS CPM': { icon: Coins },
  'DINHEIRO CPM': { icon: Banknote },
  'GAME GUARDIAN': { icon: Car },
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    });
    return () => unsubscribe();
  }, []);

  const categories = ['COINS CPM', 'DINHEIRO CPM', 'GAME GUARDIAN'];
  const isDark = theme === 'dark';

  return (
    <section className={`py-16 ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-4xl font-extrabold text-center mb-12 tracking-tighter ${isDark ? 'text-white' : 'text-gray-950'}`}>NOSSOS PRODUTOS</h2>
        
        <div className="mb-12 flex justify-center">
          <div className={`relative w-full max-w-md flex items-center`}>
            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800 text-white focus:border-yellow-500' : 'bg-white border-gray-300 text-gray-900 focus:border-yellow-700'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map(category => {
            const Config = categoryConfig[category];
            const Icon = Config ? Config.icon : Coins;
            return (
              <div key={category} className={`p-8 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${isDark ? 'bg-gray-900 border-gray-800 shadow-xl' : 'bg-white border-gray-200 shadow-lg'}`}>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className={`p-3 rounded-full ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-100'}`}>
                    <Icon className={`w-8 h-8 ${isDark ? 'text-yellow-500' : 'text-yellow-700'}`} />
                  </div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{category}</h3>
                </div>
                <ul className="space-y-4">
                  {products
                    .filter(p => {
                      const matchesCategory = p.category === category || (category === 'GAME GUARDIAN' && p.category === 'CONTAS CPM');
                      return matchesCategory && p.name.toLowerCase().includes(searchTerm.toLowerCase());
                    })
                    .map(product => (
                    <li key={product.id} className="flex justify-between items-center text-sm">
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{product.name} - <span className="font-bold text-yellow-500">{product.price} MZM</span></span>
                      <a 
                        href={category === 'GAME GUARDIAN' || product.category === 'CONTAS CPM' ? 'https://checkout.escalepay.com/9308698' : (product.purchaseUrl || `https://wa.me/258835280672?text=${encodeURIComponent(`Olá, gostaria de comprar ${product.name} ${category}`)}`)}
                        target="_blank" 
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all hover:brightness-110 ${category === 'GAME GUARDIAN' || product.purchaseUrl 
                          ? 'bg-yellow-600 text-white' 
                          : 'bg-green-600 text-white'}`}
                      >
                        COMPRAR AGORA
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
