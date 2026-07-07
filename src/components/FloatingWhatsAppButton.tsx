
export default function FloatingWhatsAppButton() {
  return (
    <a
      href="https://wa.me/258835280672?text=Ol%C3%A1%2C%20gostaria%20de%20obter%20informa%C3%A7%C3%B5es."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 z-50"
      aria-label="Chamar no WhatsApp"
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-8 h-8" />
    </a>
  );
}
