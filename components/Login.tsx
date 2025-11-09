import React, { useState } from 'react';
import { BookOpen, LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginAttempt = () => {
    try {
      const users = JSON.parse(localStorage.getItem('mbti-diary-users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        onLogin(email);
      } else {
        setError('メールアドレスまたはパスワードが正しくありません。');
      }
    } catch (e) {
      setError('ログイン処理中にエラーが発生しました。');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLoginAttempt();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-orange-100 animate-fade-in">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-rose-500" />
            <h1 className="text-4xl font-bold text-rose-800 tracking-tight">日記MBTI</h1>
          </div>
          <p className="text-gray-600">ログインして分析を始めましょう</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
              placeholder="メールアドレス"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password-input" className="block text-sm font-medium text-gray-700">パスワード</label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
              placeholder="パスワード"
              autoComplete="current-password"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center animate-fade-in">{error}</p>}

        <button
          onClick={handleLoginAttempt}
          disabled={!email || !password}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
        >
          <LogIn className="w-5 h-5" />
          ログイン
        </button>

        <p className="text-sm text-center text-gray-500">
          アカウントをお持ちでないですか？{' '}
          <button onClick={onSwitchToRegister} className="font-medium text-rose-600 hover:underline">
            新規登録
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;