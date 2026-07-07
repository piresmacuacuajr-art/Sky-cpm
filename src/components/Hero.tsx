import { Zap, ShieldCheck, Headphones } from 'lucide-react';

export default function Hero({ heroImage }: { heroImage: string | null }) {
  return (
    <section className="bg-black text-white py-16">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tighter">
            <span className="text-yellow-500">VENDA DE</span><br />
            COINS, DINHEIRO <br /> E GAME GUARDIAN
          </h1>
          <p className="mb-8 text-lg text-gray-400 leading-relaxed">
            Bem-vindo à SKY DZIMBA CPM! Aqui você encontra coins, dinheiro e contas para o Car Parking Multiplayer com entrega rápida e suporte garantido.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: Zap, label: 'ENTREGA RÁPIDA' },
              { icon: ShieldCheck, label: '100% SEGURO' },
              { icon: Headphones, label: 'SUPORTE 24H' },
            ].map((feature) => (
              <div key={feature.label} className="flex flex-col items-center gap-2 p-3 bg-gray-900 rounded-lg border border-yellow-500/20 hover:border-yellow-500/50 transition-colors">
                <feature.icon className="text-yellow-500 w-6 h-6" />
                <span className="text-[10px] font-bold uppercase text-center tracking-wider">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-gray-900 rounded-2xl p-2 h-96 flex items-center justify-center overflow-hidden border border-gray-800 shadow-2xl shadow-yellow-500/10">
            {heroImage ? (
              <img src={heroImage} key={heroImage} alt="Car and Money" className="w-full h-full object-contain rounded-xl" />
            ) : (
              <span className="text-gray-500">Imagem do Hero</span>
            )}
          </div>
          <p className="text-center text-yellow-500 font-bold text-lg uppercase tracking-widest">Car Parking</p>
        </div>
      </div>
    </section>
  );
}
