import React, { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Calendar as CalendarIcon, BarChart3, LogOut } from 'lucide-react';
import { Entry, ActiveTab, Toast } from './types';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
import CalendarView from './components/CalendarView';
import DiaryModal from './components/DiaryModal';
import Login from './components/Login';
import Register from './components/Register';

export default function MBTIDiaryApp() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('calendar');
  const [toast, setToast] = useState<Toast | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('mbti-diary-currentUser');
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      try {
        const savedEntries = localStorage.getItem(`mbti-diary-entries-${currentUser}`);
        if (savedEntries) {
          setEntries(JSON.parse(savedEntries));
        } else {
          setEntries([]); // ユーザーの初回ログイン時は空
        }
      } catch (error) {
        console.error("Failed to load entries from localStorage", error);
        setEntries([]);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
        try {
          localStorage.setItem(`mbti-diary-entries-${currentUser}`, JSON.stringify(entries));
        } catch (error) {
          console.error("Failed to save entries to localStorage", error);
        }
    }
  }, [entries, currentUser]);

  const handleLogin = (email: string) => {
    localStorage.setItem('mbti-diary-currentUser', email);
    setCurrentUser(email);
    showToast('ログインしました！', 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('mbti-diary-currentUser');
    setCurrentUser(null);
    setEntries([]); // Clear entries from state on logout
    showToast('ログアウトしました', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const newToast = { id: Date.now(), message, type };
    setToast(newToast);
    setTimeout(() => setToast(null), 3000);
  };
  
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  }

  const handleSaveEntry = (entryToSave: Entry) => {
    const existingIndex = entries.findIndex(e => e.id === entryToSave.id);
    if (existingIndex > -1) {
      const updatedEntries = [...entries];
      updatedEntries[existingIndex] = entryToSave;
      setEntries(updatedEntries);
    } else {
      setEntries([entryToSave, ...entries].sort((a, b) => b.date.localeCompare(a.date)));
    }
    handleCloseModal();
  };
  
  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    showToast('日記を削除しました', 'success');
    handleCloseModal();
  };

  const TABS = [
    { id: 'calendar', label: 'カレンダー', icon: <CalendarIcon className="w-5 h-5 sm:w-4 sm:h-4" /> },
    { id: 'dashboard', label: 'ダッシュボード', icon: <BarChart3 className="w-5 h-5 sm:w-4 sm:h-4" /> },
    { id: 'analysis', label: '分析結果', icon: <TrendingUp className="w-5 h-5 sm:w-4 sm:h-4" /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarView entries={entries} onDateClick={handleDateClick} />;
      case 'dashboard':
        return <Dashboard entries={entries} />;
      case 'analysis':
        return <Analysis entries={entries} />;
      default:
        return <CalendarView entries={entries} onDateClick={handleDateClick} />;
    }
  };

  const selectedEntry = selectedDate ? entries.find(e => e.date === selectedDate) || null : null;

  if (!currentUser) {
    if (authView === 'login') {
      return <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />;
    } else {
      return <Register onSwitchToLogin={() => setAuthView('login')} showToast={showToast} />;
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 p-4 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 relative">
           <button 
            onClick={handleLogout}
            className="absolute top-2 right-2 flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white/80 hover:bg-rose-100 rounded-lg shadow-sm border border-orange-100 transition-colors z-20"
            aria-label="ログアウト"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">ログアウト</span>
          </button>
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-rose-500" />
            <h1 className="text-4xl font-bold text-rose-800 tracking-tight">日記MBTI</h1>
          </div>
          <p className="text-gray-700">
            日記からあなたのMBTI傾向を分析し、性格の変化を時系列で追跡します 📖
          </p>
        </header>

        {toast && (
          <div className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white z-50 animate-fade-in-down`}>
            {toast.message}
          </div>
        )}

        <nav className="bg-white/90 backdrop-blur-sm border border-orange-100 shadow-sm rounded-lg mb-6 sticky top-4 z-10">
          <div className="grid grid-cols-3 gap-1 p-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md transition-all text-xs sm:text-sm font-semibold ${
                  activeTab === tab.id
                    ? 'bg-rose-500 text-white shadow'
                    : 'text-gray-700 hover:bg-rose-100'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <main>
          {renderContent()}
        </main>
      </div>

      <DiaryModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        date={selectedDate}
        entry={selectedEntry}
        onSave={handleSaveEntry}
        onDelete={handleDeleteEntry}
        showToast={showToast}
      />
    </div>
  );
}