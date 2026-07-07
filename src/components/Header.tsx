import { MessageCircle, Sun, Moon, Eye } from 'lucide-react';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import TimeDisplay from './TimeDisplay';

export default function Header({ onAdminClick }: { onAdminClick: () => void }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className={`p-4 border-b ${theme === 'dark' ? 'bg-black text-white border-yellow-600' : 'bg-white text-black border-gray-300'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={onAdminClick} 
            className="p-1 rounded-full cursor-pointer text-gray-400 hover:text-yellow-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
            title="Acesso Administrador"
          >
            <Eye className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <img src="/logo.jpg" alt="Sky Dzimba CPM Logo" className="h-16 w-64 object-contain border border-yellow-500/30 shadow-lg shadow-yellow-500/10" referrerPolicy="no-referrer" />
            <TimeDisplay />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex space-x-6 text-sm">
            <a href="#" className="hover:text-yellow-500">INÍCIO</a>
            <a href="#" className="hover:text-yellow-500">PRODUTOS</a>
            <a href="#" className="hover:text-yellow-500">COMO COMPRAR</a>
            <a href="#" className="hover:text-yellow-500">CONTATO</a>
            <a href="#" className="hover:text-yellow-500">SOBRE NÓS</a>
          </nav>
          <a
            href="https://wa.me/258835280672?text=Ol%C3%A1%2C%20gostaria%20de%20obter%20informa%C3%A7%C3%B5es."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase"
          >
            <MessageCircle className="w-4 h-4" />
            CHAMAR NO WHATSAPP
          </a>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
