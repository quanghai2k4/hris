# Mô hình C4 - Module Thưởng Sự Kiện

## Level 1: Context Diagram

Sơ đồ ngữ cảnh hệ thống - mối quan hệ giữa hệ thống và các bên liên quan.

```mermaid
C4Context
    title System Context Diagram - Module Thưởng Sự Kiện

    Person(employee, "Nhân viên", "Người dùng tham gia làm bài và quay thưởng")
    Person(hr, "HR Manager", "Quản lý sự kiện và câu hỏi")
    
    System(hris, "HRIS System", "Hệ thống quản lý nhân sự với Module Thưởng Sự Kiện")
    
    System_Ext(auth, "Authentication System", "Hệ thống xác thực người dùng")
    System_Ext(payroll, "Payroll System", "Hệ thống tính lương (tương lai)")
    System_Ext(notification, "Notification Service", "Dịch vụ thông báo email/SMS")
    
    Rel(employee, hris, "Làm bài, quay thưởng, xem lịch sử", "HTTPS")
    Rel(hr, hris, "Quản lý sự kiện, câu hỏi, xem báo cáo", "HTTPS")
    
    Rel(hris, auth, "Xác thực người dùng", "HTTPS/LDAP")
    Rel(hris, notification, "Gửi thông báo", "HTTPS/SMTP")
    Rel(hris, payroll, "Đồng bộ dữ liệu thưởng", "API")
```

## Level 2: Container Diagram

Sơ đồ các containers (ứng dụng, cơ sở dữ liệu, services).

```mermaid
C4Container
    title Container Diagram - Module Thưởng Sự Kiện

    Person(employee, "Nhân viên", "Người dùng cuối")
    Person(hr, "HR Manager", "Quản trị viên")

    Container_Boundary(hris, "HRIS System") {
        Container(web, "Web Application", "React/Vue.js", "Giao diện người dùng cho nhân viên và HR")
        Container(api, "API Gateway", "Node.js/Express", "Cung cấp REST API cho frontend")
        Container(quiz_service, "Quiz Service", "Node.js/Python", "Xử lý logic làm bài, chấm điểm")
        Container(spin_service, "Spin Service", "Node.js/Python", "Xử lý logic quay thưởng, random")
        Container(event_service, "Event Service", "Node.js/Python", "Quản lý sự kiện")
        Container(report_service, "Report Service", "Node.js/Python", "Tạo báo cáo, thống kê")
        
        ContainerDb(db, "Database", "PostgreSQL/MySQL", "Lưu trữ dữ liệu sự kiện, câu hỏi, kết quả")
        ContainerDb(cache, "Cache", "Redis", "Cache câu hỏi, session")
        Container(queue, "Message Queue", "RabbitMQ/Redis", "Xử lý async tasks")
    }

    System_Ext(auth, "Auth System", "Xác thực")
    System_Ext(notification, "Notification", "Thông báo")

    Rel(employee, web, "Sử dụng", "HTTPS")
    Rel(hr, web, "Quản lý", "HTTPS")
    
    Rel(web, api, "Gọi API", "HTTPS/JSON")
    
    Rel(api, quiz_service, "Gọi", "gRPC/REST")
    Rel(api, spin_service, "Gọi", "gRPC/REST")
    Rel(api, event_service, "Gọi", "gRPC/REST")
    Rel(api, report_service, "Gọi", "gRPC/REST")
    
    Rel(quiz_service, db, "Đọc/ghi", "SQL")
    Rel(spin_service, db, "Đọc/ghi", "SQL")
    Rel(event_service, db, "Đọc/ghi", "SQL")
    Rel(report_service, db, "Đọc", "SQL")
    
    Rel(quiz_service, cache, "Cache câu hỏi", "Redis Protocol")
    Rel(spin_service, queue, "Publish events", "AMQP")
    
    Rel(api, auth, "Xác thực", "HTTPS")
    Rel(spin_service, notification, "Gửi thông báo", "HTTPS")
```

