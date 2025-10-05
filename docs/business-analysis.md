# Phân tích Yêu cầu Nghiệp vụ (BA) - Module Thưởng Sự Kiện

## 1. Tổng quan dự án

Module Thưởng Sự Kiện là một tính năng bổ sung cho hệ thống HRIS nhằm khuyến khích nhân viên tham gia các hoạt động nội bộ thông qua cơ chế làm bài trắc nghiệm và quay thưởng.

## 2. Các vai trò người dùng (Actors)

### 2.1 Nhân viên (Employee)
- Đăng nhập vào hệ thống HRIS
- Tham gia làm bài trắc nghiệm
- Nhận mã quay thưởng khi đạt điểm yêu cầu
- Quay thưởng để nhận tiền thưởng
- Xem lịch sử thưởng của mình

### 2.2 Phòng Nhân sự/HR (HR Manager)
- Tạo và quản lý sự kiện thưởng
- Thiết lập bộ câu hỏi trắc nghiệm
- Cấu hình ngưỡng điểm đủ điều kiện nhận mã quay
- Cấu hình khoảng tiền thưởng (500K - 1M VNĐ)
- Quản lý ngân sách thưởng
- Xem báo cáo thống kê

### 2.3 Hệ thống (System)
- Tự động chấm điểm bài làm
- Tự động cấp mã quay thưởng khi đủ điều kiện
- Tạo số tiền thưởng ngẫu nhiên trong khoảng quy định
- Lưu trữ lịch sử thưởng

## 3. Luồng nghiệp vụ chính

### 3.1 Luồng làm bài trắc nghiệm và nhận mã quay

```
Nhân viên → Đăng nhập HRIS
         → Truy cập "Thưởng sự kiện"
         → Chọn sự kiện muốn tham gia
         → Bắt đầu làm bài trắc nghiệm
         → Trả lời các câu hỏi
         → Nộp bài
         → Hệ thống chấm điểm tự động
         → [Điểm >= X] → Nhận mã quay thưởng
         → [Điểm < X] → Thông báo không đủ điều kiện
```

### 3.2 Luồng quay thưởng

```
Nhân viên → Có mã quay thưởng
         → Nhấn nút "Quay thưởng"
         → Hệ thống hiển thị vòng quay
         → Hệ thống random số tiền (500K - 1M)
         → Hiển thị kết quả
         → Lưu vào lịch sử thưởng
         → Cập nhật ngân sách
```

### 3.3 Luồng xem lịch sử thưởng

```
Nhân viên → Truy cập "Lịch sử thưởng"
         → Xem danh sách các lần quay
         → Xem chi tiết từng lần (thời gian, số tiền, sự kiện)
```

### 3.4 Luồng quản lý sự kiện (HR)

```
HR Manager → Tạo sự kiện mới
           → Đặt tên, mô tả sự kiện
           → Thiết lập thời gian bắt đầu/kết thúc
           → Cấu hình ngưỡng điểm (X)
           → Tạo bộ câu hỏi trắc nghiệm
           → Cấu hình khoảng tiền thưởng
           → Thiết lập ngân sách sự kiện
           → Kích hoạt sự kiện
```

## 4. Chức năng chi tiết

### 4.1 Module Nhân viên

#### 4.1.1 Quản lý Sự kiện
- **Xem danh sách sự kiện**: Hiển thị các sự kiện đang mở
- **Chi tiết sự kiện**: Xem thông tin sự kiện, quy định, thời gian

#### 4.1.2 Làm bài trắc nghiệm
- **Bắt đầu làm bài**: Khởi tạo phiên làm bài mới
- **Trả lời câu hỏi**: Chọn đáp án cho từng câu hỏi
- **Nộp bài**: Gửi bài làm để chấm điểm
- **Xem kết quả**: Điểm số, số câu đúng/sai
- **Nhận mã quay**: Tự động nhận nếu đạt điểm

