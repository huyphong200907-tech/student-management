# Cổng sinh viên – có trang đăng nhập demo

Xem [HUONG_DAN_DANG_NHAP.md](HUONG_DAN_DANG_NHAP.md) để biết tài khoản demo và cách triển khai.

# Cổng thông tin sinh viên — Bài tập lớn Thiết kế web

Dự án HTML, CSS, JavaScript thuần gồm **Tổng quan, Học phí, Lịch học, Kết quả, Profile**. Giao diện tham khảo ảnh người dùng cung cấp: thanh điều hướng xanh đậm, banner xanh, các thẻ nội dung nền trắng. Logo SVG trong dự án là biểu tượng minh họa tự dựng, không phải logo chính thức.

## Chạy trên localhost — không dùng Live Server

Máy cần có **Node.js 18 trở lên**. Không cần `npm install`, cơ sở dữ liệu hoặc kết nối Internet để chạy.

1. Giải nén thư mục `student-portal`.
2. Mở Terminal / PowerShell ngay trong thư mục chứa `package.json`.
3. Chạy:

   ```sh
   npm start
   ```

   Hoặc chạy trực tiếp (nếu PowerShell chặn `npm.ps1`):

   ```sh
   node server.js
   ```

4. Mở **http://localhost:3000** trên trình duyệt.
5. Dừng máy chủ bằng **Ctrl+C** trong Terminal.

Máy chủ chỉ lắng nghe tại `127.0.0.1:3000`, không xuất bản website lên Internet. Nếu cổng 3000 đã được dùng, dừng phiên máy chủ cũ trước khi chạy lại. Không cần mở file HTML trực tiếp.

## Cấu trúc thư mục

```text
student-portal/
├── assets/logo.svg
├── data/database.js
├── js/
│   ├── app.js              # Khởi động, điều phối các trang
│   ├── config.js           # Hàm dùng chung, điều hướng, icon
│   ├── state.js            # Trạng thái, localStorage
│   ├── layout.js           # Menu, header, hộp thoại
│   ├── news.js             # Thông báo và tìm kiếm
│   ├── csv.js              # Xuất CSV
│   └── pages/             # Mỗi trang một file JavaScript
│       ├── overview.js
│       ├── tuition.js
│       ├── schedule.js
│       ├── results.js
│       └── profile.js
├── pages/                  # 4 trang HTML phụ
│   ├── hoc-phi.html
│   ├── lich-hoc.html
│   ├── ket-qua.html
│   └── profile.html
├── styles/
│   ├── main.css           # Chỉ chứa @import
│   ├── base.css
│   ├── sidebar.css
│   ├── layout.css
│   ├── overview.css
│   ├── components.css
│   ├── tuition.css
│   ├── schedule.css
│   ├── results.css
│   ├── profile.css
│   ├── dialog.css
│   └── responsive.css
├── index.html
├── package.json
└── server.js
```

### Chạy trên GitHub Pages

Trang HTML sử dụng `<script type="module" src="...">` để tải `js/app.js` và các module import.

Trong GitHub, chọn **Settings → Pages → Deploy from a branch → main → /(root)**. Trang tĩnh có thể chạy ở đường dẫn dạng `https://USERNAME.github.io/student-management/`. GitHub Pages không chạy `server.js` (máy chủ này chỉ cần cho localhost).

Thay đổi `styles/main.css` thành các lệnh `@import` để dùng thực sự các file CSS đã tách. Giữ thứ tự import; `responsive.css` ở cuối.

## Các chức năng

| Trang | Chức năng |
| --- | --- |
| Tổng quan | Thống kê GPA, tín chỉ, học phí; lối tắt; thông báo có nội dung chi tiết; hoạt động và nhắc việc |
| Học phí | Lọc 2 học kỳ; chọn từng khoản hoặc tất cả; xác nhận thanh toán mô phỏng; lịch sử; khôi phục dữ liệu mẫu; xuất CSV |
| Lịch học | Chuyển tuần trước/sau; về tuần hiện tại; xem dạng tuần/danh sách; bấm buổi học xem chi tiết |
| Kết quả | Lọc 2 học kỳ; điểm quá trình, điểm thi, điểm chữ; GPA có trọng số; biểu đồ phân bố; xuất bảng điểm CSV |
| Profile | Xem hồ sơ học vụ; sửa email, điện thoại, địa chỉ, giới thiệu; kiểm tra dữ liệu nhập; lưu hoặc hủy thay đổi |

Thanh tìm kiếm tìm thông báo, tên/mã học phần và các trang. Nhập từ khóa rồi nhấn Enter. Menu thu gọn trên điện thoại. Các bảng rộng và thời khóa biểu có thể cuộn ngang.

