import { useState, useEffect } from 'react';
import { AppForm } from '../../lib/supabase';
import { AlertCircle, Store, Building2, Smartphone } from 'lucide-react';

type Props = {
  form: AppForm;
  onSave: (updates: Partial<AppForm>) => Promise<void>;
};

export default function StoreOwnerSection({ form, onSave }: Props) {
  const [playStoreOwner, setPlayStoreOwner] = useState<'tilary' | 'client' | undefined>(form.play_store_owner);
  const [appStoreOwner, setAppStoreOwner] = useState<'tilary' | 'client' | undefined>(form.app_store_owner);
  const [saving, setSaving] = useState<'play' | 'app' | null>(null);

  useEffect(() => {
    setPlayStoreOwner(form.play_store_owner);
    setAppStoreOwner(form.app_store_owner);
  }, [form]);

  const handleSavePlayStore = async (value: 'tilary' | 'client') => {
    setSaving('play');
    try {
      await onSave({ play_store_owner: value });
      setPlayStoreOwner(value);
    } catch (error) {
      console.error('Error saving Play Store owner:', error);
    } finally {
      setSaving(null);
    }
  };

  const handleSaveAppStore = async (value: 'tilary' | 'client') => {
    setSaving('app');
    try {
      await onSave({ app_store_owner: value });
      setAppStoreOwner(value);
    } catch (error) {
      console.error('Error saving App Store owner:', error);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Publicação nas Lojas</h2>
        <p className="text-gray-600">
          Selecione onde cada aplicativo será publicado. Você pode escolher lojas diferentes para Android e iOS.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Google Play Store (Android)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleSavePlayStore('tilary')}
              disabled={saving === 'play'}
              className={`p-6 border-2 rounded-lg transition-all ${
                playStoreOwner === 'tilary'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-red-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <Store className="w-10 h-10" style={{ color: playStoreOwner === 'tilary' ? '#e40033' : '#9ca3af' }} />
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-1">
                    Conta da Tilary
                  </h4>
                  <p className="text-sm text-gray-600">
                    Publicar na Play Store da Tilary
                  </p>
                </div>
                {playStoreOwner === 'tilary' && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#e40033' }}>
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Selecionado</span>
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={() => handleSavePlayStore('client')}
              disabled={saving === 'play'}
              className={`p-6 border-2 rounded-lg transition-all ${
                playStoreOwner === 'client'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-red-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <Building2 className="w-10 h-10" style={{ color: playStoreOwner === 'client' ? '#e40033' : '#9ca3af' }} />
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-1">
                    Minha Conta
                  </h4>
                  <p className="text-sm text-gray-600">
                    Publicar na minha Play Store
                  </p>
                </div>
                {playStoreOwner === 'client' && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#e40033' }}>
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Selecionado</span>
                  </div>
                )}
              </div>
            </button>
          </div>

          {playStoreOwner === 'tilary' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-yellow-900 mb-1 text-sm">
                    Prazo de 6 meses
                  </h5>
                  <p className="text-sm text-yellow-800">
                    Você terá 6 meses para criar sua própria conta na Play Store. A Tilary fornecerá suporte para a transferência.
                  </p>
                </div>
              </div>
            </div>
          )}

          {playStoreOwner === 'client' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-blue-900 mb-1 text-sm">
                    Requisitos
                  </h5>
                  <p className="text-sm text-blue-800">
                    Conta de desenvolvedor ativa na Google Play Store (US$ 25 única vez) com acesso administrativo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="w-6 h-6 text-gray-700" />
            <h3 className="text-xl font-bold text-gray-900">Apple App Store (iOS)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleSaveAppStore('tilary')}
              disabled={saving === 'app'}
              className={`p-6 border-2 rounded-lg transition-all ${
                appStoreOwner === 'tilary'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-red-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <Store className="w-10 h-10" style={{ color: appStoreOwner === 'tilary' ? '#e40033' : '#9ca3af' }} />
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-1">
                    Conta da Tilary
                  </h4>
                  <p className="text-sm text-gray-600">
                    Publicar na App Store da Tilary
                  </p>
                </div>
                {appStoreOwner === 'tilary' && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#e40033' }}>
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Selecionado</span>
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={() => handleSaveAppStore('client')}
              disabled={saving === 'app'}
              className={`p-6 border-2 rounded-lg transition-all ${
                appStoreOwner === 'client'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-red-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <Building2 className="w-10 h-10" style={{ color: appStoreOwner === 'client' ? '#e40033' : '#9ca3af' }} />
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-1">
                    Minha Conta
                  </h4>
                  <p className="text-sm text-gray-600">
                    Publicar na minha App Store
                  </p>
                </div>
                {appStoreOwner === 'client' && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#e40033' }}>
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Selecionado</span>
                  </div>
                )}
              </div>
            </button>
          </div>

          {appStoreOwner === 'tilary' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-yellow-900 mb-1 text-sm">
                    Prazo de 6 meses
                  </h5>
                  <p className="text-sm text-yellow-800">
                    Você terá 6 meses para criar sua própria conta na App Store. A Tilary fornecerá suporte para a transferência.
                  </p>
                </div>
              </div>
            </div>
          )}

          {appStoreOwner === 'client' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-blue-900 mb-1 text-sm">
                    Requisitos
                  </h5>
                  <p className="text-sm text-blue-800">
                    Conta de desenvolvedor ativa na Apple App Store (US$ 99/ano) com acesso administrativo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {(playStoreOwner || appStoreOwner) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">
                Resumo da sua escolha:
              </h5>
              <ul className="text-sm text-gray-700 space-y-1">
                {playStoreOwner && (
                  <li>
                    <strong>Play Store:</strong> {playStoreOwner === 'tilary' ? 'Conta da Tilary' : 'Sua própria conta'}
                  </li>
                )}
                {appStoreOwner && (
                  <li>
                    <strong>App Store:</strong> {appStoreOwner === 'tilary' ? 'Conta da Tilary' : 'Sua própria conta'}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
