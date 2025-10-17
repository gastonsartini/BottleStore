import Link from 'next/link';
import { MessageCircle, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">BottleStore</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Tu tienda de confianza para botellas de agua premium. Mantente hidratado con estilo.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Productos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link href="/productos?category=botellas-metalicas" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Botellas Metálicas
                </Link>
              </li>
              <li>
                <Link href="/productos?category=botellas-plasticas" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Botellas Plásticas
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Ayuda</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ayuda/envios" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Envíos y Entregas
                </Link>
              </li>
              <li>
                <Link href="/ayuda/cambios" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Cambios y Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/ayuda/preguntas-frecuentes" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terminos" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/defensa-consumidor" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Defensa del Consumidor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} BottleStore. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