#### 4.1.3 Quay thưởng
- **Xem mã quay sẵn có**: Danh sách mã chưa sử dụng
- **Quay thưởng**: Thực hiện quay với animation
- **Nhận kết quả**: Số tiền nhận được

#### 4.1.4 Lịch sử thưởng
- **Xem lịch sử**: Danh sách các lần quay
- **Tổng hợp**: Tổng số tiền đã nhận
- **Bộ lọc**: Theo sự kiện, thời gian

### 4.2 Module HR Manager

#### 4.2.1 Quản lý Sự kiện
- **Tạo sự kiện mới**
- **Chỉnh sửa sự kiện**
- **Xóa/Hủy sự kiện**
- **Kích hoạt/Vô hiệu hóa sự kiện**

#### 4.2.2 Quản lý Câu hỏi
- **Tạo câu hỏi**: Nội dung, đáp án, đáp án đúng
- **Thêm câu hỏi vào sự kiện**
- **Chỉnh sửa câu hỏi**
- **Xóa câu hỏi**
- **Import/Export câu hỏi**

#### 4.2.3 Cấu hình
- **Thiết lập ngưỡng điểm**: Điểm tối thiểu để nhận mã quay
- **Cấu hình khoảng tiền thưởng**: Min/Max (500K - 1M)
- **Thiết lập ngân sách**: Tổng ngân sách cho sự kiện
- **Cấu hình số lượng câu hỏi**: Số câu hỏi trong 1 bài

#### 4.2.4 Báo cáo & Thống kê
- **Thống kê tham gia**: Số lượng nhân viên tham gia
- **Thống kê điểm số**: Điểm trung bình, phân bố điểm
- **Thống kê thưởng**: Tổng tiền đã thưởng, còn lại
- **Danh sách nhân viên**: Ai đã làm bài, ai đã quay thưởng
- **Export báo cáo**: Xuất Excel/PDF

## 5. Yêu cầu nghiệp vụ chi tiết

### 5.1 Quy tắc chấm điểm
- Mỗi câu hỏi có giá trị bằng nhau
- Điểm = (Số câu đúng / Tổng số câu) × 100
- Chỉ tính điểm câu trả lời đúng hoàn toàn
- Không có điểm âm

### 5.2 Quy tắc nhận mã quay
- Nhân viên phải đạt điểm >= X (do HR cấu hình)
- Mỗi lần làm bài đạt yêu cầu sẽ nhận 1 mã quay
- Mã quay không có thời hạn sử dụng (trong thời gian sự kiện)
- Có thể tích lũy nhiều mã quay

### 5.3 Quy tắc quay thưởng
- Số tiền thưởng random trong khoảng [500.000 - 1.000.000] VNĐ
- Phân bố đều (uniform distribution)
- Mỗi mã quay chỉ sử dụng được 1 lần
- Sau khi quay, mã quay bị deactivate
- Kết quả lưu ngay vào database

### 5.4 Quy tắc tham gia sự kiện
- Nhân viên có thể làm bài nhiều lần cho cùng 1 sự kiện
- Mỗi lần làm bài là 1 phiên độc lập
- Không giới hạn số lần làm bài (trừ khi HR cấu hình)
- Chỉ làm bài được khi sự kiện đang active

### 5.5 Quy tắc ngân sách
- HR thiết lập tổng ngân sách cho sự kiện
- Hệ thống cảnh báo khi ngân sách gần hết (< 20%)
- Có thể tạm dừng sự kiện khi hết ngân sách
- Theo dõi tổng tiền đã chi và còn lại

## 6. Ràng buộc và Quy tắc nghiệp vụ

### 6.1 Ràng buộc dữ liệu
- Sự kiện phải có ít nhất 5 câu hỏi
- Mỗi câu hỏi phải có 2-6 đáp án
- Chỉ 1 đáp án đúng cho mỗi câu hỏi
- Ngưỡng điểm: 0-100
- Khoảng tiền thưởng: Min >= 0, Max <= 10.000.000
- Min < Max

