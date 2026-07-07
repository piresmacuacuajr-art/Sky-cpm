/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import HowToBuy from './components/HowToBuy';
import Footer from './components/Footer';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import AdminPanel from './components/AdminPanel';
import { collection, onSnapshot, query, doc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { useContext } from 'react';

function AppContent({ isAdminOpen, setIsAdminOpen, products, heroImage }: any) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-white text-gray-900'}`}>
      <Header onAdminClick={() => setIsAdminOpen(true)} />
      <Hero heroImage={heroImage} />
      <Products />
      <HowToBuy />
      <Footer onAdminClick={() => setIsAdminOpen(true)} />
      <FloatingWhatsAppButton />
      {isAdminOpen && <AdminPanel products={products} onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'hero');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      console.log('Hero doc update received in App.tsx:', docSnap.exists() ? docSnap.data() : 'Deleted');
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Hero doc data:', data);
        setHeroImage(data?.imageUrl && data.imageUrl !== "" ? data.imageUrl : null);
      } else {
        setHeroImage(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <AppContent isAdminOpen={isAdminOpen} setIsAdminOpen={setIsAdminOpen} products={products} heroImage={heroImage} />
    </ThemeProvider>
  );
}
