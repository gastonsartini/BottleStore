'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const createAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/setup-admin', {
        method: 'POST',
      });
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Configuración Inicial
        </h1>

        <div className="space-y-4">
          <p className="text-gray-600">
            Haz clic en el botón para crear el usuario administrador.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              Credenciales del administrador:
            </p>
            <p className="text-sm text-blue-700 font-mono">
              Email: admin@bottlestore.com
            </p>
            <p className="text-sm text-blue-700 font-mono">
              Contraseña: Cochabamba321
            </p>
          </div>

          <button
            onClick={createAdmin}
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Creando usuario...' : 'Crear Usuario Admin'}
          </button>

          {result && (
            <div className={`p-4 rounded-lg ${
              result.error
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}>
              <p className="text-sm font-semibold mb-1">
                {result.error ? 'Error' : 'Éxito'}
              </p>
              <p className="text-sm">
                {result.error || result.message}
              </p>
              {result.success && (
                <button
                  onClick={() => router.push('/login')}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Ir a Login
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Esta página es solo para la configuración inicial. Puedes eliminarla después de crear el usuario.
          </p>
        </div>
      </div>
    </div>
  );
}