### 6.2 Ràng buộc thời gian
- Thời gian kết thúc > Thời gian bắt đầu
- Không chỉnh sửa sự kiện đang diễn ra (chỉ có thể tạm dừng)
- Không xóa sự kiện đã có người tham gia

### 6.3 Ràng buộc bảo mật
- Nhân viên chỉ xem được lịch sử của mình
- HR xem được toàn bộ dữ liệu
- Đáp án đúng không được expose trong API response khi làm bài
- Logging đầy đủ các thao tác quan trọng

### 6.4 Ràng buộc hiệu năng
- Thời gian response API < 1s
- Hỗ trợ đồng thời 1000 users làm bài
- Vòng quay animation mượt mà

## 7. Yêu cầu phi chức năng

### 7.1 Tính minh bạch
- Kết quả chấm điểm phải rõ ràng (hiển thị câu đúng/sai)
- Công thức tính điểm công khai
- Cơ chế random phải fair (có thể audit)

### 7.2 Tính công bằng
- Câu hỏi random từ pool (nếu pool lớn hơn số câu yêu cầu)
- Thứ tự đáp án được shuffle
- Không có câu hỏi trùng trong 1 bài

### 7.3 Tính sẵn sàng
- Uptime: 99.9%
- Backup dữ liệu hàng ngày
- Recovery time < 1 giờ

### 7.4 Khả năng mở rộng
- Dễ dàng thêm loại câu hỏi mới (checkbox, điền từ...)
- Dễ dàng thêm loại thưởng mới (voucher, quà tặng...)
- Tích hợp với hệ thống payroll để trả thưởng tự động

## 8. Use Cases chính

### UC-01: Làm bài trắc nghiệm
**Actor**: Nhân viên  
**Precondition**: Đã đăng nhập, sự kiện đang active  
**Main Flow**:
1. Nhân viên chọn sự kiện
2. Hệ thống hiển thị thông tin sự kiện
3. Nhân viên nhấn "Bắt đầu làm bài"
4. Hệ thống tạo phiên làm bài, random câu hỏi
5. Nhân viên trả lời từng câu hỏi
6. Nhân viên nhấn "Nộp bài"
7. Hệ thống chấm điểm
8. Hệ thống hiển thị kết quả
9. [Nếu điểm >= X] Hệ thống tạo mã quay thưởng
10. Hệ thống thông báo nhân viên

**Postcondition**: Bài làm được lưu, mã quay được tạo (nếu đủ điều kiện)

### UC-02: Quay thưởng
**Actor**: Nhân viên  
**Precondition**: Có ít nhất 1 mã quay chưa sử dụng  
**Main Flow**:
1. Nhân viên vào mục "Quay thưởng"
2. Hệ thống hiển thị số mã quay sẵn có
3. Nhân viên nhấn "Quay thưởng"
4. Hệ thống hiển thị animation vòng quay
5. Hệ thống random số tiền (500K - 1M)
6. Hệ thống hiển thị kết quả
7. Hệ thống lưu kết quả vào database
8. Hệ thống deactivate mã quay đã sử dụng
9. Hệ thống cập nhật ngân sách sự kiện

**Postcondition**: Mã quay đã sử dụng, kết quả được lưu, ngân sách cập nhật

### UC-03: Tạo sự kiện (HR)
**Actor**: HR Manager  
**Precondition**: Đã đăng nhập với quyền HR  
**Main Flow**:
1. HR vào "Quản lý sự kiện"
2. HR nhấn "Tạo sự kiện mới"
3. HR nhập thông tin sự kiện (tên, mô tả, thời gian)
4. HR cấu hình ngưỡng điểm
5. HR cấu hình khoảng tiền thưởng
6. HR thiết lập ngân sách
7. HR thêm/tạo câu hỏi
8. HR kích hoạt sự kiện
9. Hệ thống validate và lưu