## Level 3: Component Diagram

Sơ đồ các components bên trong mỗi service.

### 3.1 Quiz Service Components

```mermaid
C4Component
    title Component Diagram - Quiz Service

    Container_Boundary(quiz_service, "Quiz Service") {
        Component(quiz_controller, "Quiz Controller", "Controller", "Xử lý HTTP requests")
        Component(quiz_manager, "Quiz Manager", "Business Logic", "Quản lý logic làm bài")
        Component(grading_engine, "Grading Engine", "Business Logic", "Chấm điểm tự động")
        Component(question_randomizer, "Question Randomizer", "Utility", "Random và shuffle câu hỏi")
        Component(quiz_repository, "Quiz Repository", "Data Access", "Truy xuất dữ liệu quiz")
        Component(result_repository, "Result Repository", "Data Access", "Lưu kết quả")
    }

    ContainerDb(db, "Database", "PostgreSQL")
    ContainerDb(cache, "Redis Cache", "Redis")

    Rel(quiz_controller, quiz_manager, "Gọi")
    Rel(quiz_manager, grading_engine, "Sử dụng")
    Rel(quiz_manager, question_randomizer, "Sử dụng")
    Rel(quiz_manager, quiz_repository, "Gọi")
    Rel(quiz_manager, result_repository, "Gọi")
    
    Rel(quiz_repository, db, "Truy vấn", "SQL")
    Rel(quiz_repository, cache, "Cache", "Redis")
    Rel(result_repository, db, "Lưu", "SQL")
```

### 3.2 Spin Service Components

```mermaid
C4Component
    title Component Diagram - Spin Service

    Container_Boundary(spin_service, "Spin Service") {
        Component(spin_controller, "Spin Controller", "Controller", "Xử lý HTTP requests")
        Component(spin_manager, "Spin Manager", "Business Logic", "Quản lý logic quay thưởng")
        Component(random_engine, "Random Engine", "Utility", "Generate số tiền ngẫu nhiên")
        Component(code_validator, "Code Validator", "Business Logic", "Validate mã quay")
        Component(budget_tracker, "Budget Tracker", "Business Logic", "Theo dõi ngân sách")
        Component(spin_repository, "Spin Repository", "Data Access", "Truy xuất dữ liệu")
    }

    ContainerDb(db, "Database", "PostgreSQL")
    Container(queue, "Message Queue", "RabbitMQ")

    Rel(spin_controller, spin_manager, "Gọi")
    Rel(spin_manager, code_validator, "Validate")
    Rel(spin_manager, random_engine, "Generate")
    Rel(spin_manager, budget_tracker, "Kiểm tra")
    Rel(spin_manager, spin_repository, "Lưu kết quả")
    
    Rel(spin_repository, db, "Truy vấn", "SQL")
    Rel(spin_manager, queue, "Publish", "AMQP")
```

### 3.3 Event Service Components

```mermaid
C4Component
    title Component Diagram - Event Service

    Container_Boundary(event_service, "Event Service") {
        Component(event_controller, "Event Controller", "Controller", "Xử lý HTTP requests")
        Component(event_manager, "Event Manager", "Business Logic", "Quản lý sự kiện")
        Component(question_manager, "Question Manager", "Business Logic", "Quản lý câu hỏi")
        Component(config_manager, "Config Manager", "Business Logic", "Quản lý cấu hình")
        Component(event_validator, "Event Validator", "Validator", "Validate dữ liệu sự kiện")
        Component(event_repository, "Event Repository", "Data Access", "Truy xuất sự kiện")
        Component(question_repository, "Question Repository", "Data Access", "Truy xuất câu hỏi")
    }

    ContainerDb(db, "Database", "PostgreSQL")

    Rel(event_controller, event_manager, "Gọi")
    Rel(event_controller, question_manager, "Gọi")
    Rel(event_manager, event_validator, "Validate")
    Rel(event_manager, config_manager, "Cấu hình")
    Rel(event_manager, event_repository, "CRUD")
    Rel(question_manager, question_repository, "CRUD")
    
    Rel(event_repository, db, "Truy vấn", "SQL")
    Rel(question_repository, db, "Truy vấn", "SQL")
```

