# MVP - Module Thưởng Sự Kiện

## 1. Phạm vi MVP (Minimum Viable Product)

### 1.1 Mục tiêu MVP
Xây dựng phiên bản tối thiểu để chạy thử nghiệm Module Thưởng Sự Kiện với các chức năng cốt lõi:
- Nhân viên làm bài trắc nghiệm và quay thưởng
- HR tạo sự kiện và quản lý câu hỏi cơ bản
- Hệ thống tự động chấm điểm và random tiền thưởng

### 1.2 Phạm vi chức năng MVP

#### Bao gồm (Must Have):
- ✅ **Auth**: Đăng nhập đơn giản (hardcode 2-3 users)
- ✅ **Event Management**: CRUD sự kiện cơ bản (HR)
- ✅ **Question Management**: CRUD câu hỏi và thêm vào sự kiện (HR)
- ✅ **Quiz**: Làm bài trắc nghiệm với 10 câu cố định
- ✅ **Grading**: Chấm điểm tự động
- ✅ **Spin Code**: Tự động tạo mã khi đạt điểm
- ✅ **Spin**: Quay thưởng với animation đơn giản
- ✅ **History**: Xem lịch sử quay thưởng
- ✅ **Budget Tracking**: Theo dõi ngân sách cơ bản
- ✅ **Dashboard**: Thống kê đơn giản cho HR

#### Không bao gồm (Future):
- ❌ Shuffle câu hỏi/đáp án
- ❌ Giới hạn số lần làm bài
- ❌ Time limit cho bài làm
- ❌ Export báo cáo Excel/PDF
- ❌ Notification realtime
- ❌ Tích hợp payroll
- ❌ Advanced analytics
- ❌ Responsive mobile (chỉ desktop)

### 1.3 Dữ liệu mẫu MVP

#### Users (hardcoded)
```json
[
  {
    "id": "user-001",
    "employee_id": "EMP001",
    "full_name": "Nguyễn Văn A",
    "email": "nva@company.com",
    "role": "employee",
    "password": "123456"
  },
  {
    "id": "user-002",
    "employee_id": "EMP002",
    "full_name": "Trần Thị B",
    "email": "ttb@company.com",
    "role": "employee",
    "password": "123456"
  },
  {
    "id": "hr-001",
    "employee_id": "HR001",
    "full_name": "Lê Văn HR",
    "email": "hr@company.com",
    "role": "hr_manager",
    "password": "hr123"
  }
]
```

#### Sample Event
```json
{
  "id": "event-001",
  "name": "Sự kiện Tháng 10 - Kiến thức về Công ty",
  "description": "Trả lời câu hỏi về lịch sử, văn hóa công ty để nhận thưởng",
  "status": "active",
  "start_date": "2025-10-01T00:00:00Z",
  "end_date": "2025-10-31T23:59:59Z",
  "config": {
    "min_score": 70,
    "question_count": 10,
    "prize_min": 500000,
    "prize_max": 1000000,
    "shuffle_questions": false,
    "shuffle_answers": false
  },
  "budget": {
    "total_budget": 50000000,
    "used_budget": 0,
    "remaining_budget": 50000000
  }
}
```

