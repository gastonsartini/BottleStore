'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('Credenciales incorrectas');
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log('🔍 Checking admin permissions for user:', data.user.id);
        console.log('🔍 User email:', data.user.email);
        
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        console.log('🔍 Admin query result:', { adminData, adminError });
        
        // Also check by email as fallback
        if (!adminData && !adminError) {
          console.log('🔍 No admin found by ID, checking by email...');
          const { data: adminByEmail, error: emailError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', data.user.email)
            .maybeSingle();
          
          console.log('🔍 Admin by email result:', { adminByEmail, emailError });
          
          if (adminByEmail && !emailError) {
            // Update the admin_users record with the correct user ID
            const { error: updateError } = await supabase
              .from('admin_users')
              .update({ id: data.user.id })
              .eq('email', data.user.email);
            
            if (!updateError) {
              console.log('✅ Updated admin user ID');
              router.push('/admin');
              router.refresh();
              return;
            }
          }
        }

        if (!adminData) {
          console.log('❌ No admin permissions found');
          await supabase.auth.signOut();
          setError('No tienes permisos de administrador. Si eres el administrador, ve a /setup para crear el usuario admin.');
          setLoading(false);
          return;
        }

        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="admin@bottlestore.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Volver a la tienda
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Usuario demo:</p>
          <p className="font-mono mt-1">admin@bottlestore.com</p>
          <p className="font-mono">Cochabamba321</p>
        </div>
      </div>
    </div>
  );
}