### 3.4 Report Service Components

```mermaid
C4Component
    title Component Diagram - Report Service

    Container_Boundary(report_service, "Report Service") {
        Component(report_controller, "Report Controller", "Controller", "Xử lý HTTP requests")
        Component(analytics_engine, "Analytics Engine", "Business Logic", "Tính toán thống kê")
        Component(export_handler, "Export Handler", "Utility", "Export Excel/PDF")
        Component(dashboard_builder, "Dashboard Builder", "Business Logic", "Tạo dashboard data")
        Component(report_repository, "Report Repository", "Data Access", "Truy vấn dữ liệu")
    }

    ContainerDb(db, "Database", "PostgreSQL")
    ContainerDb(cache, "Redis Cache", "Redis")

    Rel(report_controller, analytics_engine, "Gọi")
    Rel(report_controller, dashboard_builder, "Gọi")
    Rel(report_controller, export_handler, "Export")
    Rel(analytics_engine, report_repository, "Truy vấn")
    Rel(dashboard_builder, report_repository, "Truy vấn")
    
    Rel(report_repository, db, "Truy vấn", "SQL")
    Rel(analytics_engine, cache, "Cache kết quả", "Redis")
```

## Level 4: Code Diagram

Sơ đồ code cho một số classes quan trọng.

### 4.1 Quiz Manager - Class Diagram

```mermaid
classDiagram
    class QuizManager {
        -quizRepository: QuizRepository
        -resultRepository: ResultRepository
        -gradingEngine: GradingEngine
        -questionRandomizer: QuestionRandomizer
        +startQuiz(eventId, userId): QuizSession
        +submitAnswer(sessionId, questionId, answerId): void
        +submitQuiz(sessionId): QuizResult
        +getQuizResult(resultId): QuizResult
    }

    class QuizSession {
        -sessionId: string
        -userId: string
        -eventId: string
        -questions: Question[]
        -answers: Map~string,string~
        -startTime: DateTime
        -status: SessionStatus
        +addAnswer(questionId, answerId): void
        +isComplete(): boolean
        +getTimeElapsed(): number
    }

    class GradingEngine {
        +grade(session: QuizSession, questions: Question[]): QuizResult
        -calculateScore(correctCount, totalCount): number
        -checkAnswer(question: Question, answerId: string): boolean
    }

    class QuestionRandomizer {
        +selectQuestions(pool: Question[], count: number): Question[]
        +shuffleAnswers(question: Question): Question
        -random(min, max): number
    }

    class QuizRepository {
        +getQuestionsByEvent(eventId): Question[]
        +getQuizSession(sessionId): QuizSession
        +saveQuizSession(session): void
    }

    class ResultRepository {
        +saveResult(result: QuizResult): void
        +getResultsByUser(userId): QuizResult[]
        +getResultsByEvent(eventId): QuizResult[]
    }

    class Question {
        +id: string
        +content: string
        +answers: Answer[]
        +correctAnswerId: string
        +eventId: string
    }

    class Answer {
        +id: string
        +content: string
    }

    class QuizResult {
        +id: string
        +sessionId: string
        +userId: string
        +eventId: string
        +score: number
        +correctCount: number
        +totalCount: number
        +passedThreshold: boolean
        +spinCodeId: string
        +completedAt: DateTime
    }

    QuizManager --> QuizRepository
    QuizManager --> ResultRepository
    QuizManager --> GradingEngine
    QuizManager --> QuestionRandomizer
    QuizManager ..> QuizSession
    QuizManager ..> QuizResult
    GradingEngine ..> QuizResult
    QuizSession --> Question
    Question --> Answer
```

