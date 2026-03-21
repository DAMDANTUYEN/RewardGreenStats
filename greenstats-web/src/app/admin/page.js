"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Layout, Package, Gift, Users, Plus, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('prizes');
  const [prizes, setPrizes] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: p } = await supabase.from('prizes').select('*').order('id');
    const { data: i } = await supabase.from('inventory').select('*, prizes(name)');
    setPrizes(p || []);
    setInventory(i || []);
  }

  // Hàm thêm code mới vào kho
  async function addInventory(prizeId, code) {
    await supabase.from('inventory').insert([{ prize_id: prizeId, credential_code: code }]);
    fetchData();
  }

  return (
    <div className="min-h-screen bg-[#020c08] text-emerald-400 p-8 font-mono">
      <h1 className="text-3xl font-black mb-8 border-b border-emerald-500/30 pb-4 flex items-center gap-3">
        <Layout className="text-emerald-500" /> SYSTEM CONTROL CENTER
      </h1>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Mini */}
        <div className="col-span-12 md:col-span-2 space-y-4">
          <button onClick={() => setActiveTab('prizes')} className={`w-full p-3 flex items-center gap-2 border ${activeTab === 'prizes' ? 'bg-emerald-500 text-black' : 'border-emerald-500/30'}`}>
            <Gift size={18} /> Prizes
          </button>
          <button onClick={() => setActiveTab('inventory')} className={`w-full p-3 flex items-center gap-2 border ${activeTab === 'inventory' ? 'bg-emerald-500 text-black' : 'border-emerald-500/30'}`}>
            <Package size={18} /> Inventory
          </button>
        </div>

        {/* Content Area */}
        <div className="col-span-12 md:col-span-10 bg-black/40 border border-emerald-500/20 p-6 rounded-xl">
          {activeTab === 'prizes' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-emerald-500/30 text-xs uppercase opacity-60">
                    <th className="p-3">Tên Quà</th>
                    <th className="p-3">Loại</th>
                    <th className="p-3">Màu</th>
                    <th className="p-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {prizes.map(p => (
                    <tr key={p.id} className="border-b border-emerald-500/10 hover:bg-emerald-500/5">
                      <td className="p-3 font-bold">{p.name}</td>
                      <td className="p-3 text-xs">{p.type}</td>
                      <td className="p-3"><div className="w-4 h-4 rounded" style={{backgroundColor: p.color}}></div></td>
                      <td className="p-3">{p.is_active ? '✅ Active' : '❌ Off'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">KHO CODE HIỆN TẠI</h2>
                <button className="bg-emerald-500 text-black px-4 py-2 text-xs font-bold flex items-center gap-2">
                  <Plus size={14} /> THÊM CODE MỚI
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory.map(item => (
                  <div key={item.id} className={`p-4 border ${item.is_used ? 'border-red-500/30 opacity-40' : 'border-emerald-500/30'}`}>
                    <p className="text-[10px] opacity-50 uppercase">{item.prizes?.name}</p>
                    <p className="font-mono text-sm break-all">{item.credential_code}</p>
                    <p className="text-[10px] mt-2">{item.is_used ? `Đã thuộc về: ${item.won_by_email}` : 'Chưa sử dụng'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}