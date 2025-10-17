'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Store, CreditCard, Truck, Save } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface StoreSettings {
  id: string;
  store_name: string;
  store_email: string;
  store_phone: string;
  store_address: string;
  currency: string;
  tax_rate: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  instructions: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  enabled: boolean;
  estimated_days: string;
}

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'payments' | 'shipping'>('general');
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const [settingsRes, paymentsRes, shippingRes] = await Promise.all([
      supabase.from('store_settings').select('*').maybeSingle(),
      supabase.from('payment_methods').select('*').order('name'),
      supabase.from('shipping_methods').select('*').order('name')
    ]);

    if (settingsRes.data) setStoreSettings(settingsRes.data);
    if (paymentsRes.data) setPaymentMethods(paymentsRes.data);
    if (shippingRes.data) setShippingMethods(shippingRes.data);

    setLoading(false);
  };

  const saveStoreSettings = async () => {
    if (!storeSettings) return;

    setSaving(true);
    const { error } = await supabase
      .from('store_settings')
      .update({
        store_name: storeSettings.store_name,
        store_email: storeSettings.store_email,
        store_phone: storeSettings.store_phone,
        store_address: storeSettings.store_address,
        currency: storeSettings.currency,
        tax_rate: storeSettings.tax_rate,
        updated_at: new Date().toISOString()
      })
      .eq('id', storeSettings.id);

    if (!error) {
      alert('Configuración guardada correctamente');
    }
    setSaving(false);
  };

  const togglePaymentMethod = async (id: string, enabled: boolean) => {
    await supabase
      .from('payment_methods')
      .update({ enabled })
      .eq('id', id);

    setPaymentMethods(prev =>
      prev.map(pm => pm.id === id ? { ...pm, enabled } : pm)
    );
  };

  const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>) => {
    await supabase
      .from('payment_methods')
      .update(updates)
      .eq('id', id);

    setPaymentMethods(prev =>
      prev.map(pm => pm.id === id ? { ...pm, ...updates } : pm)
    );
  };

  const toggleShippingMethod = async (id: string, enabled: boolean) => {
    await supabase
      .from('shipping_methods')
      .update({ enabled })
      .eq('id', id);

    setShippingMethods(prev =>
      prev.map(sm => sm.id === id ? { ...sm, enabled } : sm)
    );
  };

  const updateShippingMethod = async (id: string, updates: Partial<ShippingMethod>) => {
    await supabase
      .from('shipping_methods')
      .update(updates)
      .eq('id', id);

    setShippingMethods(prev =>
      prev.map(sm => sm.id === id ? { ...sm, ...updates } : sm)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Cargando configuración...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Configuración de la Tienda</h1>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-4 px-1 border-b-2 font-medium transition ${
              activeTab === 'general'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Store className="w-5 h-5 inline mr-2" />
            General
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-4 px-1 border-b-2 font-medium transition ${
              activeTab === 'payments'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CreditCard className="w-5 h-5 inline mr-2" />
            Medios de Pago
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-4 px-1 border-b-2 font-medium transition ${
              activeTab === 'shipping'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Truck className="w-5 h-5 inline mr-2" />
            Métodos de Envío
          </button>
        </nav>
      </div>

      {activeTab === 'general' && storeSettings && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Información General</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Tienda
              </label>
              <input
                type="text"
                value={storeSettings.store_name}
                onChange={(e) => setStoreSettings({ ...storeSettings, store_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de Contacto
              </label>
              <input
                type="email"
                value={storeSettings.store_email || ''}
                onChange={(e) => setStoreSettings({ ...storeSettings, store_email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={storeSettings.store_phone || ''}
                onChange={(e) => setStoreSettings({ ...storeSettings, store_phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <textarea
                value={storeSettings.store_address || ''}
                onChange={(e) => setStoreSettings({ ...storeSettings, store_address: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda
                </label>
                <input
                  type="text"
                  value={storeSettings.currency}
                  onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tasa de IVA (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={storeSettings.tax_rate}
                  onChange={(e) => setStoreSettings({ ...storeSettings, tax_rate: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              onClick={saveStoreSettings}
              disabled={saving}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={method.enabled}
                      onChange={(e) => togglePaymentMethod(method.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <span className="text-sm text-gray-500 capitalize">{method.type}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instrucciones
                  </label>
                  <textarea
                    value={method.instructions || ''}
                    onChange={(e) => updatePaymentMethod(method.id, { instructions: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Instrucciones para el cliente..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'shipping' && (
        <div className="space-y-4">
          {shippingMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={method.enabled}
                      onChange={(e) => toggleShippingMethod(method.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={method.description || ''}
                    onChange={(e) => updateShippingMethod(method.id, { description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={method.price}
                    onChange={(e) => updateShippingMethod(method.id, { price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo Estimado
                  </label>
                  <input
                    type="text"
                    value={method.estimated_days || ''}
                    onChange={(e) => updateShippingMethod(method.id, { estimated_days: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="ej: 2-3 días"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