### 4.2 Spin Manager - Class Diagram

```mermaid
classDiagram
    class SpinManager {
        -spinRepository: SpinRepository
        -randomEngine: RandomEngine
        -codeValidator: CodeValidator
        -budgetTracker: BudgetTracker
        +createSpinCode(userId, eventId, resultId): SpinCode
        +spin(codeId, userId): SpinResult
        +getAvailableCodes(userId): SpinCode[]
        +getSpinHistory(userId): SpinResult[]
    }

    class SpinCode {
        +id: string
        +userId: string
        +eventId: string
        +quizResultId: string
        +status: CodeStatus
        +createdAt: DateTime
        +usedAt: DateTime
        +isValid(): boolean
        +markAsUsed(): void
    }

    class RandomEngine {
        +generateAmount(min, max): number
        -seed(): void
        -uniform(min, max): number
    }

    class CodeValidator {
        +validate(code: SpinCode, userId: string): ValidationResult
        -checkExpired(code): boolean
        -checkUsed(code): boolean
        -checkOwnership(code, userId): boolean
    }

    class BudgetTracker {
        -eventRepository: EventRepository
        +checkBudget(eventId, amount): boolean
        +deductBudget(eventId, amount): void
        +getBudgetInfo(eventId): BudgetInfo
        -shouldAlert(remaining, total): boolean
    }

    class SpinResult {
        +id: string
        +codeId: string
        +userId: string
        +eventId: string
        +amount: number
        +spunAt: DateTime
    }

    class SpinRepository {
        +saveSpinCode(code): void
        +getSpinCode(codeId): SpinCode
        +saveSpinResult(result): void
        +getSpinResults(userId): SpinResult[]
    }

    class BudgetInfo {
        +eventId: string
        +totalBudget: number
        +usedBudget: number
        +remainingBudget: number
        +percentage: number
    }

    SpinManager --> SpinRepository
    SpinManager --> RandomEngine
    SpinManager --> CodeValidator
    SpinManager --> BudgetTracker
    SpinManager ..> SpinCode
    SpinManager ..> SpinResult
    BudgetTracker ..> BudgetInfo
```

### 4.3 Event Manager - Class Diagram

```mermaid
classDiagram
    class EventManager {
        -eventRepository: EventRepository
        -questionRepository: QuestionRepository
        -eventValidator: EventValidator
        +createEvent(data): Event
        +updateEvent(id, data): Event
        +deleteEvent(id): void
        +activateEvent(id): void
        +deactivateEvent(id): void
        +getEvents(filter): Event[]
    }

    class Event {
        +id: string
        +name: string
        +description: string
        +startDate: DateTime
        +endDate: DateTime
        +status: EventStatus
        +config: EventConfig
        +budget: EventBudget
        +isActive(): boolean
        +canParticipate(): boolean
    }

    class EventConfig {
        +minScore: number
        +questionCount: number
        +prizeMin: number
        +prizeMax: number
        +maxAttemptsPerDay: number
        +timeLimit: number
    }

    class EventBudget {
        +total: number
        +used: number
        +remaining: number
        +updateUsed(amount): void
        +hasEnough(amount): boolean
    }

    class EventValidator {
        +validateCreate(data): ValidationResult
        +validateUpdate(event, data): ValidationResult
        +validateDelete(event): ValidationResult
        -checkDateRange(start, end): boolean
        -checkBudget(config): boolean
        -checkQuestions(questions): boolean
    }

    class EventRepository {
        +save(event): void
        +findById(id): Event
        +findAll(filter): Event[]
        +delete(id): void
    }

    class QuestionManager {
        -questionRepository: QuestionRepository
        +createQuestion(data): Question
        +updateQuestion(id, data): Question
        +deleteQuestion(id): void
        +addToEvent(questionId, eventId): void
        +removeFromEvent(questionId, eventId): void
    }

    class QuestionRepository {
        +save(question): void
        +findById(id): Question
        +findByEvent(eventId): Question[]
        +delete(id): void
    }

    EventManager --> EventRepository
    EventManager --> QuestionRepository
    EventManager --> EventValidator
    EventManager ..> Event
    Event --> EventConfig
    Event --> EventBudget
    QuestionManager --> QuestionRepository
```

