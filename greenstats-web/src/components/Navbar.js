"use client";
import Link from 'next/link';
import { Search, User, Menu, X, Zap, LogOut } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'Giới thiệu', key: 'home' },
  { href: '/explore', label: 'KHÁM PHÁ', key: 'explore' },
  { href: '/destinations', label: 'ĐIỂM ĐẾN', key: 'destinations' },
  { href: '/spin', label: 'Vòng quay', key: 'spin' },
  { href: '/contact', label: 'Liên hệ', key: 'contact' },
];

const LOGO_SVG = (
  <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-500">
    <path d="M48 40C45 38 40 38 35 43C32 46 32 50 35 55C38 60 45 65 52 65C60 65 65 60 68 55C70 52 70 48 68 45" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
    <path d="M48 40L40 25M68 45L75 30" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
    <path d="M20 50C20 30 35 15 50 15C65 15 80 30 80 50C80 70 65 85 50 85C35 85 20 70 20 50Z" stroke="#4ade80" strokeWidth="4" strokeDasharray="15 5" />
    <path d="M50 15C60 15 75 25 80 40M80 60C75 75 60 85 50 85M20 50C20 65 35 85 50 85M50 15C35 15 20 35 20 50" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
    <path d="M85 45C85 35 75 25 65 25" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" />
    <path d="M15 55C15 65 25 75 35 75" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" />
    <circle cx="39" cy="48" r="1.5" fill="#34d399" />
  </svg>
);

const Navbar = ({ active = 'home', user = null, spinsLeft = 0, onLogin = null, onLogout = null }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 md:px-16">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <Link href="/">
            <div className="relative">
              <div className="absolute -inset-3 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative p-1.5 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl backdrop-blur-md transition-all duration-500 group-hover:border-emerald-500/50 group-hover:scale-110 flex items-center justify-center shadow-xl">
                {LOGO_SVG}
              </div>
            </div>
          </Link>
          <Link href="/">
            <div className="flex items-center transition-all duration-500 group-hover:tracking-wider">
              <span className="text-[16px] font-black uppercase tracking-tight text-white drop-shadow-md">Green</span>
              <span className="text-[16px] font-extrabold uppercase tracking-tight text-emerald-500 drop-shadow-md">Stats</span>
            </div>
          </Link>
        </div>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-8 text-[9px] font-semibold tracking-[0.2em] uppercase opacity-70 font-poppins">
          {NAV_ITEMS.map(item => (
            <li key={item.key} className="hover:text-emerald-400 cursor-pointer transition-colors">
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>

        {/* Icons / Auth */}
        <div className="flex items-center gap-5">
          {user ? (
            <div className="flex items-center gap-2 md:gap-3 bg-white/5 px-3 py-1.5 md:px-4 rounded-full border border-white/10 shadow-xl">
              <span className="text-[10px] md:text-xs font-black text-emerald-400 uppercase whitespace-nowrap">{spinsLeft} Lượt</span>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-emerald-500/30 overflow-hidden shrink-0">
                <img src={user.user_metadata?.avatar_url} className="w-full h-full object-cover" alt="avatar" />
              </div>
              {onLogout && (
                <button onClick={onLogout} className="p-1 md:p-1.5 hover:text-red-500 transition-colors" title="Đăng xuất">
                  <LogOut size={14} className="md:w-[16px] md:h-[16px]" />
                </button>
              )}
            </div>
          ) : onLogin ? (
            <button onClick={onLogin} className="px-5 py-2 md:px-6 bg-emerald-500 text-black font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-full hover:scale-105 transition-all whitespace-nowrap">Đăng nhập</button>
          ) : (
            <>
              <Search size={16} className="hover:text-emerald-400 cursor-pointer transition-colors" />
              <User size={16} className="hover:text-emerald-400 cursor-pointer transition-colors" />
            </>
          )}
          <Menu size={18} className="lg:hidden text-white cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => setIsOpen(true)} />
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in-mobile">
          <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 p-3 text-white/50 hover:text-white transition-colors">
            <X size={32} strokeWidth={1.5} />
          </button>
          <ul className="flex flex-col items-center gap-10 text-xl font-bold tracking-[0.2em] uppercase font-poppins">
            {NAV_ITEMS.map(item => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-emerald-400 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .font-poppins { font-family: var(--font-poppins), sans-serif; }
        @keyframes fadeInMobile { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-mobile { animation: fadeInMobile 0.4s ease-out forwards; }
      `}</style>
    </>
  );
};

export default Navbar;
