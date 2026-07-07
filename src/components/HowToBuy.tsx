import { ShoppingCart, MessageCircle, CreditCard, CheckCircle } from 'lucide-react';

export default function HowToBuy() {
  const steps = [
    { icon: ShoppingCart, text: 'ESCOLHA o produto' },
    { icon: MessageCircle, text: 'ENTRE EM CONTATO pelo WhatsApp' },
    { icon: CreditCard, text: 'FAÇA O PAGAMENTO de forma segura' },
    { icon: CheckCircle, text: 'RECEBA SEU PRODUTO rapidamente' },
  ];

  return (
    <section className="bg-black py-16 text-white border-t border-gray-700">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-yellow-500">COMO COMPRAR</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <step.icon size={48} className="text-yellow-500 mb-4" />
              <p className="font-bold">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