## Deployment Diagram

Sơ đồ triển khai hệ thống.

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile App - Future]
    end

    subgraph "Load Balancer"
        LB[Nginx/HAProxy]
    end

    subgraph "Application Layer"
        API1[API Gateway Instance 1]
        API2[API Gateway Instance 2]
        
        Quiz[Quiz Service]
        Spin[Spin Service]
        Event[Event Service]
        Report[Report Service]
    end

    subgraph "Data Layer"
        PG_Master[(PostgreSQL Master)]
        PG_Replica[(PostgreSQL Replica)]
        Redis[(Redis Cluster)]
        RabbitMQ[RabbitMQ Cluster]
    end

    subgraph "External Services"
        Auth[Auth Service]
        Notification[Notification Service]
    end

    Browser --> LB
    Mobile -.-> LB
    
    LB --> API1
    LB --> API2
    
    API1 --> Quiz
    API1 --> Spin
    API1 --> Event
    API1 --> Report
    
    API2 --> Quiz
    API2 --> Spin
    API2 --> Event
    API2 --> Report
    
    Quiz --> PG_Master
    Quiz --> Redis
    
    Spin --> PG_Master
    Spin --> RabbitMQ
    
    Event --> PG_Master
    
    Report --> PG_Replica
    Report --> Redis
    
    PG_Master -.Replication.-> PG_Replica
    
    API1 --> Auth
    API2 --> Auth
    Spin --> Notification
```

## Sequence Diagrams

### Luồng làm bài và nhận mã quay

```mermaid
sequenceDiagram
    actor Employee
    participant Web
    participant API
    participant QuizService
    participant SpinService
    participant DB
    participant Cache

    Employee->>Web: Chọn sự kiện và bắt đầu làm bài
    Web->>API: POST /api/quiz/start
    API->>QuizService: startQuiz(eventId, userId)
    QuizService->>Cache: getQuestions(eventId)
    alt Cache hit
        Cache-->>QuizService: questions
    else Cache miss
        QuizService->>DB: SELECT questions
        DB-->>QuizService: questions
        QuizService->>Cache: setQuestions(eventId, questions)
    end
    QuizService->>QuizService: randomizeQuestions()
    QuizService->>DB: INSERT quiz_session
    QuizService-->>API: sessionId, questions
    API-->>Web: Quiz data
    Web-->>Employee: Hiển thị câu hỏi

    loop Trả lời từng câu
        Employee->>Web: Chọn đáp án
        Web->>API: POST /api/quiz/answer
        API->>QuizService: submitAnswer()
        QuizService->>DB: UPDATE session
    end

    Employee->>Web: Nộp bài
    Web->>API: POST /api/quiz/submit
    API->>QuizService: submitQuiz(sessionId)
    QuizService->>QuizService: gradeQuiz()
    QuizService->>DB: INSERT quiz_result
    
    alt Score >= Threshold
        QuizService->>SpinService: createSpinCode(userId, resultId)
        SpinService->>DB: INSERT spin_code
        SpinService-->>QuizService: spinCode
    end
    
    QuizService-->>API: result, spinCode
    API-->>Web: Result data
    Web-->>Employee: Hiển thị kết quả + mã quay (nếu có)
