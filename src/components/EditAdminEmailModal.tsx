import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, X } from 'lucide-react';

interface EditAdminEmailModalProps {
  adminId: string;
  adminName: string;
  currentEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditAdminEmailModal({ adminId, adminName, currentEmail, onClose, onSuccess }: EditAdminEmailModalProps) {
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newEmail !== confirmEmail) {
      setError('Os emails não coincidem');
      return;
    }

    if (!newEmail.includes('@')) {
      setError('Digite um email válido');
      return;
    }

    if (newEmail === currentEmail) {
      setError('O novo email deve ser diferente do atual');
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-admin-email`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId,
          newEmail,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao atualizar email');
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error updating email:', err);
      setError(err.message || 'Erro ao atualizar email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Alterar Email</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Administrador:</strong> {adminName}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              <strong>Email atual:</strong> {currentEmail}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Novo Email
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="novo@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Novo Email
            </label>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="novo@email.com"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              style={!loading ? { backgroundColor: '#e40033' } : {}}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#c2002a')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#e40033')}
            >
              {loading ? 'Salvando...' : 'Salvar Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
