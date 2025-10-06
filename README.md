# HRIS - Event Rewards Module

Hệ thống quản lý nhân sự với module thưởng sự kiện - một công cụ giải trí và khích lệ nhân viên thông qua trắc nghiệm và quay thưởng.

## Tính năng chính

### Cho nhân viên:
- 🎯 Tham gia quiz trắc nghiệm theo sự kiện
- 🎡 Quay thưởng khi đạt điểm tối thiểu (nhận 500k-1M VNĐ)
- 📊 Xem dashboard cá nhân và lịch sử thưởng
- 🏆 Theo dõi tổng số tiền thưởng đã nhận

### Cho HR Manager:
- 📅 Quản lý sự kiện và cấu hình quiz
- 📝 Tạo và quản lý ngân hàng câu hỏi
- 👥 Quản lý người dùng và phân quyền
- 📈 Xem báo cáo và thống kê chi tiết

## Tech Stack

### Backend
- **Runtime**: Node.js với TypeScript
- **Framework**: Express.js
- **Database**: SQLite với Prisma ORM
- **Authentication**: JWT & bcrypt

### Frontend  
- **Framework**: React 18 với TypeScript
- **Build Tool**: Vite
- **UI Library**: TailwindCSS + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6

## Cấu trúc dự án

```
hris/
├── client/              # Frontend React app
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities (API, auth)
│   │   └── types/       # TypeScript types
│   └── package.json
├── src/                 # Backend Express app
│   ├── modules/         # Feature modules
│   │   ├── auth/
│   │   ├── events/
│   │   ├── quiz/
│   │   ├── spin/
│   │   └── users/
│   ├── middleware/      # Express middleware
│   └── config/          # Configuration
├── prisma/              # Database schema & migrations
│   ├── schema.prisma
│   └── seed.ts
└── docs/                # Documentation
```

## Cài đặt

### Prerequisites
- Node.js 18+
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone https://github.com/quanghai2k4/hris.git
cd hris
```

### Bước 2: Cài đặt dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd client
npm install
cd ..
```

### Bước 3: Setup database
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### Bước 4: Tạo file .env
```bash
cp .env.example .env
```

Cấu hình các biến môi trường:
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key"
PORT=5000
```

## Chạy ứng dụng

### Development mode

**Backend** (terminal 1):
```bash
npm run dev
```
Backend chạy tại: http://localhost:5000

**Frontend** (terminal 2):
```bash
cd client
npm run dev
```
Frontend chạy tại: http://localhost:5174

### Production build

**Backend:**
```bash
npm run build
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## Tài khoản demo

Sau khi seed database, bạn có thể đăng nhập với:

**HR Manager:**
- Email: `hr@company.com`
- Password: `password123`

**Nhân viên:**
- Email: `employee@company.com`  
- Password: `password123`

## API Documentation

API endpoints được định nghĩa trong file `docs/openapi.yaml`

**Base URL**: `http://localhost:5000/api`

### Main endpoints:
- `POST /auth/login` - Đăng nhập
- `GET /events` - Lấy danh sách sự kiện
- `GET /quiz/session/:eventId` - Bắt đầu quiz
- `POST /quiz/submit` - Nộp bài quiz
- `POST /spin/spin` - Quay thưởng
- `GET /spin/history` - Lịch sử quay thưởng

## Database Schema

Xem chi tiết ERD tại: [docs/erd.md](docs/erd.md)

**Main tables:**
- `User` - Người dùng (nhân viên, HR)
- `Event` - Sự kiện thưởng
- `Question` - Câu hỏi trắc nghiệm
- `QuizSession` - Phiên làm bài
- `SpinCode` - Mã quay thưởng
- `SpinResult` - Kết quả quay thưởng

## Scripts hữu ích

```bash
# Backend
npm run dev              # Chạy dev server với hot reload
npm run build            # Build TypeScript
npm run start            # Chạy production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Chạy migrations
npm run prisma:seed      # Seed database

# Frontend  
cd client
npm run dev              # Chạy Vite dev server
npm run build            # Build cho production
npm run preview          # Preview production build
npm run lint             # Chạy ESLint
```

## Tài liệu

- [Business Analysis](docs/business-analysis.md)
- [C4 Model](docs/c4-model.md)
- [ERD](docs/erd.md)
- [MVP Proposal](docs/mvp-proposal.md)
- [Requirements](docs/requirement.md)
- [OpenAPI Specification](docs/openapi.yaml)

## License

ISC

## Author

Quang Hai