## Dữ liệu và công thức

- Mọi thông tin, học phí, giảng viên, lịch, điểm và thông báo đều là **dữ liệu minh họa**; không kết nối với trường hay ngân hàng.
- Các kết quả của học kỳ I đã điền sẵn để trình diễn, không phản ánh tiến độ học kỳ ngoài thực tế.
- Lịch mẫu lặp hàng tuần từ 07/09 đến 20/12/2026; ban đầu hiển thị tuần 05–11/10/2026. Ngoài thời gian đó trang hiển thị không có lịch. Chưa xử lý nghỉ lễ hoặc thi.
- Điểm tổng kết = 40% quá trình + 60% điểm thi, làm tròn 1 chữ số thập phân.
- A ≥ 8.5, B ≥ 7.0, C ≥ 5.5, D ≥ 4.0, F < 4.0; quy đổi hệ 4 tương ứng 4, 3, 2, 1, 0.
- GPA = tổng (điểm hệ 4 × tín chỉ) / tổng tín chỉ. GPA tích lũy tính trên cả 2 học kỳ mẫu.
- Quy tắc xếp loại GPA mẫu: từ 3.6 Xuất sắc; từ 3.2 Giỏi; từ 2.5 Khá; các mức thấp hơn hiển thị theo ngưỡng trong `js/pages/results.js`. Đây không phải quy định đào tạo chính thức.

## Lưu dữ liệu

Thông tin liên hệ lưu trong `localStorage` với khóa `portal-profile-v1`; thanh toán mô phỏng lưu với khóa `portal-payments-v1`. Tải lại trang vẫn giữ dữ liệu. Nút **Đặt lại dữ liệu** tại trang Học phí xóa giao dịch mô phỏng và đưa học phí về trạng thái ban đầu.

Dữ liệu chỉ thuộc trình duyệt và địa chỉ đang dùng. `localhost:3000` và `127.0.0.1:3000` có vùng lưu trữ khác nhau. Xóa dữ liệu website trong trình duyệt sẽ khôi phục toàn bộ mẫu. Chế độ riêng tư hoặc chặn lưu trữ có thể khiến việc lưu không hoạt động.

Đây là ứng dụng frontend cho bài tập thiết kế web, không có đăng nhập, API tài khoản hoặc cơ sở dữ liệu backend. `server.js` chỉ phục vụ tệp tĩnh. Các nút thanh toán tuyệt đối không yêu cầu thông tin ngân hàng.

## Chỉnh sửa và trình bày bài tập

- Đổi dữ liệu mẫu ở `data/database.js`.
- Đổi màu, khoảng cách, kích thước và breakpoint ở `styles/main.css`.
- Các hàm `overview`, `tuition`, `schedule`, `results`, `profile` trong `js/app.js` dựng nội dung từng trang; hàm `render` chọn trang dựa trên `data-page` của thẻ body.
- Khi sửa file, tải lại trình duyệt để xem kết quả. Máy chủ không tự làm mới trang và không dùng Live Server.
- Có thể thay biểu tượng `assets/logo.svg` bằng logo được phép sử dụng.

## Kiểm tra thủ công

1. Mở đủ 5 mục trên thanh điều hướng.
2. Tìm “Thiết kế web”; mở thông báo và đóng bằng nút Đóng/Escape.
3. Chọn cả 3 khoản học phí chưa đóng; tổng tiền phải là 3.600.000 ₫; xác nhận mô phỏng rồi tải lại trang. Dư nợ phải là 0 ₫. Đặt lại dữ liệu sau khi thử.
4. Chuyển sang học kỳ II ở Kết quả: 3 môn, 8 tín chỉ, GPA 3.38. Học kỳ I: 5 môn, 14 tín chỉ, GPA 3.43. GPA toàn bộ: 3.41.
5. Chuyển tuần lịch học, đổi sang danh sách, mở chi tiết buổi học.
6. Sửa Profile, lưu, tải lại; thử email sai định dạng hoặc số điện thoại không đủ 10 chữ số để kiểm tra validation.
7. Xuất CSV và mở bằng Excel hoặc trình soạn thảo hỗ trợ UTF-8.
8. Thu nhỏ cửa sổ để kiểm tra menu di động và cuộn ngang bảng.

## Công nghệ sử dụng

HTML5 (cấu trúc, form, dialog), CSS3 (Grid, Flexbox, media queries), JavaScript ES6+ (mảng, DOM, sự kiện, localStorage, Blob), Node.js (HTTP và filesystem có sẵn). Không dùng framework, CDN, font bên ngoài hay dịch vụ trả phí.
