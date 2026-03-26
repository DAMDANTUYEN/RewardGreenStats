"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, History, Gift, Mail, Plus, Trash2, 
  ChevronRight, CheckCircle2, Loader2, Zap, 
  Key, X, RefreshCcw, Tv, Music, PlayCircle, 
  Star, Ticket, Smartphone, Coffee, Camera, Eye, EyeOff, Save, Shield
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('prizes');
  const [loading, setLoading] = useState(true);
  const [prizes, setPrizes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [inventoryCounts, setInventoryCounts] = useState({});
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalSpins: 0, totalUsers: 0, totalPrizes: 0 });

  // States cho Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddAccModal, setShowAddAccModal] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);
  
  // State cho bộ nạp Acc dạng ô nhập (Dynamic Inputs)
  const [accountInputs, setAccountInputs] = useState([""]); 

  // State cho Form tạo giải mới
  const [newPrize, setNewPrize] = useState({
    name: "",
    type: "REAL",
    image_url: "Tv",
    probability: 10,
    initial_codes: [""]
  });

  // --- FETCH DATA ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: pList } = await supabase.from('prizes').select('*').order('sort_order', { ascending: true });
      const { data: inv } = await supabase.from('inventory').select('*').eq('is_used', false);
      const { data: prof } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const { data: logs } = await supabase.from('spin_history').select('*').order('created_at', { ascending: false });

      const counts = inv?.reduce((acc, curr) => {
        acc[curr.prize_id] = (acc[curr.prize_id] || 0) + 1;
        return acc;
      }, {}) || {};

      setPrizes(pList || []);
      setInventory(inv || []);
      setInventoryCounts(counts);
      setUsers(prof || []);
      setHistory(logs || []);
      setStats({
        totalSpins: logs?.length || 0,
        totalUsers: prof?.length || 0,
        totalPrizes: pList?.length || 0
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- LOGIC QUẢN LÝ GIẢI THƯỞNG ---
  const handleCreatePrize = async () => {
    if (!newPrize.name) return alert("Vui lòng nhập tên giải!");
    
    const { data: prizeData, error } = await supabase
      .from('prizes')
      .insert([{
        name: newPrize.name,
        type: newPrize.type,
        image_url: newPrize.image_url,
        probability: parseFloat(newPrize.probability),
        is_active: true,
        color: newPrize.type === 'NO_PRIZE' ? 'rgba(255,255,255,0.05)' : 'rgba(16, 185, 129, 0.2)'
      }])
      .select();

    if (error) return alert("Lỗi tạo giải!");

    // Nạp acc ban đầu nếu có
    const validCodes = newPrize.initial_codes.filter(c => c.trim() !== "");
    if (newPrize.type === 'REAL' && validCodes.length > 0) {
      const invData = validCodes.map(c => ({ prize_id: prizeData[0].id, credential_code: c.trim() }));
      await supabase.from('inventory').insert(invData);
    }

    setShowCreateModal(false);
    setNewPrize({ name: "", type: "REAL", image_url: "Tv", probability: 10, initial_codes: [""] });
    fetchData();
  };

  const toggleActive = async (id, currentStatus) => {
    await supabase.from('prizes').update({ is_active: !currentStatus }).eq('id', id);
    fetchData();
  };

  const deletePrize = async (id) => {
    if (confirm("Xác nhận xóa giải thưởng này và toàn bộ kho tài khoản đi kèm?")) {
      await supabase.from('prizes').delete().eq('id', id);
      fetchData();
    }
  };

  const handleUpdateProb = async (id, val) => {
    await supabase.from('prizes').update({ probability: parseFloat(val) }).eq('id', id);
    fetchData();
  };

  // --- LOGIC NẠP ACC DẠNG Ô (DYNAMIC) ---
  const addAccountRow = () => setAccountInputs([...accountInputs, ""]);
  const removeAccountRow = (index) => setAccountInputs(accountInputs.filter((_, i) => i !== index));
  const updateAccountInput = (index, val) => {
    const newInputs = [...accountInputs];
    newInputs[index] = val;
    setAccountInputs(newInputs);
  };

  const submitAccounts = async () => {
    const validCodes = accountInputs.filter(c => c.trim() !== "");
    if (validCodes.length === 0) return alert("Vui lòng nhập ít nhất 1 tài khoản!");

    const data = validCodes.map(code => ({
      prize_id: selectedPrize.id,
      credential_code: code.trim()
    }));

    const { error } = await supabase.from('inventory').insert(data);
    if (!error) {
      setShowAddAccModal(false);
      setAccountInputs([""]);
      fetchData();
    }
  };

  const deleteSingleAcc = async (id) => {
    await supabase.from('inventory').delete().eq('id', id);
    fetchData();
  };

  // --- RENDER HELPERS ---
  const renderIcon = (name) => {
    if (name.startsWith('http')) return <img src={name} className="w-5 h-5 object-contain" alt="icon" />;
    const Icons = { Tv, Music, PlayCircle, Star, Ticket, Smartphone, Coffee, Camera };
    const IconTag = Icons[name] || Star;
    return <IconTag size={18} />;
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white font-poppins p-6 md:p-12">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 mb-2 font-black uppercase tracking-[0.3em] text-[10px]">
            <Shield size={16} /> GreenStats Control Authority
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">System <span className="text-emerald-500">Dashboard</span></h1>
        </div>
        <div className="flex gap-4">
          <Link href="/spin" className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Về Web Chính</Link>
          <button onClick={() => setShowCreateModal(true)} className="px-6 py-3 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20">
            <Plus size={16} /> Thêm ô quay mới
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-7xl mx-auto bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="flex border-b border-white/5 p-4 gap-2 bg-black/20">
          <button onClick={() => setActiveTab('prizes')} className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'prizes' ? 'bg-emerald-500 text-black shadow-lg' : 'text-white/40 hover:bg-white/5'}`}>Kho Quà & Tỉ Lệ</button>
          <button onClick={() => setActiveTab('users')} className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-emerald-500 text-black shadow-lg' : 'text-white/40 hover:bg-white/5'}`}>Người dùng</button>
          <button onClick={() => setActiveTab('history')} className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-emerald-500 text-black shadow-lg' : 'text-white/40 hover:bg-white/5'}`}>Lịch sử quay</button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4 text-emerald-500"><Loader2 size={40} className="animate-spin" /></div>
          ) : (
            <>
              {/* TAB: PRIZES & INVENTORY */}
              {activeTab === 'prizes' && (
                <div className="space-y-12 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prizes.map((p) => (
                      <div key={p.id} className={`bg-black/40 border p-6 rounded-[2.5rem] transition-all ${p.is_active ? 'border-white/10' : 'border-red-500/20 opacity-60 grayscale'}`}>
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-2xl text-emerald-400 border border-white/5">{renderIcon(p.image_url)}</div>
                            <div>
                              <h3 className="text-lg font-black uppercase italic tracking-tighter leading-tight">{p.name}</h3>
                              <span className={`text-[8px] font-bold uppercase tracking-widest ${p.type === 'NO_PRIZE' ? 'text-white/30' : 'text-emerald-500'}`}>
                                {p.type === 'NO_PRIZE' ? 'Ô Không Quà' : 'Có Tài Khoản'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => toggleActive(p.id, p.is_active)} className={`p-2 rounded-lg transition-all ${p.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/10 text-white/40'}`}>
                              {p.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <button onClick={() => deletePrize(p.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-black transition-all"><Trash2 size={16} /></button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-1">Tỉ lệ trúng</span>
                            <div className="flex items-center text-emerald-500 font-black">
                              <input type="number" defaultValue={p.probability} onBlur={(e) => handleUpdateProb(p.id, e.target.value)} className="w-10 bg-transparent outline-none text-right" />
                              <span className="ml-0.5">%</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-1">Tồn kho</span>
                            <span className="text-xl font-black">{p.type === 'NO_PRIZE' ? '∞' : (inventoryCounts[p.id] || 0)}</span>
                          </div>
                          {p.type === 'REAL' && (
                            <button onClick={() => { setSelectedPrize(p); setShowAddAccModal(true); }} className="p-3 bg-emerald-500 text-black rounded-2xl hover:scale-110 transition-all shadow-lg"><Plus size={18} /></button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DANH SÁCH ACC CHI TIẾT */}
                  <div className="mt-16">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-6 flex items-center gap-2">
                      <div className="w-1 h-4 bg-emerald-500"></div> Chi tiết tài khoản trong kho
                    </h2>
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-white/5 text-[9px] font-bold uppercase tracking-widest text-white/30">
                          <tr><th className="p-5">Mục giải</th><th className="p-5">Mã tài khoản / Link</th><th className="p-5">Ngày tạo</th><th className="p-5 text-right">Xóa lẻ</th></tr>
                        </thead>
                        <tbody className="text-xs">
                          {inventory.map((item) => (
                            <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                              <td className="p-5 font-black text-emerald-400 uppercase">{prizes.find(p => p.id === item.prize_id)?.name}</td>
                              <td className="p-5 font-mono text-white/60">{item.credential_code}</td>
                              <td className="p-5 text-white/20">{new Date(item.created_at).toLocaleDateString()}</td>
                              <td className="p-5 text-right"><button onClick={() => deleteSingleAcc(item.id)} className="text-white/20 hover:text-red-500 transition-colors"><Trash2 size={14} /></button></td>
                            </tr>
                          ))}
                          {inventory.length === 0 && <tr><td colSpan="4" className="p-10 text-center text-white/20 font-bold uppercase tracking-widest">Kho đang trống</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: USERS */}
              {activeTab === 'users' && (
                <table className="w-full text-left border-collapse animate-fade-in">
                  <thead>
                    <tr className="text-[10px] text-white/30 uppercase tracking-widest border-b border-white/5"><th className="pb-4">Email người dùng</th><th className="pb-4">Lượt quay</th><th className="pb-4 text-right">Ngày đăng ký</th></tr>
                  </thead>
                  <tbody className="text-sm">
                    {users.map((u, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01]"><td className="py-5 text-white/80 font-medium">{u.email}</td><td className="py-5"><span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-black text-[10px]">{u.spins_available} LƯỢT</span></td><td className="py-5 text-right text-white/20">{new Date(u.created_at).toLocaleDateString()}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* TAB: HISTORY */}
              {activeTab === 'history' && (
                <table className="w-full text-left border-collapse animate-fade-in">
                  <thead>
                    <tr className="text-[10px] text-white/30 uppercase tracking-widest border-b border-white/5"><th className="pb-4">Email</th><th className="pb-4">Giải thưởng</th><th className="pb-4">Mã nhận được</th><th className="pb-4 text-right">Hành động</th></tr>
                  </thead>
                  <tbody className="text-sm italic">
                    {history.map((h, i) => (
                      <tr key={i} className="border-b border-white/5"><td className="py-5 text-white/60">{h.user_email}</td><td className="py-5 text-emerald-400 font-black">{h.prize_name}</td><td className="py-5 font-mono text-xs text-white/20">{h.won_code}</td><td className="py-5 text-right"><button onClick={() => window.location.href=`mailto:${h.user_email}`} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"><Mail size={16} /></button></td></tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL: TẠO GIẢI MỚI */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-fade-in">
          <div className="bg-zinc-900 border border-emerald-500/30 rounded-[3rem] w-full max-w-2xl p-10 relative shadow-2xl">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={24} /></button>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8 text-emerald-500">Cấu hình ô quay mới</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase text-white/30 mb-2 block">Loại giải thưởng</label>
                  <div className="flex p-1 bg-black/40 rounded-2xl border border-white/10">
                    <button onClick={() => setNewPrize({...newPrize, type: 'REAL'})} className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase ${newPrize.type === 'REAL' ? 'bg-emerald-500 text-black shadow-lg' : 'text-white/40'}`}>Thật</button>
                    <button onClick={() => setNewPrize({...newPrize, type: 'NO_PRIZE'})} className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase ${newPrize.type === 'NO_PRIZE' ? 'bg-red-500 text-black shadow-lg' : 'text-white/40'}`}>Ô trượt</button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-white/30 mb-2 block">Tên hiển thị</label>
                  <input value={newPrize.name} onChange={(e) => setNewPrize({...newPrize, name: e.target.value})} placeholder="Netflix 4K..." className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-white/30 mb-2 block">Icon (Tên Lucide / Link ảnh)</label>
                  <input value={newPrize.image_url} onChange={(e) => setNewPrize({...newPrize, image_url: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-mono outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase text-white/30 mb-2 block">Tỉ lệ (%)</label>
                  <input type="number" value={newPrize.probability} onChange={(e) => setNewPrize({...newPrize, probability: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-emerald-500 font-black text-2xl outline-none" />
                </div>
                {newPrize.type === 'REAL' && (
                  <div>
                    <label className="text-[10px] font-bold uppercase text-white/30 mb-2 block">Nạp mã ban đầu (mỗi dòng 1 mã)</label>
                    <textarea 
                      onChange={(e) => setNewPrize({...newPrize, initial_codes: e.target.value.split('\n')})} 
                      className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-mono outline-none focus:border-emerald-500" 
                    />
                  </div>
                )}
              </div>
            </div>
            <button onClick={handleCreatePrize} className="w-full mt-10 py-4 bg-emerald-500 text-black font-black uppercase text-xs tracking-widest rounded-full hover:scale-[1.02] transition-all shadow-xl shadow-emerald-500/20">Xác nhận tạo mới</button>
          </div>
        </div>
      )}

      {/* MODAL: NẠP KHO DẠNG Ô (DYNAMIC INPUTS) */}
      {showAddAccModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-fade-in">
          <div className="bg-zinc-900 border border-emerald-500/30 rounded-[3rem] w-full max-w-xl p-10 relative shadow-2xl">
            <button onClick={() => setShowAddAccModal(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={24} /></button>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-emerald-500 text-black rounded-2xl shadow-lg shadow-emerald-500/20"><Key size={24} /></div>
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Nạp tài khoản: {selectedPrize?.name}</h2>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Sử dụng dấu (+) để thêm nhiều dòng nhập</p>
              </div>
            </div>

            <div className="max-h-[350px] overflow-y-auto pr-3 custom-scrollbar space-y-3 mb-10">
              {accountInputs.map((val, idx) => (
                <div key={idx} className="flex gap-2 animate-scale-up">
                  <input 
                    value={val} 
                    onChange={(e) => updateAccountInput(idx, e.target.value)}
                    placeholder="Nhập thông tin acc / code..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-mono text-emerald-400 outline-none focus:border-emerald-500 transition-all shadow-inner"
                  />
                  {accountInputs.length > 1 && (
                    <button onClick={() => removeAccountRow(idx)} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-black transition-all"><Trash2 size={18} /></button>
                  )}
                </div>
              ))}
              <button onClick={addAccountRow} className="w-full py-5 border-2 border-dashed border-white/10 rounded-2xl text-white/20 hover:text-emerald-500 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2">
                <Plus size={20} /> <span className="text-[10px] font-black uppercase tracking-widest">Thêm ô nhập acc tiếp theo</span>
              </button>
            </div>

            <button onClick={submitAccounts} className="w-full py-4 bg-emerald-500 text-black font-black uppercase text-xs tracking-[0.3em] rounded-full shadow-xl shadow-emerald-500/40 hover:scale-[1.02] transition-all">Lưu vào kho hệ thống</button>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-up { animation: scaleUp 0.3s ease-out forwards; }
      `}} />
    </main>
  );
}