**Postcondition**: Sự kiện mới được tạo và sẵn sàng cho nhân viên

### UC-04: Xem báo cáo (HR)
**Actor**: HR Manager  
**Precondition**: Đã đăng nhập với quyền HR, có dữ liệu sự kiện  
**Main Flow**:
1. HR vào "Báo cáo"
2. HR chọn sự kiện cần xem
3. Hệ thống hiển thị dashboard
4. HR xem các thống kê (số người tham gia, tổng thưởng...)
5. HR có thể filter/group theo tiêu chí
6. HR có thể export báo cáo

**Postcondition**: HR có thông tin cần thiết để đánh giá sự kiện

## 9. Acceptance Criteria

### 9.1 Đối với nhân viên
- [ ] Có thể xem danh sách sự kiện đang active
- [ ] Có thể làm bài trắc nghiệm và nhận kết quả ngay
- [ ] Nhận mã quay khi đạt điểm yêu cầu
- [ ] Có thể quay thưởng và nhận số tiền ngẫu nhiên 500K-1M
- [ ] Xem được lịch sử các lần quay thưởng
- [ ] UI/UX thân thiện, dễ sử dụng
- [ ] Animation vòng quay mượt mà, hấp dẫn

### 9.2 Đối với HR
- [ ] Có thể tạo/sửa/xóa sự kiện
- [ ] Có thể tạo/quản lý bộ câu hỏi
- [ ] Có thể cấu hình các tham số (điểm, tiền, ngân sách)
- [ ] Xem được báo cáo chi tiết
- [ ] Theo dõi được ngân sách realtime
- [ ] Export được dữ liệu

### 9.3 Đối với hệ thống
- [ ] Chấm điểm chính xác 100%
- [ ] Random số tiền công bằng
- [ ] Không duplicate mã quay
- [ ] Data consistency (không mất dữ liệu)
- [ ] Performance đạt yêu cầu
- [ ] Security đảm bảo (không lộ đáp án, không hack được)

## 10. Rủi ro và Giải pháp

### 10.1 Rủi ro: Nhân viên spam làm bài
**Giải pháp**: 
- Giới hạn số lần làm bài mỗi ngày
- Thêm cooldown time giữa các lần làm bài
- Captcha nếu cần

### 10.2 Rủi ro: Hết ngân sách giữa chừng
**Giải pháp**:
- Cảnh báo sớm khi ngân sách < 20%
- Cho phép HR bổ sung ngân sách
- Tự động tạm dừng sự kiện khi hết ngân sách

### 10.3 Rủi ro: Gian lận (chia sẻ đáp án)
**Giải pháp**:
- Random câu hỏi từ pool lớn
- Shuffle thứ tự câu hỏi và đáp án
- Giới hạn thời gian làm bài
- Không hiển thị đáp án đúng sau khi làm

### 10.4 Rủi ro: Performance khi nhiều người làm bài cùng lúc
**Giải pháp**:
- Caching câu hỏi
- Database indexing
- Load balancing
- Queue system cho việc tạo mã quay

## 11. Prioritization (MoSCoW)

### Must Have (MVP)
- Tạo sự kiện với bộ câu hỏi cố định
- Nhân viên làm bài trắc nghiệm
- Tự động chấm điểm
- Cấp mã quay khi đủ điều kiện
- Quay thưởng với số tiền random
- Lưu lịch sử thưởng
- Dashboard HR cơ bản

### Should Have
- Random câu hỏi từ pool
- Shuffle đáp án
- Giới hạn số lần làm bài
- Báo cáo chi tiết
- Export dữ liệu
- Quản lý ngân sách

### Could Have
- Import/Export câu hỏi từ Excel
- Multiple choice (nhiều đáp án đúng)
- Câu hỏi có hình ảnh
- Leaderboard
- Notification realtime
- Mobile app

### Won't Have (Phase 1)
- Tích hợp payroll tự động
- AI generate câu hỏi
- Video tutorial
- Gamification nâng cao