#### Sample Questions (10 câu cố định)
```json
[
  {
    "id": "q-001",
    "content": "Công ty ABC được thành lập vào năm nào?",
    "type": "single_choice",
    "answers": [
      { "id": "a-001-1", "content": "2015", "is_correct": false },
      { "id": "a-001-2", "content": "2018", "is_correct": true },
      { "id": "a-001-3", "content": "2020", "is_correct": false },
      { "id": "a-001-4", "content": "2022", "is_correct": false }
    ]
  },
  {
    "id": "q-002",
    "content": "Giá trị cốt lõi của công ty là gì?",
    "type": "single_choice",
    "answers": [
      { "id": "a-002-1", "content": "Tận tâm - Chuyên nghiệp - Sáng tạo", "is_correct": true },
      { "id": "a-002-2", "content": "Nhanh - Mạnh - Đẹp", "is_correct": false },
      { "id": "a-002-3", "content": "Chất lượng - Uy tín", "is_correct": false },
      { "id": "a-002-4", "content": "Đoàn kết - Tiến bộ", "is_correct": false }
    ]
  },
  {
    "id": "q-003",
    "content": "CEO hiện tại của công ty là ai?",
    "type": "single_choice",
    "answers": [
      { "id": "a-003-1", "content": "Nguyễn Văn X", "is_correct": false },
      { "id": "a-003-2", "content": "Trần Văn Y", "is_correct": true },
      { "id": "a-003-3", "content": "Lê Thị Z", "is_correct": false },
      { "id": "a-003-4", "content": "Phạm Văn W", "is_correct": false }
    ]
  },
  {
    "id": "q-004",
    "content": "Công ty có bao nhiêu chi nhánh tại Việt Nam?",
    "type": "single_choice",
    "answers": [
      { "id": "a-004-1", "content": "3", "is_correct": false },
      { "id": "a-004-2", "content": "5", "is_correct": true },
      { "id": "a-004-3", "content": "7", "is_correct": false },
      { "id": "a-004-4", "content": "10", "is_correct": false }
    ]
  },
  {
    "id": "q-005",
    "content": "Sản phẩm chính của công ty là gì?",
    "type": "single_choice",
    "answers": [
      { "id": "a-005-1", "content": "Phần mềm HRIS", "is_correct": true },
      { "id": "a-005-2", "content": "Ứng dụng mobile", "is_correct": false },
      { "id": "a-005-3", "content": "Phần cứng máy tính", "is_correct": false },
      { "id": "a-005-4", "content": "Dịch vụ tư vấn", "is_correct": false }
    ]
  },
  {
    "id": "q-006",
    "content": "Ngày thành lập công ty được tổ chức kỷ niệm vào ngày nào?",
    "type": "single_choice",
    "answers": [
      { "id": "a-006-1", "content": "15/03", "is_correct": true },
      { "id": "a-006-2", "content": "20/11", "is_correct": false },
      { "id": "a-006-3", "content": "01/01", "is_correct": false },
      { "id": "a-006-4", "content": "30/04", "is_correct": false }
    ]
  },
  {
    "id": "q-007",
    "content": "Công ty có tổ chức team building mấy lần trong năm?",
    "type": "single_choice",
    "answers": [
      { "id": "a-007-1", "content": "1 lần", "is_correct": false },
      { "id": "a-007-2", "content": "2 lần", "is_correct": true },
      { "id": "a-007-3", "content": "3 lần", "is_correct": false },
      { "id": "a-007-4", "content": "4 lần", "is_correct": false }
    ]
  },
  {
    "id": "q-008",
    "content": "Khẩu hiệu của công ty là gì?",
    "type": "single_choice",
    "answers": [
      { "id": "a-008-1", "content": "Vươn cao - Vươn xa", "is_correct": false },
      { "id": "a-008-2", "content": "Cùng nhau phát triển", "is_correct": true },
      { "id": "a-008-3", "content": "Tạo giá trị bền vững", "is_correct": false },
      { "id": "a-008-4", "content": "Chất lượng là danh dự", "is_correct": false }
    ]
  },
  {
    "id": "q-009",
    "content": "Công ty có chính sách làm việc từ xa không?",
    "type": "single_choice",
    "answers": [
      { "id": "a-009-1", "content": "Có, 2 ngày/tuần", "is_correct": true },
      { "id": "a-009-2", "content": "Có, toàn thời gian", "is_correct": false },
      { "id": "a-009-3", "content": "Không", "is_correct": false },
      { "id": "a-009-4", "content": "Có, 1 ngày/tháng", "is_correct": false }
    ]
  },
  {
    "id": "q-010",
    "content": "Số lượng nhân viên hiện tại của công ty khoảng bao nhiêu?",
    "type": "single_choice",
    "answers": [
      { "id": "a-010-1", "content": "100-200", "is_correct": false },
      { "id": "a-010-2", "content": "200-300", "is_correct": false },
      { "id": "a-010-3", "content": "300-500", "is_correct": true },
      { "id": "a-010-4", "content": "500-1000", "is_correct": false }
    ]
  }
]
```

