"use client";
import React, { useState } from 'react';
import { Search, User, Menu, MapPin, Leaf, Shield, Trees, Droplets, Sun, ChevronRight, Compass } from 'lucide-react';
import Link from 'next/link';

const DestinationsPage = () => {
  // Dữ liệu đã được làm giàu (Enriched Data) với các thông tin chuyên sâu
  const destinationsData = [
    {
      id: 0,
      name: "Vàm Sát - Cần Giờ",
      titlePart1: "VAM SAT", 
      titlePart2: "CAN GIO",
      subtitle: "Khu Du Lịch Sinh Thái",
      description: "Được UNESCO công nhận là khu dự trữ sinh quyển thế giới đầu tiên tại Việt Nam. Nghiên cứu này nhằm làm rõ cách các định hướng tiếp thị bền vững ảnh hưởng đến quyết định và hành vi của du khách. Vàm Sát sở hữu hệ sinh thái rừng ngập mặn độc đáo, đóng vai trò quan trọng trong việc hấp thụ Carbon (Blue Carbon) và bảo vệ bờ biển.",
      location: "TP. Hồ Chí Minh",
      image: "https://mia.vn/media/uploads/blog-du-lich/khu-du-lich-sinh-thai-vam-sat-14-1696648113.jpg",
      stats: {
        area: "75.740 ha (Toàn khu Cần Giờ)",
        biodiversity: "Hơn 700 loài động thực vật",
        highlight: "Đầm Dơi, Sân Chim, Rừng Đước",
        ecoRole: "Bể chứa Carbon, chống xói mòn"
      },
      tags: ["Rừng ngập mặn", "Blue Carbon", "UNESCO"],
      icon: <Droplets className="text-emerald-400" size={24} />
    },
    {
      id: 1,
      name: "Nam Cát Tiên",
      titlePart1: "NAM",
      titlePart2: "CAT TIEN",
      subtitle: "Vườn Quốc Gia",
      description: "Một trong những trung tâm đa dạng sinh học quan trọng nhất của Việt Nam, nơi bảo tồn nhiều loài động vật quý hiếm có tên trong Sách Đỏ. Chiến dịch 'Du lịch không dấu chân' tại đây là một điểm sáng trong Green Marketing, nhấn mạnh vào việc khám phá thiên nhiên nhưng không làm ảnh hưởng đến hệ sinh thái nguyên sinh.",
      location: "Đồng Nai",
      image: "https://cdn.nhandan.vn/images/09e094bf85219244ca8a426249e6fc5be7d7a159725dd41ad22728accdbeb8f4defea2ed10dac59bd634d29ada23da7382210a66265fdfd3f625eb92838bd2d837090969c61a54f6c00e9a07645ecbdb0ab47f0555d0e89c2ff233978e7c5c40b40f3a8dbcbd0070206be3ad8d4611e85cfacd5ee898d181029010948d9846a0/den-vuon-quoc-gia-cat-tien-tay-cat-tien-kham-pha-thien-nhien-ky-thu-01-1656498315.jpg",
      stats: {
        area: "71.350 ha",
        biodiversity: "Hơn 1.610 loài thực vật, 1.529 loài động vật",
        highlight: "Bàu Sấu, Đảo Tiên, Trekking xuyên rừng",
        ecoRole: "Lá phổi xanh, Bảo tồn gen quý"
      },
      tags: ["Rừng nguyên sinh", "Trekking", "Sách Đỏ"],
      icon: <Trees className="text-emerald-400" size={24} />
    },
    {
      id: 2,
      name: "Núi Chúa",
      titlePart1: "NUI",
      titlePart2: "CHUA",
      subtitle: "Vườn Quốc Gia",
      description: "Được mệnh danh là 'Thảo nguyên cây gai' độc nhất vô nhị tại Việt Nam, Núi Chúa mang đặc trưng của rừng khô hạn. Việc kết hợp giữa bảo tồn rùa biển và du lịch cao cấp bền vững tại đây là mô hình marketing xanh tuyệt vời, mang lại giá trị kinh tế đi đôi với ý thức bảo vệ môi trường biển.",
      location: "Ninh Thuận",
      image: "https://mia.vn/media/uploads/blog-du-lich/vuon-quoc-gia-nui-chua-khu-du-tru-sinh-quyen-moi-cua-the-gioi-6-1658159836.jpg",
      stats: {
        area: "29.865 ha",
        biodiversity: "1.511 loài thực vật, 765 loài động vật",
        highlight: "Hang Rái, Vịnh Vĩnh Hy, Bảo tồn rùa",
        ecoRole: "Rừng khô hạn duy nhất, Bảo tồn biển"
      },
      tags: ["Rừng khô hạn", "Bảo tồn biển", "Du lịch cao cấp"],
      icon: <Sun className="text-emerald-400" size={24} />
    }
  ];

  return (
    <div className="relative min-h-screen w-full font-sans text-white overflow-x-hidden bg-zinc-950 flex flex-col">
      {/* Background Layer (Fixed & Subtle) */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#10b981_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-3xl"></div>
      </div>

      {/* Navbar (Giữ nguyên từ trang Landing Page) */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 md:px-16 bg-zinc-950/50 backdrop-blur-md border-b border-white/5 sticky top-0">
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
          <li>
            <Link href="/" className="hover:text-emerald-400 cursor-pointer transition-colors">Giới thiệu</Link>
                  </li>
                  <li>
            <Link href="/destinations" className="hover:text-emerald-400 cursor-pointer transition-colors">Điểm đến</Link>
          </li>
          <li>
            <Link href="/spin" className="hover:text-emerald-400 cursor-pointer transition-colors">Vòng quay</Link>
          </li>
          
          <li>
            <Link href="/contact" className="hover:text-emerald-400 cursor-pointer transition-colors">Liên hệ</Link>
          </li>
        </ul>

        <div className="flex items-center gap-5">
          <Search size={16} className="hover:text-emerald-400 cursor-pointer transition-colors" />
          <User size={16} className="hover:text-emerald-400 cursor-pointer transition-colors" />
          <Menu size={18} className="lg:hidden" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-40 flex-1 w-full max-w-6xl mx-auto pt-12 pb-24 px-6 md:px-12">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-emerald-500/50"></div>
            <span className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-[10px] md:text-[11px] font-poppins flex items-center gap-2">
              <Compass size={14} /> Hệ sinh thái xanh
            </span>
            <div className="w-8 h-[1px] bg-emerald-500/50"></div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg">
            Khám phá các điểm đến
          </h1>
          <p className="text-sm md:text-base opacity-60 max-w-2xl mx-auto font-light leading-relaxed">
            Chi tiết về các khu vực bảo tồn và du lịch sinh thái trọng điểm, nơi chiến lược Green Marketing được áp dụng nhằm thúc đẩy du lịch bền vững tại Việt Nam.
          </p>
        </div>

        {/* Destinations List */}
        <div className="space-y-24">
          {destinationsData.map((dest, index) => (
            <div 
              key={dest.id} 
              className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Image Section */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="relative h-[350px] md:h-[450px] w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                  <img 
                    src={dest.image} 
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80"></div>
                  
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="flex gap-2 mb-3">
                      {dest.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full text-[9px] uppercase tracking-widest font-bold text-emerald-300 font-poppins">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2 text-white">
                      {dest.name}
                    </h2>
                    <p className="flex items-center gap-1.5 text-sm text-zinc-300 font-light">
                      <MapPin size={14} className="text-emerald-500" /> {dest.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <div className="mb-6 flex items-center gap-3">
                  <div className="p-3 bg-zinc-900 border border-emerald-500/20 rounded-2xl shadow-lg">
                    {dest.icon}
                  </div>
                  <div>
                    <h3 className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] font-poppins mb-1">
                      Phân loại
                    </h3>
                    <p className="text-lg font-semibold tracking-tight">{dest.subtitle}</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed opacity-70 mb-8 font-light text-justify">
                  {dest.description}
                </p>

                {/* Stats Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                    <Leaf size={16} className="text-emerald-400 mb-2" />
                    <h4 className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest font-poppins mb-1">Hệ sinh thái</h4>
                    <p className="text-sm font-medium">{dest.stats.biodiversity}</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                    <MapPin size={16} className="text-emerald-400 mb-2" />
                    <h4 className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest font-poppins mb-1">Diện tích</h4>
                    <p className="text-sm font-medium">{dest.stats.area}</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                    <Sun size={16} className="text-emerald-400 mb-2" />
                    <h4 className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest font-poppins mb-1">Điểm nổi bật</h4>
                    <p className="text-sm font-medium">{dest.stats.highlight}</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                    <Shield size={16} className="text-emerald-400 mb-2" />
                    <h4 className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest font-poppins mb-1">Vai trò sinh thái</h4>
                    <p className="text-sm font-medium">{dest.stats.ecoRole}</p>
                  </div>
                </div>

                {/* Call to action */}
                <div>
                  <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-emerald-500/30 text-white font-bold uppercase text-[11px] tracking-widest rounded-full hover:bg-emerald-500 hover:border-emerald-500 transition-all active:scale-95 font-poppins group"
                  >
                    Quay lại tương tác AI
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .font-poppins {
          font-family: var(--font-poppins), sans-serif;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
      `}} />
    </div>
  );
};

export default DestinationsPage;