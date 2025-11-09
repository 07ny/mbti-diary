import React, { useState } from 'react';
import { BookOpen, UserPlus } from 'lucide-react';

interface RegisterProps {
  onSwitchToLogin: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, showToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    setError('');
    if (!email || !password || !confirmPassword) {
      setError('すべての項目を入力してください。');
      return;
    }
     if (!/\S+@\S+\.\S+/.test(email)) {
      setError('有効なメールアドレスを入力してください。');
      return;
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上で設定してください。');
      return;
    }
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('mbti-diary-users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);

      if (existingUser) {
        setError('このメールアドレスは既に使用されています。');
        return;
      }

      const newUser = { email, password };
      users.push(newUser);
      localStorage.setItem('mbti-diary-users', JSON.stringify(users));

      showToast('アカウント登録が完了しました！ログインしてください。', 'success');
      onSwitchToLogin();

    } catch (e) {
      setError('登録処理中にエラーが発生しました。');
      console.error(e);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleRegister();
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
          <p className="text-gray-600">新しいアカウントを作成</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email-reg" className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input
              id="email-reg"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password-reg" className="block text-sm font-medium text-gray-700">パスワード</label>
            <input
              id="password-reg"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
              placeholder="6文字以上"
              autoComplete="new-password"
            />
          </div>
           <div>
            <label htmlFor="confirm-password-reg" className="block text-sm font-medium text-gray-700">パスワード（確認用）</label>
            <input
              id="confirm-password-reg"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
              placeholder="もう一度入力"
              autoComplete="new-password"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center animate-fade-in">{error}</p>}

        <button
          onClick={handleRegister}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg transition-all duration-300"
        >
          <UserPlus className="w-5 h-5" />
          登録する
        </button>

        <p className="text-sm text-center text-gray-500">
          すでにアカウントをお持ちですか？{' '}
          <button onClick={onSwitchToLogin} className="font-medium text-rose-600 hover:underline">
            ログイン
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;