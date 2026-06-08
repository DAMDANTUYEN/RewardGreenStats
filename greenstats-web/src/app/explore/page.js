"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, X, Trees, Globe, Award, Shield, Building2, Mountain, Droplets, Bird, ChevronDown, Leaf, Compass, Waves, Sun, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  function splitRow(line) {
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          fields.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
    }
    fields.push(current.trim());
    return fields;
  }

  const header = splitRow(lines[0]);
  return lines.slice(1).map(line => {
    const fields = splitRow(line);
    const row = {};
    header.forEach((h, i) => { if (i < fields.length) row[h] = fields[i]; });
    return row;
  });
}

const CATEGORY_META = {
  national_park: { label: 'Vườn Quốc Gia', icon: Trees, color: 'emerald' },
  biosphere_reserve: { label: 'Khu DTSQ', icon: Globe, color: 'cyan' },
  best_tourism_village: { label: 'Làng Du Lịch', icon: Award, color: 'amber' },
  unesco_world_heritage: { label: 'Di Sản UNESCO', icon: Shield, color: 'violet' },
  clean_tourist_city: { label: 'TP Du Lịch Sạch', icon: Building2, color: 'blue' },
  nature_reserve: { label: 'Khu Bảo Tồn', icon: Mountain, color: 'green' },
  wetland_nature_reserve: { label: 'Khu ĐNN', icon: Droplets, color: 'sky' },
  ramsar: { label: 'Ramsar', icon: Bird, color: 'teal' },
  ramsar_wetland: { label: 'Ramsar', icon: Bird, color: 'teal' },
  marine_protected_area: { label: 'Bảo Tồn Biển', icon: Waves, color: 'blue' },
  mangrove_ecotourism: { label: 'Rừng Ngập Mặn', icon: Leaf, color: 'emerald' },
  coastal_city: { label: 'TP Biển', icon: Sun, color: 'cyan' },
  heritage_city: { label: 'TP Di Sản', icon: Building2, color: 'violet' },
  community_ecotourism: { label: 'DL Cộng Đồng', icon: Compass, color: 'amber' },
  community_based_tourism: { label: 'DL Cộng Đồng', icon: Compass, color: 'amber' },
  agritourism: { label: 'DL Nông Nghiệp', icon: Leaf, color: 'lime' },
  ecotourism_site: { label: 'DL Sinh Thái', icon: Leaf, color: 'green' },
  highland_ecotourism_city: { label: 'TP Cao Nguyên', icon: Mountain, color: 'emerald' },
  wetland_forest: { label: 'Rừng Tràm', icon: Trees, color: 'emerald' },
  marine_ecotourism: { label: 'DL Biển', icon: Waves, color: 'cyan' },
  marine_landscape: { label: 'Cảnh Quan Biển', icon: Waves, color: 'sky' },
  ecotourism_landscape: { label: 'DL Sinh Thái', icon: Mountain, color: 'green' },
  biosphere_core_zone: { label: 'Lõi DTSQ', icon: Globe, color: 'cyan' },
  default: { label: 'Điểm Đến', icon: MapPin, color: 'emerald' }
};

const COLOR_VALUES = {
  emerald: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400',
  cyan: 'bg-cyan-500/15 border-cyan-500/25 text-cyan-400',
  amber: 'bg-amber-500/15 border-amber-500/25 text-amber-400',
  violet: 'bg-violet-500/15 border-violet-500/25 text-violet-400',
  blue: 'bg-blue-500/15 border-blue-500/25 text-blue-400',
  green: 'bg-green-500/15 border-green-500/25 text-green-400',
  sky: 'bg-sky-500/15 border-sky-500/25 text-sky-400',
  teal: 'bg-teal-500/15 border-teal-500/25 text-teal-400',
  lime: 'bg-lime-500/15 border-lime-500/25 text-lime-400',
  stone: 'bg-stone-500/15 border-stone-500/25 text-stone-400'
};

const BORDER_GLOW = {
  emerald: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
  cyan: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10',
  amber: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
  violet: 'hover:border-violet-500/40 hover:shadow-violet-500/10',
  blue: 'hover:border-blue-500/40 hover:shadow-blue-500/10',
  green: 'hover:border-green-500/40 hover:shadow-green-500/10',
  sky: 'hover:border-sky-500/40 hover:shadow-sky-500/10',
  teal: 'hover:border-teal-500/40 hover:shadow-teal-500/10',
  lime: 'hover:border-lime-500/40 hover:shadow-lime-500/10',
  stone: 'hover:border-stone-500/40 hover:shadow-stone-500/10'
};

