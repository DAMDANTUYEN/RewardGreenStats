import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase Admin (Bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  // 🛡️ LỚP BẢO MẬT 1: Kiểm tra Secret Key từ Header
  const receivedSecret = request.headers.get('X-Webhook-Secret');
  const serverSecret = process.env.GOOGLE_WEBHOOK_SECRET;

  if (!receivedSecret || receivedSecret !== serverSecret) {
    console.error("⛔ [Cảnh báo] Truy cập trái phép bị chặn!");
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
    }

    console.log(`🚀 [Webhook] Đang xử lý cho: ${email}`);

    // 🛡️ LỚP BẢO MẬT 2: Xử lý logic an toàn với Database
    const { data: user, error: findError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (user) {
      // Nếu đã có: Cộng thêm 1 lượt quay
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ spins_available: (user.spins_available || 0) + 2 })
        .eq('email', email);
      
      if (updateError) throw updateError;
      console.log(`✅ Đã cộng lượt quay cho ${email}.`);
    } else {
      // Nếu chưa có: Tạo mới profile
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert([{ 
          email: email, 
          display_name: name || 'Guest', 
          spins_available: 3 
        }]);

      if (insertError) throw insertError;
      console.log(`✨ Đã tạo profile mới cho ${email}.`);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("🔥 Lỗi thực thi:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}