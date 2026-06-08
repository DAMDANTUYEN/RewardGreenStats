"use client";
import React, { useState, useEffect,Suspense } from 'react';
import { MapPin, Leaf, Trees, Droplets, Sun, ChevronDown, ChevronUp, History, Zap, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useSearchParams } from 'next/navigation';  
const DestinationsContent = () => {
  // State quản lý việc mở rộng nội dung của từng địa điểm
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  const searchParams = useSearchParams();
  // Dữ liệu chi tiết nạp từ tài liệu nghiên cứu
  const expandParam = searchParams.get('expand');

  useEffect(() => {
    if (expandParam !== null) {
      const idToExpand = parseInt(expandParam, 10);
      setExpandedId(idToExpand);
      
      // Đợi nửa giây cho trang load xong rồi trượt màn hình xuống đúng cái ô đó
      setTimeout(() => {
        const element = document.getElementById(`destination-${idToExpand}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, [expandParam]);
  const destinationsData = [
    {
      id: 0,
      name: "Khu du lịch sinh thái Vàm Sát",
      subtitle: "Khu Dự trữ Sinh quyển Thế giới - Cần Giờ",
      location: "Xã Lý Nhơn, huyện Cần Giờ, TP.HCM",
      image: "https://images.vietnamtourism.gov.vn/vn/images/2021/CNMN/Thang5/14.5.rung_vam_sat_1137421235.jpg",
      subImages: [
        "https://vamsat.vn/wp-content/uploads/2018/04/10-2011To03BaoAnh12102011145643477.jpg",
        "https://vamsat.vn/wp-content/uploads/2018/03/6e6e52cb-fc09-47a7-ba50-dfa4a008d0ba-3.jpg"
      ],
      history: "Cái tên Vàm Sát phiên âm từ tiếng Khmer 'Peám Sak' (Ngã ba sông có nhiều cây Mấm). Lịch sử bắt đầu từ chiến dịch trồng lại rừng Cần Giờ năm 1979 của Thanh niên Xung phong. Sau chiến tranh, bom đạn và chất độc hóa học đã biến nơi đây thành 'Vùng đất chết'. Đến năm 1999, Vàm Sát được Phuthotourist quản lý, khôi phục hệ sinh thái ngập mặn lên đến hơn 31.000 ha rừng.",
      ecology: "Là khu dự trữ sinh quyển thế giới đầu tiên tại Việt Nam được UNESCO công nhận. Thảm thực vật đa dạng với hơn 150 loài như đước, cóc, mấm, bần... Trong đó, cây Đước đóng vai trò quan trọng nhờ hệ thống rễ chống xâm thực hiệu quả. Đây là 'mái nhà' của hơn 130 loài cá, bò sát và chim, đóng vai trò lọc bỏ chất độc từ thượng nguồn trước khi đổ ra biển Đông.",
      highlights: "Cá sấu Xiêm và cá sấu Hoa Cà nuôi thả tự nhiên; Khỉ Đuôi Dài hoang dã; Đàn Dơi Nghệ quý hiếm sống trong rừng sâu; Sân chim tự nhiên trên những ngọn cây cao.",
      tags: ["UNESCO", "Blue Carbon", "Rừng Sác"],
      icon: <Droplets className="text-emerald-400" size={24} />
    },
    {
      id: 1,
      name: "Vườn Quốc gia Nam Cát Tiên",
      subtitle: "Di tích Quốc gia Đặc biệt - Di sản UNESCO",
      location: "Đồng Nai, Lâm Đồng và Bình Phước",
      image: "https://dsvh.gov.vn/ckfinder/userfiles/images/Thong%20tin%20ds/Canh%20quan%20Bau%20Sau%20_%20Cat%20Tien.jpg",
      subImages: [
        "https://cattiennationalpark.com.vn/wp-content/uploads/2023/03/word-image-6718-1.jpeg",
        "https://images.vietnamtourism.gov.vn/vn/images/1/thang_7-_travel%2B/25.7/vqg_cat_tien/cat_tien_3.jpg"
      ],
      history: "Nơi đây lưu giữ nền văn hóa cổ với 12 di chỉ khảo cổ dạng gò. Các nhà khảo cổ đã tìm thấy tượng Ganesa, Linga - Yoni bằng thạch anh và vàng có kích thước lớn nhất Việt Nam. Đây cũng là không gian cư trú lâu đời của các dân tộc Mạ, Chơro, S’Tiêng... với nhiều lễ hội hiến tế trâu và mừng lúa mới đặc sắc.",
      ecology: "Bảo tồn 1.610 loài thực vật và 1.568 loài động vật, trong đó hàng chục loài nằm trong Sách Đỏ. Đây là môi trường sống của các loài cực kỳ quý hiếm như Chà vá chân đen, Hoẵng Nam Bộ. Hệ sinh thái rừng bao gồm rừng thường xanh lá rộng, rừng tre nứa (Lồ Ô, Mum) và các thảm thực vật đất ngập nước nội địa.",
      highlights: "Bàu Sấu (92,63 ha) với 100 cá thể cá Sấu Xiêm; Sông Đồng Nai dài 90km; Các thác nước hùng vĩ như Thác Trời, Bến Cự.",
      tags: ["Ramsar", "Sách Đỏ", "Khảo cổ"],
      icon: <Trees className="text-emerald-400" size={24} />
    },
    {
      id: 2,
      name: "Vườn quốc gia Núi Chúa",
      subtitle: "Thảo nguyên cây gai độc bản - Ninh Thuận",
      location: "Huyện Ninh Hải và Thuận Bắc, Ninh Thuận",
      image: "https://nbca.gov.vn/wp-content/uploads/2023/10/VQG-nui-chua-2.jpg",
      subImages: [
        "https://weex.vn/pic/blog/images/093312-internet---h--sinh-th-i--a-d-ng---vqg-n-i-ch-a.jpg",
        "https://images.vietnamtourism.gov.vn/vn//images/2021/Thang_6/hang-rai-ninh-thuan_01.jpg"
      ],
      history: "Từng là Chiến khu CK19 oanh liệt thời kháng chiến chống Pháp - Mỹ. Hiện nay là nơi sinh sống của người Kinh, Raglay, Chăm... với các lễ hội đua ghe, thờ cá Ông. Núi Chúa mang những dấu tích địa chất đặc trưng của vùng duyên hải Nam Trung Bộ với cấu trúc núi nằm sát bờ biển.",
      ecology: "Mẫu chuẩn duy nhất về hệ sinh thái rừng khô hạn tại Việt Nam. Bảo tồn 1.054 loài thực vật và 306 loài động vật (nổi bật là Chà Vá chân đen). Khu bảo tồn biển rộng 7.352 ha với 350 loài san hô, là bãi đẻ quan trọng của các loài rùa biển quý hiếm như Rùa xanh (Chelonia mydas) và Đồi mồi.",
      highlights: "Hang Rái; Vịnh Vĩnh Hy; Cánh đồng đá khổng lồ kỳ dị; Bãi Thịt - nơi rùa biển đẻ trứng.",
      tags: ["Rừng khô hạn", "Bảo tồn rùa", "San hô"],
      icon: <Sun className="text-emerald-400" size={24} />
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-white overflow-x-hidden flex flex-col selection:bg-emerald-500/30">
      
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#10b981_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-3xl"></div>
      </div>

      <Navbar active="destinations" />

      {/* Main Content */}
      <main className="relative z-40 flex-1 w-full max-w-7xl mx-auto pt-16 pb-24 px-6 md:px-12">
        {/* Header Section */}
        <div className="text-center mb-24 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 italic">
            HỆ SINH THÁI <span className="text-emerald-500">TRỌNG ĐIỂM</span>
          </h1>
          <p className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] opacity-40">Tài liệu lưu trữ nghiên cứu GreenStats 2026</p>
        </div>

        {/* Destinations List */}
        <div className="space-y-40">
          {destinationsData.map((dest) => (
              <div 
                key={dest.id} 
                id={`destination-${dest.id}`}  // <-- THÊM DÒNG NÀY ĐỂ ĐỊNH VỊ
                className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start scroll-mt-24" // THÊM scroll-mt-24 để nó không bị dính sát mép trên
              >
              
              {/* Left Column: Image Gallery */}
              <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-4">
                <div className="relative group overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl aspect-[4/5] bg-zinc-900">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dest.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md rounded-full text-[9px] font-black uppercase italic text-emerald-400 tracking-widest">{tag}</span>
                      ))}
                    </div>
                    <h2 className="text-4xl font-black uppercase italic leading-none mb-2">{dest.name}</h2>
                    <p className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest flex items-center gap-2 italic"><MapPin size={12}/> {dest.location}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   {dest.subImages.map((img, iIdx) => (
                     <div key={iIdx} className="rounded-[2rem] overflow-hidden border border-white/5 aspect-square bg-zinc-900">
                        <img src={img} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" alt="sub" />
                     </div>
                   ))}
                </div>
              </div>

              {/* Right Column: Info & Expanded Detail */}
              <div className="lg:col-span-7 space-y-8 pt-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">{dest.icon}</div>
                  <div>
                    <p className="text-emerald-500 font-black text-[10px] uppercase tracking-widest italic">Phân loại & Cấp bậc</p>
                    <h3 className="text-xl font-black uppercase italic tracking-tight">{dest.subtitle}</h3>
                  </div>
                </div>

                {/* --- PHẦN NỘI DUNG MỞ RỘNG (ẨN/HIỆN) --- */}
                <div className={`overflow-hidden transition-all duration-700 ease-in-out ${expandedId === dest.id ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-10 py-6">
                        <section className="p-8 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-4">
                            <div className="flex items-center gap-3 text-emerald-400">
                                <History size={20} />
                                <h4 className="font-black uppercase italic tracking-widest text-sm">Lịch sử & Hình thành</h4>
                            </div>
                            <p className="text-[13px] leading-relaxed text-zinc-400 uppercase tracking-tight font-medium text-justify">{dest.history}</p>
                        </section>

                        <section className="space-y-4 px-4">
                            <div className="flex items-center gap-3 text-emerald-400">
                                <Leaf size={20} />
                                <h4 className="font-black uppercase italic tracking-widest text-sm">Hệ sinh thái & Bảo tồn</h4>
                            </div>
                            <p className="text-[13px] leading-relaxed text-zinc-300 uppercase tracking-tight font-bold text-justify">{dest.ecology}</p>
                        </section>

                        <section className="p-8 border-l-4 border-emerald-500 bg-emerald-500/5 rounded-r-[3rem] space-y-4">
                            <div className="flex items-center gap-3 text-emerald-400">
                                <Zap size={20} />
                                <h4 className="font-black uppercase italic tracking-widest text-sm">Điểm nhấn đặc biệt</h4>
                            </div>
                            <p className="text-[13px] italic leading-relaxed text-emerald-100/80 uppercase font-bold">{dest.highlights}</p>
                        </section>
                    </div>
                </div>

                {/* --- NÚT ĐIỀU KHIỂN CHI TIẾT --- */}
                <div className="pt-6 border-t border-white/5">
                  <button 
                    onClick={() => toggleExpand(dest.id)}
                    className="group inline-flex items-center gap-4 px-12 py-5 bg-white text-black font-black uppercase italic text-xs tracking-[0.4em] rounded-full hover:bg-emerald-500 hover:text-white transition-all shadow-[0_0_50px_rgba(16,185,129,0.2)] active:scale-95"
                  >
                    {expandedId === dest.id ? (
                      <>THU GỌN <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform" /></>
                    ) : (
                      <>XEM CHI TIẾT <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" /></>
                    )}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.8em] opacity-20 italic">GreenStats Heritage Data Project © 2026</p>
      </footer>

      {/* Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

const DestinationsPage = () => {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <DestinationsContent />
    </Suspense>
  );
};

export default DestinationsPage;