const CATEGORY_PILL = {
  all: 'Tất cả',
  national_park: 'Vườn Quốc Gia',
  biosphere_reserve: 'Khu DTSQ',
  best_tourism_village: 'Làng Du Lịch',
  unesco_world_heritage: 'Di Sản UNESCO',
  clean_tourist_city: 'TP Du Lịch Sạch',
  nature_reserve: 'Khu Bảo Tồn',
  wetland_nature_reserve: 'Khu ĐNN',
  ramsar: 'Ramsar',
  marine_protected_area: 'Bảo Tồn Biển',
  mangrove_ecotourism: 'Rừng Ngập Mặn',
  coastal_city: 'TP Biển',
  community_ecotourism: 'DL Cộng Đồng',
  community_based_tourism: 'DL Cộng Đồng',
  ecotourism_site: 'DL Sinh Thái',
  wetland_forest: 'Rừng Tràm',
  ecotourism_landscape: 'DL Sinh Thái',
  heritage_city: 'TP Di Sản',
  biosphere_core_zone: 'Lõi DTSQ'
};

function getPrimaryCat(categoryStr) {
  return categoryStr.split(';')[0].trim();
}

function getCatMeta(categoryStr) {
  const primary = getPrimaryCat(categoryStr);
  return CATEGORY_META[primary] || CATEGORY_META.default;
}

const CATEGORY_ORDER = [
  'national_park', 'biosphere_reserve', 'best_tourism_village',
  'unesco_world_heritage', 'clean_tourist_city', 'nature_reserve',
  'wetland_nature_reserve', 'ramsar', 'marine_protected_area',
  'mangrove_ecotourism', 'coastal_city', 'heritage_city',
  'community_ecotourism', 'ecotourism_site', 'biosphere_core_zone'
];

function getPillLabel(cat) {
  return CATEGORY_PILL[cat] || cat.replace(/_/g, ' ');
}

function getPillColor(cat) {
  const meta = CATEGORY_META[cat] || CATEGORY_META.default;
  return COLOR_VALUES[meta.color] || COLOR_VALUES.emerald;
}

