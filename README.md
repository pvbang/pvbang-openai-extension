# 🧠 Phan V. Bang AI Assistant

## ✨ Tính năng chính

**Trợ lý AI thông minh** với giao diện hiện đại, tích hợp **Google Gemini AI** để xử lý văn bản một cách nhanh chóng và chính xác.

### 🔥 Các tính năng:

- **📝 Tóm tắt**: Tóm tắt nội dung văn bản một cách súc tích và dễ hiểu
- **🌐 Dịch tiếng Việt**: Dịch văn bản từ các ngôn ngữ khác sang tiếng Việt tự nhiên
- **🔍 Phân tích**: Phân tích sâu nội dung từ nhiều góc độ
- **❓ Hỏi đáp**: Đặt câu hỏi và nhận câu trả lời chi tiết
- **💡 Tìm hiểu**: Cung cấp thông tin đầy đủ về chủ đề bất kỳ

### 🎯 Đặc điểm nổi bật:

- ✅ Giao diện đẹp mắt, hiện đại với thiết kế gradient
- ✅ Hỗ trợ văn bản được chọn hoặc từ clipboard
- ✅ Context menu thông minh với các tùy chọn nhanh
- ✅ Tất cả phản hồi bằng tiếng Việt
- ✅ Prompt được tối ưu cho từng tính năng
- ✅ Sao chép kết quả dễ dàng
- ✅ Responsive design

## 🚀 Cài đặt

### 1. Chuẩn bị
- API key Google Gemini đã được tích hợp sẵn
- Trình duyệt Chrome/Edge

### 2. Cài đặt Extension
```bash
1. Truy cập: chrome://extensions/
2. Bật "Developer mode" (Chế độ nhà phát triển)
3. Nhấn "Load unpacked" (Tải extension đã giải nén)
4. Chọn thư mục chứa extension này
5. Extension sẽ xuất hiện trong thanh công cụ
```

## 📖 Hướng dẫn sử dụng

### Cách 1: Sử dụng Icon Extension
```bash
1. Chọn (select) văn bản trên trang web hoặc sao chép vào clipboard
2. Nhấn vào icon "🧠 Phan V. Bang AI" trên thanh công cụ
3. Chọn tính năng muốn sử dụng từ các nút bấm
4. Chờ AI xử lý và xem kết quả
5. Có thể sao chép kết quả bằng nút copy
```

### Cách 2: Context Menu (Menu chuột phải)
```bash
1. Chọn văn bản trên trang web
2. Nhấn chuột phải → chọn "🧠 Phan V. Bang AI Assistant"
3. Chọn tính năng cụ thể từ submenu:
   - 📝 Tóm tắt
   - 🌐 Dịch sang tiếng Việt  
   - 🔍 Phân tích
   - ❓ Hỏi đáp về nội dung
   - 💡 Tìm hiểu thông tin
4. Extension sẽ tự động xử lý văn bản
```

### Cách 3: Phím tắt
```bash
Nhấn Alt + Shift + Z để mở nhanh trợ lý AI
```

## 🛠 Cấu trúc dự án

```
├── manifest.json          # Manifest V3 extension
├── popup.html             # Giao diện chính
├── popup.css              # Thiết kế hiện đại với gradient
├── popup.js               # Logic chính tích hợp Gemini API
├── background.js          # Service worker & context menu
├── axios.min.js           # Thư viện HTTP client
├── icon.png               # Icon extension
└── README.md              # Tài liệu hướng dẫn
```

## 🎨 Giao diện

- **Header**: Logo và trạng thái kết nối
- **Văn bản đã chọn**: Hiển thị nội dung sẽ được xử lý
- **Nút chức năng**: 5 tính năng chính với icon trực quan
- **Kết quả**: Hiển thị đầy đủ với khả năng sao chép
- **Footer**: Thông tin nguồn AI

## 🔧 Kỹ thuật

- **Manifest Version**: 3 (Chrome Extensions MV3)
- **AI Provider**: Google Gemini Pro
- **Frontend**: HTML5, CSS3 (Grid, Flexbox, Gradients)
- **JavaScript**: ES6+, Chrome Extension APIs
- **Icons**: Boxicons
- **HTTP Client**: Axios

## 🎯 Tối ưu hóa

- Prompt được thiết kế chuyên nghiệp cho từng tính năng
- Xử lý lỗi thông minh với thông báo tiếng Việt
- Giao diện responsive, tối ưu UX/UI
- Loading states và transitions mượt mà
- Caching và tối ưu hiệu năng

## 📝 Changelog V2.0

- ✅ Chuyển từ OpenAI sang Google Gemini
- ✅ Thiết kế lại hoàn toàn giao diện
- ✅ Thêm 5 tính năng AI chuyên biệt
- ✅ Context menu thông minh
- ✅ Tất cả phản hồi bằng tiếng Việt
- ✅ Prompt engineering chuyên nghiệp
- ✅ Cải thiện UX/UI đáng kể

---

## 👨‍💻 Developer: Phan Văn Bằng
- **Facebook**: [fb.com/it0902](https://fb.com/pvbang.id)
- **Github**: [github.com/pvbang](https://github.com/pvbang)
- **Email**: phanvanbang.dev@gmail.com

---

*🌟 Nếu extension hữu ích, hãy để lại ⭐ trên GitHub! 🌟*