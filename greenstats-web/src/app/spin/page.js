"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  User, RotateCw, Trophy, X, Zap, Loader2, Phone, Shield, Activity, LogOut, Menu
} from 'lucide-react';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(0); 

  // --- CẤU HÌNH LOGO THẬT ---
  const brandLogos = {
    chatgpt: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    spotify: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    youtube: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
    netflix: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    canva: "https://upload.wikimedia.org/wikipedia/en/thumb/b/bb/Canva_Logo.svg/960px-Canva_Logo.svg.png",
    eco: "https://images.vexels.com/media/users/3/207136/isolated/preview/dc6980a67acd5e2d4a13bc446e9e3378-green-leaf-big-icon.png"
  };

  const wheelSlices = [
    { name: 'ChatGPT Plus', logo: brandLogos.chatgpt, color: 'rgba(16, 185, 129, 0.3)' },
    { name: 'Sống Xanh', logo: brandLogos.eco, color: 'rgba(255, 255, 255, 0.05)' },
    { name: 'Spotify Premium', logo: brandLogos.spotify, color: 'rgba(16, 185, 129, 0.2)' },
    { name: 'Sống Xanh', logo: brandLogos.eco, color: 'rgba(255, 255, 255, 0.05)' },
    { name: 'YouTube Premium', logo: brandLogos.youtube, color: 'rgba(16, 185, 129, 0.3)' },
    { name: 'Sống Xanh', logo: brandLogos.eco, color: 'rgba(255, 255, 255, 0.05)' },
    { name: 'Netflix 4K', logo: brandLogos.netflix, color: 'rgba(16, 185, 129, 0.2)' },
    { name: 'Sống Xanh', logo: brandLogos.eco, color: 'rgba(255, 255, 255, 0.05)' },
    { name: 'Canva Pro', logo: brandLogos.canva, color: 'rgba(16, 185, 129, 0.3)' },
    { name: 'Sống Xanh', logo: brandLogos.eco, color: 'rgba(255, 255, 255, 0.05)' },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const { data: profile } = await supabase.from('profiles')
          .select('spins_available')
          .eq('email', authUser.email.toLowerCase())
          .single();
        if (profile) setSpinsLeft(profile.spins_available);
      }
    } catch (err) { console.error("Sync error:", err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // LOGIC ĐĂNG XUẤT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Tải lại trang để cập nhật trạng thái
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/spin` }
    });
  };

  const spinWheel = async () => {
    if (isSpinning || !user || spinsLeft <= 0) return;
    setIsSpinning(true);
    setWinner(null);

    try {
      const res = await fetch('/api/spin', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email: user.email.toLowerCase().trim() }) 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 1. ÉP KIM QUAY (Tuyệt đối chặn Netflix/Canva/YouTube/ChatGPT)
      let targetIndex;
      if (data.prizeName.toLowerCase().includes('spotify')) {
        targetIndex = 2; // Chỉ dừng ở ô Spotify
      } else {
        // Nếu trượt hoặc Backend báo trúng các giải mồi khác
        // ÉP kim vào các ô Sống Xanh (Các Index lẻ: 1, 3, 5, 7, 9)
        const ecoIndices = [1, 3, 5, 7, 9];
        targetIndex = ecoIndices[Math.floor(Math.random() * ecoIndices.length)];
      }

      // 2. LOGIC RESET ẢO (Đưa math về 0 trước khi quay tiếp)
      const sliceAngle = 36; 
      const margin = -1.5;           // Lùi tối thiểu 1.5 độ từ vách ngăn
      const jitter = -(Math.random() * 1.5); // Độ nhiễu âm (0 đến -1.5 độ) để dừng không trùng lặp

      // 2. Random chọn mút: Đầu ô hoặc Cuối ô
      // isNearStart = true: Kim vừa mới chớm vào ô
      // isNearStart = false: Kim sắp chạy ra khỏi ô (sát vách ô tiếp theo)
      const isNearStart = Math.random() > 0.5;

      const ultraCloseOffset = isNearStart 
        ? (margin + jitter)                         // Ví dụ: -1.5 đến -3.0 độ (Mút trên)
        : (margin + jitter - (sliceAngle - 4));     // Ví dụ: -33.5 đến -35.0 độ (Mút dưới)

      // 3. Áp dụng vào công thức Reset ảo (Chống lệch 100%)
      const currentExtraDegrees = rotation % 360; 
      const angleToTarget = (360 - (targetIndex * sliceAngle));
      
      // Công thức: Vị trí cũ + bù vòng tròn + tới ô trúng + lùi âm vào mút + 10 vòng quay
      const finalRotation = rotation + (360 - currentExtraDegrees) + angleToTarget + ultraCloseOffset + (360 * 10);

      setRotation(finalRotation);
      // 4. THỜI GIAN: Quay 3.9s + Nghỉ 1s = 4.9s hiện Modal
      setTimeout(() => {
        setIsSpinning(false);
        setSpinsLeft(data.spinsLeft);
        setWinner({ text: data.prizeName, isWin: data.type === 'REAL' });
        setShowModal(true);
      }, 8.9 * 1000); // 8.9s để đảm bảo hết hẳn hiệu ứng quay và có thời gian nghỉ ngơi trước khi hiện modal

    } catch (err) {
      setIsSpinning(false);
      alert(err.message);
      fetchData();
    }
  };

  return (
    <div className="relative min-h-screen w-full font-tnr text-white overflow-hidden flex flex-col bg-black">
      
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105">
          <source src="https://sjv1f6z76labxq2f.public.blob.vercel-storage.com/7661844536024.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>

      {/* NAVBAR NÂNG CẤP */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/40 transition-all"><Zap size={24} className="text-emerald-400" /></div>
          <div className="font-black uppercase tracking-tighter text-2xl italic">Green<span className="text-emerald-400">Stats</span></div>
        </Link>

        {/* Menu giữa */}
        <ul className="hidden lg:flex items-center gap-8 text-[9px] font-semibold tracking-[0.2em] uppercase opacity-70 font-poppins">
  {/* Đã thêm Link và italic, bỏ gạch chân */}
  <li className="hover:text-emerald-400 cursor-pointer transition-colors">
    <Link href="/">Giới thiệu</Link>
  </li>
  
  {/* Đã thêm italic và mang gạch chân xuống đây vì đang ở trang Điểm Đến */}
  <li className="hover:text-emerald-400 cursor-pointer transition-colors ">
    <Link href="/destinations">ĐIỂM ĐẾN</Link>
  </li>
  
  {/* Đã thêm italic */}
  <li className="hover:text-emerald-400 cursor-pointer transition-colors border-b border-emerald-500 pb-1">
    <Link href="/spin">Vòng quay</Link>
  </li>
  
  {/* Đã thêm italic */}
  <li className="hover:text-emerald-400 cursor-pointer transition-colors">
    <Link href="/contact">Liên hệ</Link>
  </li>
</ul>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 shadow-xl">
              <span className="text-xs font-black text-emerald-400 uppercase hidden sm:block">{spinsLeft} Lượt Quay</span>
              <div className="w-8 h-8 rounded-full border border-emerald-500/30 overflow-hidden">
                <img src={user.user_metadata?.avatar_url} className="w-full h-full object-cover" alt="avatar" />
              </div>
              <button onClick={handleLogout} className="p-1.5 hover:text-red-500 transition-colors" title="Đăng xuất">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="px-6 py-2 bg-emerald-500 text-black font-black uppercase text-[10px] tracking-widest rounded-full hover:scale-105 transition-all">Đăng nhập</button>
          )}
          <Menu className="lg:hidden text-white" />
        </div>
      </nav>

      <main className="relative z-40 flex-1 flex flex-col items-center justify-center p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 xl:gap-40 w-full max-w-screen-2xl">
          
          {/* --- BẢNG DANH SÁCH CHI TIẾT --- */}
          <div className={`order-2 lg:order-1 flex flex-col gap-5 w-full lg:w-[420px] transition-all ${isSpinning ? 'opacity-20' : 'opacity-100'}`}>
            <h3 className="text-xl font-black uppercase tracking-[0.5em] text-emerald-500 mb-2 border-l-4 border-emerald-500 pl-4">KHO QUÀ TẶNG</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {wheelSlices.filter(s => s.name !== 'Sống Xanh').map((item, idx) => (
                <div key={idx} className="group bg-white/[0.04] border border-white/10 p-6 rounded-[2.5rem] flex items-center gap-6 hover:bg-white/[0.08] hover:border-emerald-500/40 transition-all shadow-2xl">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3">
                    <img src={item.logo} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-xl font-black uppercase tracking-wider text-white italic">{item.name}</p>
                    <span className="text-[10px] font-bold text-emerald-500/70 uppercase">Cơ hội trúng thưởng cao</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- TRUNG TÂM: VÒNG QUAY LOGO --- */}
          <div className="order-1 lg:order-2 relative flex flex-col items-center">
            <div className="relative w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] lg:w-[650px] lg:h-[650px] flex items-center justify-center">
              <div 
                className="relative w-full h-full rounded-full border-[15px] lg:border-[25px] border-white/5 bg-black/40 backdrop-blur-2xl shadow-[0_0_150px_rgba(16,185,129,0.2)]" 
                style={{ 
                  transform: `rotate(${rotation}deg)`, 
                  // Thời gian quay đúng 3.9 giây với hiệu ứng chậm dần đều cực mượt
                  transition: isSpinning ? 'transform 7.9s cubic-bezier(0.15, 0, 0.15, 1)' : 'none' 
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  {wheelSlices.map((slice, i) => {
                    const angle = 360 / wheelSlices.length;
                    return (
                      <g key={i} transform={`rotate(${i * angle} 50 50)`}>
                        <path d={`M50 50 L50 0 A50 50 0 0 1 ${50 + 50 * Math.sin((angle * Math.PI) / 180)} ${50 - 50 * Math.cos((angle * Math.PI) / 180)} Z`} fill={slice.color} stroke="rgba(255,255,255,0.08)" strokeWidth="0.1" />
                        <g transform={`rotate(${angle / 2} 50 50)`}>
                          {/* Logo to đối xứng (x=38, width=24) */}
                          <foreignObject x="39" y="10" width="16" height="16" transform="rotate(90, 50, 18)">
                            <div className="w-full h-full flex items-center justify-center">
                              <img src={slice.logo} className="w-full h-full object-contain" alt="logo" />
                            </div>
                          </foreignObject>
                        </g>
                      </g>
                    );
                  })}
                </svg>
                <div className="absolute inset-0 m-auto w-24 h-24 bg-zinc-900 rounded-full border-4 border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.8)] flex items-center justify-center font-black italic text-4xl text-emerald-400 z-30">GS</div>
              </div>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50">
                <svg width="70" height="90" viewBox="0 0 40 50"><path d="M20 50L5 15C5 8 10 0 20 0C30 0 35 8 35 15L20 50Z" fill="#10b981" /></svg>
              </div>
            </div>

            <div className="mt-16 scale-125 md:scale-[1.7] transition-transform">
               {loading ? <Loader2 className="animate-spin text-emerald-500" /> : (
                 !user ? (
                   <button onClick={handleLogin} className="px-16 py-4 bg-emerald-500 text-black font-black uppercase text-sm rounded-full tracking-widest shadow-2xl">UNLOCK NOW</button>
                 ) : (
                   <button 
                    onClick={spinWheel} 
                    disabled={isSpinning || spinsLeft <= 0} 
                    className={`px-16 py-4 rounded-full font-black uppercase text-[12px] tracking-[0.4em] transition-all duration-500 shadow-2xl ${isSpinning || spinsLeft <= 0 ? 'bg-white/5 text-white/20' : 'bg-emerald-500 text-black hover:shadow-[0_0_50px_#10b981]'}`}
                   >
                     {isSpinning ? 'SPINNING...' : spinsLeft > 0 ? 'QUAY NGAY' : 'HẾT LƯỢT'}
                   </button>
                 )
               )}
            </div>
          </div>
          
          {/* CỘT PHẢI: TRẠNG THÁI */}
          <div className="hidden xl:flex flex-col gap-6 w-64 order-3">
             <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[3rem] backdrop-blur-xl shadow-2xl text-center">
                <p className="text-[11px] font-black uppercase text-emerald-500 mb-6 tracking-widest">SYSTEM DATA</p>
                <div className="flex flex-col gap-6 text-sm font-bold">
                   <div className="flex justify-between items-center"><span className="text-white/30 uppercase">Secure</span><Shield size={18} className="text-emerald-500" /></div>
                   <div className="flex justify-between items-center"><span className="text-white/30 uppercase">Live</span><div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div></div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* MODAL KẾT QUẢ */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-fade-in">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[4rem] p-16 text-center shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 text-white/20 hover:text-white"><X size={32} /></button>
            <div className="mb-12">
              <div className={`w-32 h-32 mx-auto rounded-[2.5rem] flex items-center justify-center shadow-2xl ${winner?.isWin ? 'bg-emerald-500 shadow-[0_0_50px_#10b981]' : 'bg-white/10'}`}>
                <Trophy size={64} className={winner?.isWin ? 'text-black' : 'text-white/20'} />
              </div>
            </div>
            <h3 className="text-5xl font-black uppercase tracking-tighter mb-10 italic text-white">{winner?.isWin ? 'CHÚC MỪNG!' : 'TIẾC QUÁ...'}</h3>
            <div className="p-12 bg-black/50 border border-white/5 rounded-[3.5rem] mb-10 shadow-inner">
              <p className="text-2xl font-bold text-emerald-400 leading-relaxed uppercase tracking-widest italic">{winner?.text}</p>
            </div>
            {winner?.isWin && (
              <div className="bg-emerald-500/10 p-8 rounded-[2.5rem] border border-emerald-500/20 mb-12 text-left animate-scale-up">
                <p className="text-sm font-black uppercase text-emerald-400 mb-4 flex items-center gap-3"><Phone size={18}/> Liên hệ Admin Zalo/SĐT:</p>
                <p className="text-2xl font-black text-white italic">0123.456.789</p>
              </div>
            )}
            <button onClick={() => setShowModal(false)} className="w-full py-6 bg-white text-black font-black uppercase text-lg tracking-[0.4em] rounded-full hover:bg-emerald-400 transition-all">XÁC NHẬN</button>
          </div>
        </div>
      )}

      {/* CSS ÉP TNR */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
        * { font-family: 'Times New Roman', Times, serif !important; }
        body { background: #000; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-up { animation: scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}} />
    </div>
  );
};

export default App;