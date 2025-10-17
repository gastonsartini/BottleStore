'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SetupPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [existingAdmins, setExistingAdmins] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    checkExistingAdmins();
  }, []);

  const checkExistingAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*');
      
      if (data) {
        setExistingAdmins(data);
        console.log('🔍 Existing admins:', data);
      }
    } catch (error) {
      console.error('Error checking admins:', error);
    }
  };

  const createAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/setup-admin', {
        method: 'POST',
      });
      const data = await response.json();
      setResult(data);
      if (data.success) {
        checkExistingAdmins();
      }
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

          {existingAdmins.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-900 mb-2">
                Usuarios administradores existentes:
              </p>
              {existingAdmins.map((admin, index) => (
                <p key={index} className="text-sm text-green-700 font-mono">
                  {admin.email} (ID: {admin.id})
                </p>
              ))}
            </div>
          )}

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

          <button
            onClick={checkExistingAdmins}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Verificar Usuarios Existentes
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
              {result.userId && (
                <p className="text-xs mt-2 font-mono">
                  User ID: {result.userId}
                </p>
              )}
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