const ExploreContent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [mounted, setMounted] = useState(false);
  const [focusedCard, setFocusedCard] = useState(null);


  useEffect(() => {
    fetch('/green_destinations_vietnam_gis.csv')
      .then(r => {
        if (!r.ok) throw new Error('Không thể tải dữ liệu');
        return r.text();
      })
      .then(text => {
        const parsed = parseCSV(text);
        if (parsed.length === 0) throw new Error('Dữ liệu trống');
        setData(parsed);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setMounted(true), 150);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const provinces = useMemo(() => {
    const s = new Set();
    data.forEach(d => {
      d.province_current_2026.split(';').forEach(p => {
        const t = p.trim();
        if (t) s.add(t);
      });
    });
    return ['all', ...s].sort((a, b) => a === 'all' ? -1 : b === 'all' ? 1 : a.localeCompare(b, 'vi'));
  }, [data]);

  const availableCats = useMemo(() => {
    const s = new Set();
    data.forEach(d => {
      d.category.split(';').forEach(c => {
        const t = c.trim();
        if (t && CATEGORY_META[t]) s.add(t);
      });
    });
    return CATEGORY_ORDER.filter(c => s.has(c));
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter(d => {
      if (search) {
        const q = search.toLowerCase();
        if (!d.name_vi.toLowerCase().includes(q) && !d.name_en.toLowerCase().includes(q)) return false;
      }
      if (selectedCategory !== 'all') {
        const cats = d.category.split(';').map(c => c.trim());
        if (!cats.includes(selectedCategory)) return false;
      }
      if (selectedProvince !== 'all') {
        const provs = d.province_current_2026.split(';').map(p => p.trim());
        return provs.includes(selectedProvince);
      }
      return true;
    });
  }, [data, search, selectedCategory, selectedProvince]);


  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-white overflow-x-hidden flex flex-col selection:bg-emerald-500/30">
      {/* Background glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_100%,rgba(6,182,212,0.05)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(168,85,247,0.03)_0%,transparent_60%)]" />
      </div>

      <Navbar active="explore" />

      {/* Main */}
      <main className="relative z-40 flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pb-24 pt-8">
        {/* Filters */}
        {!loading && data.length > 0 && (
          <div className={`mb-10 space-y-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {/* Search + Province row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm kiếm điểm đến..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-11 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/40 focus:bg-white/[0.05] transition-all uppercase tracking-wider font-medium"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="relative min-w-[180px]">
                <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none z-10" />
                <select
                  value={selectedProvince}
                  onChange={e => setSelectedProvince(e.target.value)}
                  className="w-full appearance-none px-11 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/40 focus:bg-white/[0.05] transition-all uppercase tracking-wider font-medium cursor-pointer"
                >
                  <option value="all" className="bg-zinc-900">Tất cả tỉnh thành</option>
                  {provinces.filter(p => p !== 'all').map(p => (
                    <option key={p} value={p} className="bg-zinc-900">{p}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] border transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-white'
                }`}
              >
                Tất cả
              </button>
              {availableCats.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] border transition-all duration-300 ${
                    selectedCategory === cat
                      ? `${getPillColor(cat)} shadow-lg`
                      : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {getPillLabel(cat)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-white/5 rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-2 border-emerald-500/40 rounded-full border-t-transparent animate-spin" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-30">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-32">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <span className="text-red-400 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-32">
            <Search size={48} className="mx-auto mb-5 opacity-20" strokeWidth={1} />
            <p className="text-lg font-bold uppercase tracking-[0.15em] opacity-40 mb-2">Không tìm thấy điểm đến</p>
            <p className="text-xs uppercase tracking-[0.2em] opacity-25">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedProvince('all'); }}
              className="mt-6 px-6 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-500/20 hover:border-emerald-500/30 hover:text-emerald-400 transition-all"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}

        {/* Card Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          >
            {filtered.map((dest, idx) => {
              const meta = getCatMeta(dest.category);
              const colorKey = meta.color;
              const catColors = `bg-gradient-to-br ${COLOR_VALUES[colorKey]} ${BORDER_GLOW[colorKey]}`;
              const isFocused = focusedCard === dest.id;

              return (
                <div
                  key={dest.id}
                  className={`group relative overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-zinc-900/30 backdrop-blur-sm transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:shadow-2xl ${BORDER_GLOW[colorKey]}`}
                  style={{
                    animation: mounted ? `cardFadeIn 0.6s ease-out ${idx * 0.05}s both` : 'none',
                  }}
                  onMouseEnter={() => setFocusedCard(dest.id)}
                  onMouseLeave={() => setFocusedCard(null)}
                  onClick={() => window.open(dest.source_url?.split(';')[0]?.trim() || dest.contact_website || '#', '_blank')}
                >
                  {/* Image container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={dest.image_url}
                      alt={dest.name_vi}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isFocused ? 'scale-110' : 'scale-100'
                      }`}
                      loading="lazy"
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-gradient-to-br', 'from-emerald-900/40', 'to-zinc-900');
                      }}
                    />
                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40" />

                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] border backdrop-blur-md transition-all duration-500 ${
                        isFocused
                          ? `${COLOR_VALUES[colorKey]} shadow-lg`
                          : 'bg-black/40 border-white/10 text-white/70'
                      }`}>
                        <meta.icon size={11} />
                        {meta.label}
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                      <h3 className="text-base md:text-lg font-black uppercase italic leading-tight mb-1 drop-shadow-xl">
                        {dest.name_vi}
                      </h3>
                      <p className="text-[9px] md:text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-2 italic drop-shadow-lg">
                        {dest.name_en}
                      </p>
                      <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-400/70">
                        <MapPin size={9} />
                        {dest.province_current_2026.split(';')[0].trim()}
                      </div>
                    </div>

                    {/* Hover info panel */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 md:p-6 transition-all duration-500 ${
                      isFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}>
                      <p className="text-[10px] md:text-[11px] leading-relaxed text-zinc-300 uppercase tracking-tight font-medium italic line-clamp-4 mb-4">
                        {dest.green_basis}
                      </p>
                      <span className="inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                        <Eye size={12} /> Khám phá thêm
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-40 py-16 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-20">
          <Leaf size={14} />
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">GreenStats</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.8em] opacity-20 italic">
          Heritage Data Project &copy; 2026
        </p>
      </footer>

      {/* Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }

        select option {
          background: #18181b;
          color: white;
        }
        select:focus option:hover {
          background: #27272a;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.3); border-radius: 99px; }
      `}} />
    </div>
  );
};

const ExplorePage = () => {
  return <ExploreContent />;
};

export default ExplorePage;
