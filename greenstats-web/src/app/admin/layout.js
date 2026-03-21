const ADMIN_EMAILS = ['nguyentrannhatan2812@gmail.com']; // Thêm email của bạn vào đây

if (!ADMIN_EMAILS.includes(user?.email)) {
  return <div className="text-red-500">Truy cập bị từ chối!</div>;
}