```

### Luồng quay thưởng

```mermaid
sequenceDiagram
    actor Employee
    participant Web
    participant API
    participant SpinService
    participant BudgetTracker
    participant DB
    participant Queue
    participant NotificationService

    Employee->>Web: Nhấn "Quay thưởng"
    Web->>API: POST /api/spin/execute
    API->>SpinService: spin(codeId, userId)
    
    SpinService->>DB: SELECT spin_code
    DB-->>SpinService: spinCode
    
    SpinService->>SpinService: validateCode()
    
    alt Invalid code
        SpinService-->>API: Error: Invalid code
        API-->>Web: Error message
        Web-->>Employee: Thông báo lỗi
    else Valid code
        SpinService->>DB: SELECT event config
        DB-->>SpinService: config (min, max)
        
        SpinService->>BudgetTracker: checkBudget(eventId)
        BudgetTracker->>DB: SELECT budget
        DB-->>BudgetTracker: budgetInfo
        
        alt Insufficient budget
            BudgetTracker-->>SpinService: Error: No budget
            SpinService-->>API: Error
            API-->>Web: Error
            Web-->>Employee: Hết ngân sách
        else Sufficient budget
            SpinService->>SpinService: randomAmount(min, max)
            
            SpinService->>DB: BEGIN TRANSACTION
            SpinService->>DB: INSERT spin_result
            SpinService->>DB: UPDATE spin_code SET used=true
            SpinService->>DB: UPDATE event_budget
            SpinService->>DB: COMMIT
            
            DB-->>SpinService: Success
            
            SpinService->>Queue: publish(spin_completed_event)
            Queue->>NotificationService: Send notification
            
            SpinService-->>API: spinResult
            API-->>Web: Amount won
            Web-->>Employee: Hiển thị animation + số tiền
        end
    end
```

### Luồng tạo sự kiện (HR)

```mermaid
sequenceDiagram
    actor HR
    participant Web
    participant API
    participant EventService
    participant DB

    HR->>Web: Nhập thông tin sự kiện
    Web->>API: POST /api/events
    API->>EventService: createEvent(data)
    
    EventService->>EventService: validateEventData()
    
    alt Validation failed
        EventService-->>API: Validation errors
        API-->>Web: Errors
        Web-->>HR: Hiển thị lỗi
    else Validation passed
        EventService->>DB: BEGIN TRANSACTION
        EventService->>DB: INSERT event
        EventService->>DB: INSERT event_config
        EventService->>DB: INSERT event_budget
        
        loop For each question
            EventService->>DB: INSERT question
            EventService->>DB: INSERT answers
            EventService->>DB: INSERT event_questions mapping
        end
        
        EventService->>DB: COMMIT
        DB-->>EventService: Success
        
        EventService-->>API: event
        API-->>Web: Created event
        Web-->>HR: Thông báo thành công
    end
```

## Technology Stack Recommendation

### Frontend
- **Framework**: React với TypeScript
- **State Management**: Redux Toolkit / Zustand
- **UI Library**: Material-UI / Ant Design
- **Animation**: Framer Motion (cho vòng quay)
- **API Client**: Axios / React Query

### Backend
- **Runtime**: Node.js (Express) hoặc Python (FastAPI)
- **API Gateway**: Express Gateway / Kong
- **Microservices**: NestJS (Node) / FastAPI (Python)
- **ORM**: Prisma (Node) / SQLAlchemy (Python)
- **Validation**: Joi / Zod (Node) / Pydantic (Python)

### Database
- **Primary DB**: PostgreSQL 14+
- **Cache**: Redis 6+
- **Message Queue**: RabbitMQ / Redis Pub/Sub

### DevOps
- **Container**: Docker
- **Orchestration**: Docker Compose (MVP) / Kubernetes (Production)
- **CI/CD**: GitHub Actions / GitLab CI
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack / Loki

### Security
- **Authentication**: JWT
- **Authorization**: RBAC
- **API Security**: Rate limiting, CORS, Helmet
- **Data Encryption**: AES-256 (at rest), TLS 1.3 (in transit)
