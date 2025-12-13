import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Key } from 'lucide-react';

export default function Login() {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithCode } = useAuth();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err) {
      setError('Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithCode(email, accessCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="mb-4">
            <h1 className="text-4xl sm:text-5xl font-bold" style={{ color: '#e40033' }}>TILARY</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Sistema de Gestão de Conteúdo</p>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            onClick={() => setIsAdminLogin(false)}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-md font-medium transition-all text-sm sm:text-base ${
              !isAdminLogin
                ? 'bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={!isAdminLogin ? { color: '#e40033' } : {}}
          >
            Cliente
          </button>
          <button
            onClick={() => setIsAdminLogin(true)}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-md font-medium transition-all text-sm sm:text-base ${
              isAdminLogin
                ? 'bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={isAdminLogin ? { color: '#e40033' } : {}}
          >
            Administrador
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {isAdminLogin ? (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ outlineColor: '#e40033' }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(228, 0, 51, 0.1)'}
                onBlur={(e) => e.target.style.boxShadow = ''}
                placeholder="admin@exemplo.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ outlineColor: '#e40033' }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(228, 0, 51, 0.1)'}
                onBlur={(e) => e.target.style.boxShadow = ''}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#e40033' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#c2002a')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#e40033')}
            >
              {loading ? 'Entrando...' : 'Entrar como Admin'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleClientLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ outlineColor: '#e40033' }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(228, 0, 51, 0.1)'}
                onBlur={(e) => e.target.style.boxShadow = ''}
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Key className="w-4 h-4" />
                Código de Acesso
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent font-mono"
                style={{ outlineColor: '#e40033' }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(228, 0, 51, 0.1)'}
                onBlur={(e) => e.target.style.boxShadow = ''}
                placeholder="ABC123XYZ"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#e40033' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#c2002a')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#e40033')}
            >
              {loading ? 'Verificando...' : 'Acessar Formulário'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
