import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { email } = await request.json();

    // 1. Lấy thông tin User & Danh sách Quà đang Active
    const { data: user } = await supabaseAdmin.from('profiles').expectOne().eq('email', email).single();
    if (!user || user.spins_available <= 0) return new Response('Hết lượt', { status: 400 });

    const { data: allPrizes } = await supabaseAdmin.from('prizes').select('*').eq('is_active', true).order('sort_order', { ascending: true });

    // 2. Kiểm tra kho quà thực tế
    const { data: stock } = await supabaseAdmin.from('inventory').select('*').eq('is_used', false);
    
    // Lọc lấy những ID quà còn hàng
    const availablePrizeIds = [...new Set(stock.map(item => item.prize_id))];
    
    // 3. Quyết định trúng ô nào
    let winningPrize;
    const hasRealPrizes = availablePrizeIds.length > 0;

    if (hasRealPrizes) {
      // Còn quà -> Quay ngẫu nhiên công bằng trên toàn bộ vòng quay
      winningPrize = allPrizes[Math.floor(Math.random() * allPrizes.length)];
      
      // Nếu đen đủi trúng ô quà nhưng ô đó vừa hết sạch (Double check)
      if (winningPrize.type !== 'NO_PRIZE' && !availablePrizeIds.includes(winningPrize.id)) {
        winningPrize = allPrizes.find(p => p.type === 'NO_PRIZE');
      }
    } else {
      // HẾT SẠCH QUÀ -> Ép vào ô NO_PRIZE
      winningPrize = allPrizes.find(p => p.type === 'NO_PRIZE');
    }

    // 4. Tính toán Target Angle (Hiệu ứng sát nút 90-95%)
    const prizeIndex = allPrizes.findIndex(p => p.id === winningPrize.id);
    const anglePerPrize = 360 / allPrizes.length;
    
    // Đẩy kim về phía cuối ô (0.4 đến 0.45 là vùng 90-95% của ô tính từ tâm)
    const nearMissOffset = anglePerPrize * (0.4 + Math.random() * 0.05);
    const targetAngle = (360 * 10) + (360 - (prizeIndex * anglePerPrize) - (anglePerPrize / 2)) + nearMissOffset;

    // 5. Cập nhật DB: Trừ lượt quay, trừ quà trong kho (nếu trúng)
    let wonCode = "N/A";
    if (winningPrize.type !== 'NO_PRIZE') {
      const item = stock.find(s => s.prize_id === winningPrize.id);
      wonCode = item.credential_code;
      await supabaseAdmin.from('inventory').update({ is_used: true, won_by_email: email }).eq('id', item.id);
    }

    await supabaseAdmin.from('profiles').update({ spins_available: user.spins_available - 1 }).eq('email', email);
    await supabaseAdmin.from('spin_history').insert([{ user_email: email, prize_name: winningPrize.name, won_code: wonCode }]);

    return new Response(JSON.stringify({
      prizeName: winningPrize.name,
      gift: wonCode,
      targetAngle: targetAngle,
      spinsLeft: user.spins_available - 1
    }), { status: 200 });

  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}