## 2. Tech Stack MVP

### 2.1 Frontend
```
Framework: React 18 + TypeScript
UI Library: Ant Design / Material-UI
State: React Context API (đơn giản hơn Redux)
Routing: React Router v6
HTTP Client: Axios
Animation: CSS animations (cho vòng quay)
Build: Vite
```

### 2.2 Backend
```
Runtime: Node.js 18+
Framework: Express.js
Language: TypeScript
Validation: Zod
Database: SQLite (cho MVP, dễ setup)
ORM: Prisma
Auth: JWT (simple)
```

### 2.3 Database
```
Development: SQLite (file-based, không cần server)
Production ready: PostgreSQL (migration dễ dàng)
```

### 2.4 DevOps
```
Container: Docker + Docker Compose
Dev: Nodemon + Vite hot reload
Testing: Jest (backend) + Vitest (frontend)
```

## 3. Cấu trúc dự án MVP

```
hris-mvp/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── error-handler.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.routes.ts
│   │   │   ├── events/
│   │   │   │   ├── event.controller.ts
│   │   │   │   ├── event.service.ts
│   │   │   │   └── event.routes.ts
│   │   │   ├── questions/
│   │   │   │   ├── question.controller.ts
│   │   │   │   ├── question.service.ts
│   │   │   │   └── question.routes.ts
│   │   │   ├── quiz/
│   │   │   │   ├── quiz.controller.ts
│   │   │   │   ├── quiz.service.ts
│   │   │   │   ├── grading.service.ts
│   │   │   │   └── quiz.routes.ts
│   │   │   └── spin/
│   │   │       ├── spin.controller.ts
│   │   │       ├── spin.service.ts
│   │   │       ├── random.service.ts
│   │   │       └── spin.routes.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   └── validators.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Loading.tsx
│   │   │   │   └── PrivateRoute.tsx
│   │   │   ├── quiz/
│   │   │   │   ├── QuizStart.tsx
│   │   │   │   ├── QuizQuestion.tsx
│   │   │   │   └── QuizResult.tsx
│   │   │   ├── spin/
│   │   │   │   ├── SpinWheel.tsx
│   │   │   │   ├── SpinHistory.tsx
│   │   │   │   └── SpinCodeList.tsx
│   │   │   └── hr/
│   │   │       ├── EventForm.tsx
│   │   │       ├── QuestionForm.tsx
│   │   │       └── Dashboard.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── employee/
│   │   │   │   ├── EventListPage.tsx
│   │   │   │   ├── QuizPage.tsx
│   │   │   │   └── SpinPage.tsx
│   │   │   └── hr/
│   │   │       ├── EventManagePage.tsx
│   │   │       ├── QuestionManagePage.tsx
│   │   │       └── ReportPage.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── docker-compose.yml
└── README.md
```

## 4. Database Schema MVP (Prisma)

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id          String   @id @default(uuid())
  employeeId  String   @unique @map("employee_id")
  fullName    String   @map("full_name")
  email       String   @unique
  password    String
  role        Role     @default(EMPLOYEE)
  createdAt   DateTime @default(now()) @map("created_at")
  
  quizSessions QuizSession[]
  quizResults  QuizResult[]
  spinCodes    SpinCode[]
  spinResults  SpinResult[]
  
  @@map("users")
}

enum Role {
  EMPLOYEE
  HR_MANAGER
  ADMIN
}

model Event {
  id          String      @id @default(uuid())
  name        String
  description String?
  status      EventStatus @default(DRAFT)
  startDate   DateTime    @map("start_date")
  endDate     DateTime    @map("end_date")
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")
  
  config       EventConfig?
  budget       EventBudget?
  questions    EventQuestion[]
  quizSessions QuizSession[]
  quizResults  QuizResult[]
  spinCodes    SpinCode[]
  spinResults  SpinResult[]
  
  @@map("events")
}

