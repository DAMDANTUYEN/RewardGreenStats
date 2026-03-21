"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Search, User, Menu, ChevronLeft, ChevronRight, Play, BarChart3, Pause, Sparkles, X, Loader2, Info, ArrowUpRight } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Gemini API States
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const destinations = [
    {
      id: 0,
      name: "Vàm Sát - Cần Giờ",
      titlePart1: "VAM SAT", // Đảm bảo Vàm Sát nằm cùng 1 dòng
      titlePart2: "- CAN GIO",
      subtitle: "Chiến lược Marketing Xanh",
      description: "Nghiên cứu này nhằm làm rõ cách các định hướng tiếp thị bền vững ảnh hưởng đến quyết định và hành vi của du khách trong bối cảnh phát triển du lịch xanh tại Việt Nam. Những ý kiến đóng góp chân thành của Anh/Chị sẽ là động lực mạnh mẽ thúc đẩy việc hoàn thiện các chiến dịch marketing trong ngành du lịch.",
      location: "TP. Hồ Chí Minh",
      image: "https://mia.vn/media/uploads/blog-du-lich/khu-du-lich-sinh-thai-vam-sat-14-1696648113.jpg",
      stats: "Khu du lịch sinh thái",
      prompt: "Hãy phân tích chi tiết chiến lược Green Marketing cho khu du lịch Vàm Sát - Cần Giờ. Tập trung vào 4P (Product, Price, Place, Promotion) trong bối cảnh du lịch sinh quyển bền vững."
    },
    {
      id: 1,
      name: "Nam Cát Tiên",
      titlePart1: "NAM",
      titlePart2: "CAT TIEN",
      subtitle: "Chiến lược Marketing Xanh",
      description: "Nghiên cứu này nhằm làm rõ cách các định hướng tiếp thị bền vững ảnh hưởng đến quyết định và hành vi của du khách trong bối cảnh phát triển du lịch xanh tại Việt Nam. Những ý kiến đóng góp chân thành của Anh/Chị sẽ là động lực mạnh mẽ thúc đẩy việc hoàn thiện các chiến dịch marketing trong ngành du lịch.",
      location: "Đồng Nai",
      image: "https://cdn.nhandan.vn/images/09e094bf85219244ca8a426249e6fc5be7d7a159725dd41ad22728accdbeb8f4defea2ed10dac59bd634d29ada23da7382210a66265fdfd3f625eb92838bd2d837090969c61a54f6c00e9a07645ecbdb0ab47f0555d0e89c2ff233978e7c5c40b40f3a8dbcbd0070206be3ad8d4611e85cfacd5ee898d181029010948d9846a0/den-vuon-quoc-gia-cat-tien-tay-cat-tien-kham-pha-thien-nhien-ky-thu-01-1656498315.jpg",
      stats: "Vườn quốc gia",
      prompt: "Dựa trên nghiên cứu về đa dạng sinh học tại Nam Cát Tiên, hãy đề xuất 3 ý tưởng sáng tạo cho chiến dịch truyền thông 'Du lịch không dấu chân' để thu hút khách quốc tế."
    },
    {
      id: 2,
      name: "Núi Chúa",
      titlePart1: "NUI",
      titlePart2: "CHUA",
      subtitle: "Chiến lược Marketing Xanh",
      description: "Nghiên cứu này nhằm làm rõ cách các định hướng tiếp thị bền vững ảnh hưởng đến quyết định và hành vi của du khách trong bối cảnh phát triển du lịch xanh tại Việt Nam. Những ý kiến đóng góp chân thành của Anh/Chị sẽ là động lực mạnh mẽ thúc đẩy việc hoàn thiện các chiến dịch marketing trong ngành du lịch.",
      location: "Ninh Thuận",
      image: "https://mia.vn/media/uploads/blog-du-lich/vuon-quoc-gia-nui-chua-khu-du-tru-sinh-quyen-moi-cua-the-gioi-6-1658159836.jpg",
      stats: "Vườn quốc gia",
      prompt: "Phân tích tiềm năng kết hợp giữa bảo tồn rùa biển và du lịch cao cấp tại Vườn quốc gia Núi Chúa dưới góc độ marketing xanh bền vững."
    }
  ];

  const handleNext = useCallback(() => {
    setActiveTab((prev) => (prev === destinations.length - 1 ? 0 : prev + 1));
  }, [destinations.length]);

  const handlePrev = useCallback(() => {
    setActiveTab((prev) => (prev === 0 ? destinations.length - 1 : prev - 1));
  }, [destinations.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [handleNext, isPaused]);

  // Gemini API Integration
  const generateAiInsight = async () => {
    setIsPaused(true);
    setIsGenerating(true);
    setAiResponse("");
    setShowAiModal(true);

    const apiKey = ""; // Nhớ điền API Key của bạn vào đây hoặc dùng process.env
    const model = "gemini-2.0-flash"; // Cập nhật model mới nhất để hoạt động ổn định
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const userPrompt = destinations[activeTab].prompt;
    const systemPrompt = "Bạn là một chuyên gia về Green Marketing và Du lịch sinh thái tại Việt Nam. Hãy viết một bản phân tích ngắn gọn, chuyên nghiệp và có chiều sâu bằng tiếng Việt.";

    const fetchWithRetry = async (retries = 5, delay = 1000) => {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });

        if (!response.ok) throw new Error('API call failed');
        
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (error) {
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(retries - 1, delay * 2);
        }
        throw error;
      }
    };

    try {
      const result = await fetchWithRetry();
      setAiResponse(result);
    } catch (error) {
      setAiResponse("Rất tiếc, đã có lỗi xảy ra trong quá trình kết nối với trợ lý AI. Vui lòng thử lại sau.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getCardStyle = (index) => {
    const total = destinations.length;
    let diff = index - activeTab;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      return "translate-x-0 scale-100 z-30 opacity-100 ring-1 ring-emerald-500/30 shadow-2xl";
    } else if (diff === 1 || (diff < -1 && total > 2)) {
      return "translate-x-[94%] md:translate-x-[95.5%] scale-75 z-10 opacity-30 blur-[1px]";
    } else {
      return "-translate-x-[94%] md:-translate-x-[95.5%] scale-75 z-10 opacity-30 blur-[1px]";
    }
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-white overflow-hidden bg-zinc-950 flex flex-col">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {destinations.map((dest, index) => (
          <img 
            key={dest.id}
            src={dest.image} 
            alt="Background" 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out scale-105
              ${activeTab === index ? 'opacity-30' : 'opacity-0'}
            `}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/20 to-black/90"></div>
      </div>

      {/* Header */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 md:px-16">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute -inset-3 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative p-1.5 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl backdrop-blur-md transition-all duration-500 group-hover:border-emerald-500/50 group-hover:scale-110 flex items-center justify-center shadow-xl">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-500">
                <path d="M48 40C45 38 40 38 35 43C32 46 32 50 35 55C38 60 45 65 52 65C60 65 65 60 68 55C70 52 70 48 68 45" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
                <path d="M48 40L40 25M68 45L75 30" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
                <path d="M20 50C20 30 35 15 50 15C65 15 80 30 80 50C80 70 65 85 50 85C35 85 20 70 20 50Z" stroke="#4ade80" strokeWidth="4" strokeDasharray="15 5" />
                <path d="M50 15C60 15 75 25 80 40M80 60C75 75 60 85 50 85M20 50C20 65 35 85 50 85M50 15C35 15 20 35 20 50" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
                <path d="M85 45C85 35 75 25 65 25" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" />
                <path d="M15 55C15 65 25 75 35 75" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" />
                <circle cx="39" cy="48" r="1.5" fill="#34d399" />
              </svg>
            </div>
          </div>
          <div className="flex items-center transition-all duration-500 group-hover:tracking-wider">
            <span className="text-[16px] font-black uppercase tracking-tight text-white drop-shadow-md">Green</span>
            <span className="text-[16px] font-extrabold uppercase tracking-tight text-emerald-500 drop-shadow-md">Stats</span>
          </div>
        </div>

        <ul className="hidden lg:flex items-center gap-8 text-[9px] font-semibold tracking-[0.2em] uppercase opacity-70 font-poppins">
          <li className="hover:text-emerald-400 cursor-pointer transition-colors border-b border-emerald-500 pb-1">Giới thiệu</li>
          <li className="hover:text-emerald-400 cursor-pointer transition-colors">Điểm đến</li>
          <li className="hover:text-emerald-400 cursor-pointer transition-colors">Vòng quay</li>
          <li className="hover:text-emerald-400 cursor-pointer transition-colors">Liên hệ</li>
        </ul>

        <div className="flex items-center gap-5">
          <Search size={16} className="hover:text-emerald-400 cursor-pointer transition-colors" />
          <User size={16} className="hover:text-emerald-400 cursor-pointer transition-colors" />
          <Menu size={18} className="lg:hidden" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-40 flex flex-col items-center justify-center flex-1 w-full pt-8 pb-12 px-4">
        
        {/* Centered Text Section */}
        <div className="max-w-4xl flex flex-col items-center text-center mb-12 relative">
          <div className="flex items-center justify-center gap-3 mb-3 animate-fade-in">
            <div className="w-6 h-[1px] bg-emerald-500/50"></div>
            <span className="text-emerald-400 font-bold uppercase tracking-[0.4em] text-[8px] md:text-[9px] font-poppins">
              {destinations[activeTab].subtitle}
            </span>
            <div className="w-6 h-[1px] bg-emerald-500/50"></div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.8] mb-6">
            <div className="overflow-hidden">
               <span className="block animate-slide-up drop-shadow-2xl whitespace-nowrap">
                  {destinations[activeTab].titlePart1}
               </span>
            </div>
            <div className="overflow-hidden mt-1.5">
              <span 
                className="block animate-slide-up-slow text-transparent drop-shadow-xl whitespace-nowrap" 
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}
              >
                 {destinations[activeTab].titlePart2}
              </span>
            </div>
          </h1>
          
          <p className="text-xs md:text-sm opacity-50 mb-8 max-w-2xl leading-relaxed font-light px-4 drop-shadow-md">
            {destinations[activeTab].description}
          </p>
          
          <div className="flex items-center gap-4 animate-fade-in">
            <button 
              onClick={generateAiInsight}
              className="px-10 py-4 bg-emerald-500 text-white font-bold uppercase text-[12px] tracking-[0.1em] rounded-full hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/40 hover:-translate-y-1 flex items-center gap-3 active:scale-95 border border-white/10 font-poppins"
            >
              Khảo sát ngay
            </button>
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className="p-3.5 border border-white/10 rounded-full hover:bg-white/5 transition-all active:scale-90"
            >
              {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div 
          className="relative w-full max-w-4xl h-[260px] flex items-center justify-center perspective-1000"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => !showAiModal && setIsPaused(false)}
        >
          {destinations.map((dest, index) => (
            <div 
              key={dest.id}
              onClick={() => setActiveTab(index)}
              className={`absolute w-[280px] md:w-[440px] h-[160px] md:h-[230px] cursor-pointer transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] rounded-[2.5rem] overflow-hidden shadow-2xl
                ${getCardStyle(index)}
              `}
            >
              <img 
                src={dest.image} 
                alt={dest.name} 
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms]
                  ${activeTab === index ? 'scale-105' : 'scale-125'}
                `} 
              />
              <div className={`absolute inset-0 transition-opacity duration-1000 ${activeTab === index ? 'bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-95' : 'bg-black/60'}`}></div>
              
              <div className={`absolute inset-0 p-8 flex flex-col justify-end transition-all duration-700 delay-200
                ${activeTab === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <p className="uppercase tracking-[0.3em] text-emerald-400 text-[7.5px] font-black mb-1.5 font-poppins">
                  {dest.location}
                </p>
                <div className="flex justify-between items-end">
                  <h3 className="font-bold uppercase tracking-tighter text-xl md:text-2xl leading-none drop-shadow-lg">
                    {dest.name}
                  </h3>
                  
                  {activeTab === index && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); generateAiInsight(); }}
                      className="bg-emerald-500 hover:bg-emerald-400 transition-colors px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg border border-white/10 group/btn animate-fade-in"
                    >
                      <ArrowUpRight size={13} className="text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      <span className="text-[9px] font-black text-white font-poppins">Chi tiết</span>
                    </button>
                  )}
                </div>
              </div>

              {activeTab === index && !isPaused && (
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/5">
                  <div className="h-full bg-emerald-500 animate-progress origin-left"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* AI Response Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-emerald-500/10">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-500 rounded-lg">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold uppercase text-[11px] tracking-widest font-poppins">Trợ lý Chiến lược AI ✨</h3>
                  <p className="text-[8px] opacity-60 uppercase font-bold tracking-tighter font-poppins">Đang phân tích: {destinations[activeTab].name}</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowAiModal(false); setIsPaused(false); }}
                className="p-1.5 hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 size={32} className="text-emerald-500 animate-spin" />
                  <p className="text-[9px] uppercase tracking-widest font-bold opacity-60 animate-pulse font-poppins">Đang tổng hợp dữ liệu...</p>
                </div>
              ) : (
                <div className="prose prose-invert prose-emerald max-w-none">
                  <div className="flex items-start gap-3 mb-5 p-3.5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                    <span className="shrink-0 mt-0.5"><Info size={16} className="text-emerald-500" /></span>
                    <p className="text-[11px] italic opacity-80 leading-relaxed font-poppins">
                      Thông tin dưới đây được tạo tự động bởi trí tuệ nhân tạo dựa trên các dữ liệu về marketing xanh và du lịch sinh thái.
                    </p>
                  </div>
                  <div className="text-[13px] md:text-[14px] leading-relaxed opacity-90 whitespace-pre-wrap font-light">
                    {aiResponse}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-5 border-t border-white/5 bg-zinc-950 flex justify-end">
              <button 
                onClick={() => { setShowAiModal(false); setIsPaused(false); }}
                className="px-5 py-2 bg-white text-black font-bold uppercase text-[9px] tracking-widest rounded-full hover:bg-emerald-500 hover:text-white transition-all shadow-md active:scale-95 font-poppins"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        
        .font-poppins {
          /* SỬA THÀNH DÒNG NÀY ĐỂ NHẬN FONT TỪ LAYOUT */
          font-family: var(--font-poppins), sans-serif;
        }

        @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slideUp 1s cubic-bezier(0.2, 1, 0.2, 1) forwards; }
        .animate-slide-up-slow { animation: slideUp 1.2s cubic-bezier(0.2, 1, 0.2, 1) forwards; }
        .animate-progress { animation: progress 5s linear forwards; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .perspective-1000 { perspective: 1000px; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(16, 185, 129, 0.2) transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.4); }
      `}} />
    </div>
  );
};

export default App;