import { createClient } from '@supabase/supabase-js';

// Dùng Service Role Key để có quyền ghi đè (Bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name } = body; // Giả sử Google Form gửi 2 trường này

    if (!email) return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });

    // 1. Kiểm tra User đã tồn tại chưa
    const { data: user, error: findError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (user) {
      // 2. Nếu có rồi, cộng thêm 1 lượt quay
      await supabaseAdmin
        .from('profiles')
        .update({ spins_available: user.spins_available + 1 })
        .eq('email', email);
    } else {
      // 3. Nếu chưa có, tạo mới và cho 1 lượt quay "mở bát"
      await supabaseAdmin
        .from('profiles')
        .insert([{ 
          id: crypto.randomUUID(), // Tạo ID tạm thời nếu chưa Auth Google
          email, 
          display_name: name || 'User', 
          spins_available: 1 
        }]);
    }

    return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}