enum EventStatus {
  DRAFT
  ACTIVE
  PAUSED
  COMPLETED
  CANCELLED
}

model EventConfig {
  id                 String  @id @default(uuid())
  eventId            String  @unique @map("event_id")
  minScore           Int     @map("min_score")
  questionCount      Int     @map("question_count")
  prizeMin           Decimal @map("prize_min")
  prizeMax           Decimal @map("prize_max")
  shuffleQuestions   Boolean @default(false) @map("shuffle_questions")
  shuffleAnswers     Boolean @default(false) @map("shuffle_answers")
  
  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
  
  @@map("event_configs")
}

model EventBudget {
  id               String   @id @default(uuid())
  eventId          String   @unique @map("event_id")
  totalBudget      Decimal  @map("total_budget")
  usedBudget       Decimal  @default(0) @map("used_budget")
  remainingBudget  Decimal  @map("remaining_budget")
  totalSpins       Int      @default(0) @map("total_spins")
  lastUpdated      DateTime @default(now()) @map("last_updated")
  
  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
  
  @@map("event_budgets")
}

model Question {
  id        String   @id @default(uuid())
  content   String
  type      QuestionType @default(SINGLE_CHOICE)
  createdAt DateTime @default(now()) @map("created_at")
  
  answers       Answer[]
  events        EventQuestion[]
  sessionAnswers SessionAnswer[]
  
  @@map("questions")
}

enum QuestionType {
  SINGLE_CHOICE
  MULTIPLE_CHOICE
  TRUE_FALSE
}

model Answer {
  id         String  @id @default(uuid())
  questionId String  @map("question_id")
  content    String
  isCorrect  Boolean @map("is_correct")
  orderIndex Int     @map("order_index")
  
  question Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  sessionAnswers SessionAnswer[]
  
  @@map("answers")
}

model EventQuestion {
  id         String @id @default(uuid())
  eventId    String @map("event_id")
  questionId String @map("question_id")
  orderIndex Int    @map("order_index")
  
  event    Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  question Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  @@unique([eventId, questionId])
  @@map("event_questions")
}

model QuizSession {
  id            String        @id @default(uuid())
  userId        String        @map("user_id")
  eventId       String        @map("event_id")
  status        SessionStatus @default(IN_PROGRESS)
  questionsData String        @map("questions_data")
  startedAt     DateTime      @default(now()) @map("started_at")
  submittedAt   DateTime?     @map("submitted_at")
  
  user    User   @relation(fields: [userId], references: [id])
  event   Event  @relation(fields: [eventId], references: [id])
  answers SessionAnswer[]
  result  QuizResult?
  
  @@map("quiz_sessions")
}

enum SessionStatus {
  IN_PROGRESS
  SUBMITTED
  EXPIRED
  CANCELLED
}

model SessionAnswer {
  id         String   @id @default(uuid())
  sessionId  String   @map("session_id")
  questionId String   @map("question_id")
  answerId   String   @map("answer_id")
  answeredAt DateTime @default(now()) @map("answered_at")
  
  session  QuizSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  question Question    @relation(fields: [questionId], references: [id])
  answer   Answer      @relation(fields: [answerId], references: [id])
  
  @@unique([sessionId, questionId])
  @@map("session_answers")
}

model QuizResult {
  id              String   @id @default(uuid())
  sessionId       String   @unique @map("session_id")
  userId          String   @map("user_id")
  eventId         String   @map("event_id")
  totalQuestions  Int      @map("total_questions")
  correctAnswers  Int      @map("correct_answers")
  score           Decimal
  passedThreshold Boolean  @map("passed_threshold")
  completedAt     DateTime @default(now()) @map("completed_at")
  
  session  QuizSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  user     User        @relation(fields: [userId], references: [id])
  event    Event       @relation(fields: [eventId], references: [id])
  spinCode SpinCode?
  
  @@map("quiz_results")
}

