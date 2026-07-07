import { Zap, ShieldCheck, Headphones, Eye } from 'lucide-react';

export default function Footer({ onAdminClick }: { onAdminClick: () => void }) {
  return (
    <footer className="bg-black text-white p-8 border-t border-gray-700">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-bold text-yellow-500 mb-4">SKY DZIMBA CPM</h3>
        </div>
        <div>
          <h4 className="font-bold mb-2">CONTATO</h4>
          <p>WhatsApp: 835280672</p>
          <p>E-mail: gersondzimba45@gmail.com</p>
        </div>
      </div>
      
      <div className="container mx-auto pt-8 border-t border-gray-700 flex flex-wrap justify-center gap-8 mb-8 text-sm">
        <div className="flex items-center gap-2"><Zap className="text-yellow-500" /> Entrega Rápida</div>
        <div className="flex items-center gap-2"><ShieldCheck className="text-yellow-500" /> 100% Seguro</div>
        <div className="flex items-center gap-2"><Headphones className="text-yellow-500" /> Suporte 24h</div>
      </div>

      <div className="container mx-auto pt-8 border-t border-gray-700 text-center text-sm text-gray-500 flex justify-center items-center gap-2">
        <span>© 2026 SKY DZIMBA CPM. Todos os direitos reservados.</span>
        <button 
          onClick={onAdminClick} 
          className="p-1.5 rounded-full cursor-pointer text-gray-600 hover:text-yellow-500 hover:bg-gray-800/60 transition-all"
          title="Acesso Administrador"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
