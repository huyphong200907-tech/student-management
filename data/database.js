// Dữ liệu minh họa, không kết nối với hệ thống của trường.
window.PORTAL_DATA = {
  student: { name: 'Trần Đức Sinh', id: '241200123', className: 'CNTT 02 · K65', major: 'Công nghệ thông tin', faculty: 'Công nghệ thông tin', course: '2024 – 2028', birthday: '2006-05-18', email: 'sinh241200123@example.com', phone: '0912345678', address: 'Cầu Giấy, Hà Nội', bio: 'Sinh viên Công nghệ thông tin, yêu thích lập trình và thiết kế web.' },
  semesters: [{ id: '2026-1', name: 'Học kỳ I · 2026 – 2027' }, { id: '2025-2', name: 'Học kỳ II · 2025 – 2026' }],
  fees: [
    { id: 'F01', semester: '2026-1', name: 'Thiết kế web', code: 'IT301', credits: 3, amount: 1350000, paid: false },
    { id: 'F02', semester: '2026-1', name: 'Cơ sở dữ liệu', code: 'IT302', credits: 3, amount: 1350000, paid: false },
    { id: 'F03', semester: '2026-1', name: 'Lập trình hướng đối tượng', code: 'IT303', credits: 3, amount: 1350000, paid: true },
    { id: 'F04', semester: '2026-1', name: 'Mạng máy tính', code: 'IT304', credits: 3, amount: 1350000, paid: true },
    { id: 'F05', semester: '2026-1', name: 'Tiếng Anh chuyên ngành', code: 'EN301', credits: 2, amount: 900000, paid: false },
    { id: 'F06', semester: '2025-2', name: 'Giải tích 2', code: 'MA202', credits: 3, amount: 1350000, paid: true },
    { id: 'F07', semester: '2025-2', name: 'Cấu trúc dữ liệu và giải thuật', code: 'IT202', credits: 3, amount: 1350000, paid: true },
    { id: 'F08', semester: '2025-2', name: 'Tiếng Anh 2', code: 'EN202', credits: 2, amount: 900000, paid: true }
  ],
  schedule: [
    { day: 0, start: '07:00', end: '09:25', name: 'Thiết kế web', code: 'IT301', room: '403 · A2', teacher: 'Nguyễn Minh Anh', type: 'Lý thuyết', color: 'blue' },
    { day: 0, start: '13:00', end: '15:25', name: 'Cơ sở dữ liệu', code: 'IT302', room: '302 · A3', teacher: 'Lê Hoàng Nam', type: 'Lý thuyết', color: 'purple' },
    { day: 1, start: '09:35', end: '12:00', name: 'Lập trình hướng đối tượng', code: 'IT303', room: '501 · A2', teacher: 'Trần Thu Hà', type: 'Lý thuyết', color: 'green' },
    { day: 2, start: '07:00', end: '09:25', name: 'Mạng máy tính', code: 'IT304', room: '402 · A3', teacher: 'Phạm Quang Huy', type: 'Lý thuyết', color: 'orange' },
    { day: 3, start: '13:00', end: '15:25', name: 'Thiết kế web', code: 'IT301', room: 'Lab 02 · B1', teacher: 'Nguyễn Minh Anh', type: 'Thực hành', color: 'blue' },
    { day: 4, start: '07:00', end: '08:35', name: 'Tiếng Anh chuyên ngành', code: 'EN301', room: '201 · A1', teacher: 'Vũ Ngọc Mai', type: 'Lý thuyết', color: 'pink' }
  ],
  results: [
    { semester: '2026-1', code: 'IT301', name: 'Thiết kế web', credits: 3, process: 9.0, exam: 8.5 },
    { semester: '2026-1', code: 'IT302', name: 'Cơ sở dữ liệu', credits: 3, process: 8.0, exam: 8.0 },
    { semester: '2026-1', code: 'IT303', name: 'Lập trình hướng đối tượng', credits: 3, process: 8.5, exam: 9.0 },
    { semester: '2026-1', code: 'IT304', name: 'Mạng máy tính', credits: 3, process: 7.5, exam: 7.0 },
    { semester: '2026-1', code: 'EN301', name: 'Tiếng Anh chuyên ngành', credits: 2, process: 8.5, exam: 8.0 },
    { semester: '2025-2', code: 'MA202', name: 'Giải tích 2', credits: 3, process: 7.0, exam: 7.5 },
    { semester: '2025-2', code: 'IT202', name: 'Cấu trúc dữ liệu và giải thuật', credits: 3, process: 9.0, exam: 8.5 },
    { semester: '2025-2', code: 'EN202', name: 'Tiếng Anh 2', credits: 2, process: 8.0, exam: 7.5 }
  ],
  news: [
    { id: 1, category: 'school', date: '2026-10-09', title: 'Thông báo kế hoạch năm học 2026 – 2027', text: 'Sinh viên theo dõi lịch học và các mốc thời gian của học kỳ trên cổng thông tin. Kiểm tra thông tin cá nhân trước khi hoàn thành các thủ tục đầu năm học.' },
    { id: 2, category: 'school', date: '2026-10-07', title: 'Chương trình học bổng khuyến khích học tập học kỳ I', text: 'Chương trình minh họa dành cho sinh viên có thành tích học tập tốt. Hồ sơ mẫu gồm bảng điểm, đơn đề nghị và thông tin hoạt động sinh viên. Hạn tiếp nhận minh họa: 30/10/2026.' },
    { id: 3, category: 'school', date: '2026-10-05', title: 'Tuần lễ sinh viên sáng tạo và nghiên cứu khoa học', text: 'Đăng ký ý tưởng về công nghệ, giao thông và phát triển bền vững tại văn phòng khoa. Các nhóm chuẩn bị bản mô tả ý tưởng và sản phẩm minh họa.' },
    { id: 4, category: 'training', date: '2026-10-09', title: 'Lịch đăng ký bổ sung học phần học kỳ I năm học 2026 – 2027', text: 'Thời gian đăng ký minh họa từ ngày 12/10 đến 16/10/2026. Sinh viên kiểm tra điều kiện học phần và số tín chỉ trước khi đăng ký.' },
    { id: 5, category: 'training', date: '2026-10-08', title: 'Hướng dẫn tra cứu thời khóa biểu và phòng học', text: 'Chọn mục Lịch học, sử dụng nút Tuần trước hoặc Tuần sau để xem lịch. Bấm vào từng buổi học để xem giảng viên, phòng học và thời gian.' },
    { id: 6, category: 'training', date: '2026-10-06', title: 'Kế hoạch kiểm tra giữa kỳ và đánh giá học phần', text: 'Điểm học phần mẫu được tính bằng 40% điểm quá trình và 60% điểm thi. Quy tắc trong dự án chỉ phục vụ minh họa và không đại diện quy định chính thức của trường.' }
  ]
};