model SpinCode {
  id            String     @id @default(uuid())
  code          String     @unique
  userId        String     @map("user_id")
  eventId       String     @map("event_id")
  quizResultId  String     @unique @map("quiz_result_id")
  status        CodeStatus @default(AVAILABLE)
  createdAt     DateTime   @default(now()) @map("created_at")
  usedAt        DateTime?  @map("used_at")
  
  user       User        @relation(fields: [userId], references: [id])
  event      Event       @relation(fields: [eventId], references: [id])
  quizResult QuizResult  @relation(fields: [quizResultId], references: [id])
  spinResult SpinResult?
  
  @@map("spin_codes")
}

enum CodeStatus {
  AVAILABLE
  USED
  EXPIRED
  CANCELLED
}

model SpinResult {
  id           String   @id @default(uuid())
  spinCodeId   String   @unique @map("spin_code_id")
  userId       String   @map("user_id")
  eventId      String   @map("event_id")
  amount       Decimal
  spunAt       DateTime @default(now()) @map("spun_at")
  
  spinCode SpinCode @relation(fields: [spinCodeId], references: [id])
  user     User     @relation(fields: [userId], references: [id])
  event    Event    @relation(fields: [eventId], references: [id])
  
  @@map("spin_results")
}
```

## 5. API Endpoints MVP

### 5.1 Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### 5.2 Events
```
GET    /api/events
GET    /api/events/:id
POST   /api/events (HR only)
PUT    /api/events/:id (HR only)
POST   /api/events/:id/activate (HR only)
```

### 5.3 Questions
```
GET    /api/questions (HR only)
POST   /api/questions (HR only)
POST   /api/events/:id/questions (HR only - add questions to event)
```

### 5.4 Quiz
```
POST   /api/quiz/start
GET    /api/quiz/sessions/:id
POST   /api/quiz/sessions/:id/answer
POST   /api/quiz/sessions/:id/submit
GET    /api/quiz/my-results
```

### 5.5 Spin
```
GET    /api/spin/codes
POST   /api/spin/execute
GET    /api/spin/history
```

### 5.6 Reports (HR)
```
GET    /api/reports/events/:id/dashboard
GET    /api/reports/events/:id/participants
```

## 6. Frontend Pages MVP

### 6.1 Employee Pages
1. **Login Page** (`/login`)
   - Form đăng nhập đơn giản
   - Username + password

2. **Event List Page** (`/events`)
   - Danh sách sự kiện active
   - Card hiển thị: tên, mô tả, số câu hỏi, khoảng thưởng
   - Button "Tham gia"

3. **Quiz Page** (`/events/:id/quiz`)
   - Hiển thị từng câu hỏi
   - Radio buttons cho đáp án
   - Progress bar
   - Button "Câu tiếp theo" / "Nộp bài"

4. **Quiz Result Page** (`/quiz/result/:id`)
   - Điểm số
   - Số câu đúng/sai
   - Thông báo có mã quay hay không
   - Button "Quay thưởng" (nếu có mã)

5. **Spin Page** (`/spin`)
   - Danh sách mã quay available
   - Vòng quay (CSS animation)
   - Button "Quay"
   - Hiển thị số tiền trúng

6. **Spin History Page** (`/spin/history`)
   - Table: Ngày giờ, Sự kiện, Số tiền
   - Tổng số tiền đã nhận

### 6.2 HR Pages
1. **Event Management Page** (`/hr/events`)
   - Table danh sách sự kiện
   - CRUD operations
   - Button Activate/Pause

2. **Event Form** (`/hr/events/new` | `/hr/events/:id/edit`)
   - Form tạo/sửa sự kiện
   - Cấu hình: tên, ngày, điểm min, tiền min/max, ngân sách

3. **Question Management Page** (`/hr/questions`)
   - Table danh sách câu hỏi
   - CRUD operations
   - Assign questions to events

4. **Dashboard Page** (`/hr/reports/:eventId`)
   - Cards: Tổng người tham gia, Tổng tiền đã trả, Ngân sách còn
   - Chart đơn giản (Bar chart điểm số)
   - Table top participants

## 7. Core Business Logic

### 7.1 Grading Algorithm
```typescript
function gradeQuiz(session: QuizSession, answers: SessionAnswer[]): QuizResult {
  const questions = JSON.parse(session.questionsData);
  let correctCount = 0;
  
  for (const answer of answers) {
    const question = questions.find(q => q.id === answer.questionId);
    const correctAnswer = question.answers.find(a => a.isCorrect);
    
    if (answer.answerId === correctAnswer.id) {
      correctCount++;
    }
  }
  
  const score = (correctCount / questions.length) * 100;
  const passedThreshold = score >= event.config.minScore;
  
  return {
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    score,
    passedThreshold
  };
}
```

### 7.2 Spin Random Algorithm
```typescript
function generatePrizeAmount(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

### 7.3 Auto Create Spin Code
```typescript
async function createSpinCodeIfPassed(result: QuizResult): Promise<SpinCode | null> {
  if (!result.passedThreshold) {
    return null;
  }
  
  const code = `SPIN-${Date.now()}-${randomString(6)}`;
  
  return await db.spinCode.create({
    data: {
      code,
      userId: result.userId,
      eventId: result.eventId,
      quizResultId: result.id,
      status: 'AVAILABLE'
    }
  });
}
```

### 7.4 Budget Update on Spin
```typescript
async function executeSpin(codeId: string): Promise<SpinResult> {
  return await db.$transaction(async (tx) => {
    const code = await tx.spinCode.findUnique({ where: { id: codeId } });
    const event = await tx.event.findUnique({ 
      where: { id: code.eventId },
      include: { config: true, budget: true }
    });
    
    if (code.status !== 'AVAILABLE') {
      throw new Error('Code already used');
    }
    
    if (event.budget.remainingBudget < event.config.prizeMax) {
      throw new Error('Insufficient budget');
    }
    
    const amount = generatePrizeAmount(
      event.config.prizeMin,
      event.config.prizeMax
    );
    
    const result = await tx.spinResult.create({
      data: {
        spinCodeId: codeId,
        userId: code.userId,
        eventId: code.eventId,
        amount
      }
    });
    
    await tx.spinCode.update({
      where: { id: codeId },
      data: { status: 'USED', usedAt: new Date() }
    });
    
    await tx.eventBudget.update({
      where: { eventId: event.id },
      data: {
        usedBudget: { increment: amount },
        remainingBudget: { decrement: amount },
        totalSpins: { increment: 1 }
      }
    });
    
    return result;
  });
}
```

## 8. UI/UX MVP

### 8.1 Spin Wheel Animation
```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(1800deg); /* 5 vòng */
  }
}

.spin-wheel {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: conic-gradient(
    #ff6b6b 0deg 90deg,
    #4ecdc4 90deg 180deg,
    #ffe66d 180deg 270deg,
    #95e1d3 270deg 360deg
  );
  transition: transform 3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.spin-wheel.spinning {
  animation: spin 3s ease-out;
}
```

### 8.2 Quiz Progress
```tsx
<Progress 
  percent={(currentQuestion / totalQuestions) * 100} 
  status="active"
/>
<div>Câu {currentQuestion} / {totalQuestions}</div>
```

## 9. Testing Strategy MVP

### 9.1 Backend Tests (Must Have)
- Unit tests cho grading algorithm
- Unit tests cho random prize algorithm
- Integration tests cho spin transaction

### 9.2 Frontend Tests (Nice to Have)
- Component tests cho SpinWheel
- E2E test cho luồng làm bài + quay thưởng

## 10. Deployment MVP

### 10.1 Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./dev.db
      - JWT_SECRET=your-secret-key
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
```

### 10.2 Environment Variables
```env
# Backend
PORT=3000
DATABASE_URL=file:./dev.db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Frontend
VITE_API_URL=http://localhost:3000
```

## 11. Timeline MVP (2 tuần)

### Week 1
**Day 1-2: Setup & Database**
- [ ] Init projects (backend + frontend)
- [ ] Setup Prisma + SQLite
- [ ] Create schema
- [ ] Seed data

**Day 3-4: Backend Core**
- [ ] Auth endpoints
- [ ] Event CRUD endpoints
- [ ] Question CRUD endpoints

**Day 5-7: Backend Quiz & Spin**
- [ ] Quiz endpoints (start, answer, submit)
- [ ] Grading logic
- [ ] Spin endpoints (codes, execute)
- [ ] Budget tracking

### Week 2
**Day 8-10: Frontend Employee**
- [ ] Login page
- [ ] Event list page
- [ ] Quiz page
- [ ] Spin page + animation
- [ ] History page

**Day 11-12: Frontend HR**
- [ ] Event management
- [ ] Question management
- [ ] Dashboard

**Day 13-14: Testing & Polish**
- [ ] Integration testing
- [ ] Bug fixes
- [ ] UI polish
- [ ] Documentation

## 12. Success Criteria MVP

### Functional
- [x] HR có thể tạo sự kiện với 10 câu hỏi
- [x] Nhân viên có thể làm bài và nhận điểm
- [x] Tự động tạo mã quay khi đạt điểm >= 70
- [x] Nhân viên quay thưởng và nhận số tiền ngẫu nhiên 500K-1M
- [x] Ngân sách tự động cập nhật
- [x] Xem được lịch sử quay thưởng
- [x] HR xem được dashboard cơ bản

### Non-functional
- [ ] Response time < 1s
- [ ] UI responsive trên desktop
- [ ] Không có crash trong 100 lượt quay liên tiếp
- [ ] Code coverage >= 70%

## 13. Demo Script

### 13.1 Demo cho Stakeholders (10 phút)

1. **Login** (30s)
   - Demo login HR
   - Demo login Employee

2. **HR: Tạo sự kiện** (2 phút)
   - Tạo sự kiện mới
   - Thêm 10 câu hỏi
   - Cấu hình: điểm 70, tiền 500K-1M, budget 50M
   - Activate sự kiện

3. **Employee: Làm bài** (3 phút)
   - Chọn sự kiện
   - Làm 10 câu hỏi
   - Nộp bài
   - Nhận kết quả: 80 điểm (đạt)
   - Nhận mã quay

4. **Employee: Quay thưởng** (2 phút)
   - Vào trang Spin
   - Thấy có 1 mã available
   - Click "Quay"
   - Animation vòng quay
   - Hiển thị: Chúc mừng! Bạn nhận được 750.000 VNĐ

5. **HR: Xem báo cáo** (2.5 phút)
   - Vào Dashboard
   - Thấy: 1 người tham gia, 1 lượt quay
   - Ngân sách: 50M → 49.25M
   - Export danh sách người tham gia

### 13.2 Edge Cases để test
- Làm bài không đạt điểm → không có mã quay
- Sử dụng mã quay 2 lần → báo lỗi
- Hết ngân sách → không cho quay
- Sự kiện đã hết hạn → không cho làm bài

## 14. Next Steps sau MVP

### Phase 2 (Nice to Have)
- Shuffle câu hỏi và đáp án
- Time limit cho bài làm
- Giới hạn số lần làm bài
- Notification system
- Advanced analytics
- Export Excel/PDF

### Phase 3 (Future)
- Mobile app
- Tích hợp payroll
- Multiple question types (checkbox, fill-in-blank)
- Voucher rewards
- Leaderboard
- Gamification (badges, levels)

## 15. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Random không fair | High | Sử dụng crypto.randomInt thay vì Math.random |
| Budget inconsistency | High | Sử dụng database transaction |
| Concurrent spin cùng lúc | Medium | Row-level locking trên spin_codes |
| Frontend performance | Low | Code splitting, lazy loading |
| SQLite không đủ scale | Low | Dễ migrate sang PostgreSQL |

---

**Kết luận**: MVP này cung cấp đầy đủ chức năng cốt lõi để validate ý tưởng Module Thưởng Sự Kiện. Có thể triển khai thử nghiệm với 50-100 users trong 1 tháng để thu thập feedback trước khi phát triển đầy đủ.
