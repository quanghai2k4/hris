# Entity Relationship Diagram (ERD) - Module Thưởng Sự Kiện

## Mô tả tổng quan

ERD mô tả cấu trúc cơ sở dữ liệu cho Module Thưởng Sự Kiện, bao gồm các thực thể chính: Users, Events, Questions, Quiz Sessions, Spin Codes, và các mối quan hệ giữa chúng.

## ERD Diagram

```mermaid
erDiagram
    USERS ||--o{ QUIZ_SESSIONS : "participates"
    USERS ||--o{ QUIZ_RESULTS : "has"
    USERS ||--o{ SPIN_CODES : "owns"
    USERS ||--o{ SPIN_RESULTS : "has"
    
    EVENTS ||--o{ EVENT_QUESTIONS : "contains"
    EVENTS ||--o{ QUIZ_SESSIONS : "for"
    EVENTS ||--o{ QUIZ_RESULTS : "belongs_to"
    EVENTS ||--o{ SPIN_CODES : "issued_by"
    EVENTS ||--o{ SPIN_RESULTS : "belongs_to"
    EVENTS ||--|| EVENT_CONFIGS : "has"
    EVENTS ||--|| EVENT_BUDGETS : "has"
    
    QUESTIONS ||--o{ EVENT_QUESTIONS : "appears_in"
    QUESTIONS ||--o{ ANSWERS : "has"
    QUESTIONS ||--o{ SESSION_ANSWERS : "answered"
    
    QUIZ_SESSIONS ||--o{ SESSION_ANSWERS : "contains"
    QUIZ_SESSIONS ||--|| QUIZ_RESULTS : "produces"
    
    QUIZ_RESULTS ||--o| SPIN_CODES : "generates"
    
    SPIN_CODES ||--o| SPIN_RESULTS : "used_for"
    
    ANSWERS ||--o{ SESSION_ANSWERS : "selected"

    USERS {
        uuid id PK
        string employee_id UK "Mã nhân viên"
        string full_name
        string email
        string department
        string position
        enum role "employee, hr_manager, admin"
        timestamp created_at
        timestamp updated_at
    }

    EVENTS {
        uuid id PK
        string name
        text description
        enum status "draft, active, paused, completed, cancelled"
        timestamp start_date
        timestamp end_date
        uuid created_by FK "USERS.id"
        timestamp created_at
        timestamp updated_at
    }

    EVENT_CONFIGS {
        uuid id PK
        uuid event_id FK "EVENTS.id" UK
        integer min_score "Điểm tối thiểu để nhận mã quay (0-100)"
        integer question_count "Số câu hỏi trong 1 bài"
        decimal prize_min "Tiền thưởng tối thiểu (VNĐ)"
        decimal prize_max "Tiền thưởng tối đa (VNĐ)"
        integer max_attempts_per_day "Giới hạn số lần làm bài/ngày (NULL = unlimited)"
        integer time_limit_minutes "Thời gian làm bài (phút, NULL = unlimited)"
        boolean shuffle_questions "Có random câu hỏi không"
        boolean shuffle_answers "Có shuffle đáp án không"
        timestamp created_at
        timestamp updated_at
    }

    EVENT_BUDGETS {
        uuid id PK
        uuid event_id FK "EVENTS.id" UK
        decimal total_budget "Tổng ngân sách (VNĐ)"
        decimal used_budget "Đã sử dụng (VNĐ)"
        decimal remaining_budget "Còn lại (VNĐ)"
        integer total_spins "Tổng số lượt quay"
        decimal alert_threshold "Ngưỡng cảnh báo (%)"
        timestamp last_updated
    }

    QUESTIONS {
        uuid id PK
        text content "Nội dung câu hỏi"
        enum type "single_choice, multiple_choice, true_false"
        string media_url "URL hình ảnh/video (optional)"
        uuid created_by FK "USERS.id"
        timestamp created_at
        timestamp updated_at
    }

    ANSWERS {
        uuid id PK
        uuid question_id FK "QUESTIONS.id"
        text content "Nội dung đáp án"
        boolean is_correct "Đáp án đúng"
        integer order_index "Thứ tự hiển thị"
        timestamp created_at
    }

    EVENT_QUESTIONS {
        uuid id PK
        uuid event_id FK "EVENTS.id"
        uuid question_id FK "QUESTIONS.id"
        integer order_index "Thứ tự trong pool"
        timestamp created_at
    }

    QUIZ_SESSIONS {
        uuid id PK
        uuid user_id FK "USERS.id"
        uuid event_id FK "EVENTS.id"
        enum status "in_progress, submitted, expired, cancelled"
        json questions_data "Snapshot câu hỏi và đáp án đã shuffle"
        timestamp started_at
        timestamp submitted_at
        timestamp expires_at
        integer time_spent_seconds
    }

    SESSION_ANSWERS {
        uuid id PK
        uuid session_id FK "QUIZ_SESSIONS.id"
        uuid question_id FK "QUESTIONS.id"
        uuid answer_id FK "ANSWERS.id"
        integer question_order "Thứ tự câu hỏi trong bài"
        timestamp answered_at
    }

    QUIZ_RESULTS {
        uuid id PK
        uuid session_id FK "QUIZ_SESSIONS.id" UK
        uuid user_id FK "USERS.id"
        uuid event_id FK "EVENTS.id"
        integer total_questions
        integer correct_answers
        decimal score "Điểm số (0-100)"
        boolean passed_threshold "Có đạt điểm tối thiểu không"
        json detailed_results "Chi tiết từng câu đúng/sai"
        timestamp completed_at
        timestamp created_at
    }

    SPIN_CODES {
        uuid id PK
        string code UK "Mã quay unique (generated)"
        uuid user_id FK "USERS.id"
        uuid event_id FK "EVENTS.id"
        uuid quiz_result_id FK "QUIZ_RESULTS.id"
        enum status "available, used, expired, cancelled"
        timestamp created_at
        timestamp used_at
        timestamp expires_at
    }

    SPIN_RESULTS {
        uuid id PK
        uuid spin_code_id FK "SPIN_CODES.id" UK
        uuid user_id FK "USERS.id"
        uuid event_id FK "EVENTS.id"
        decimal amount "Số tiền thưởng (VNĐ)"
        string transaction_id "ID giao dịch (tích hợp payroll)"
        enum payment_status "pending, processed, failed"
        timestamp spun_at
        timestamp processed_at
    }
```

## Chi tiết các thực thể

### 1. USERS
**Mô tả**: Lưu thông tin người dùng (nhân viên và HR)

**Thuộc tính chính**:
- `id`: Primary key (UUID)
- `employee_id`: Mã nhân viên duy nhất
- `role`: Vai trò (employee, hr_manager, admin)

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE (employee_id)
- INDEX (email)
- INDEX (role)

### 2. EVENTS
**Mô tả**: Lưu thông tin sự kiện thưởng

**Thuộc tính chính**:
- `id`: Primary key
- `status`: Trạng thái sự kiện (draft, active, paused, completed, cancelled)
- `start_date`, `end_date`: Thời gian diễn ra

**Indexes**:
- PRIMARY KEY (id)
- INDEX (status, start_date, end_date)
- INDEX (created_by)

**Business Rules**:
- `end_date` phải sau `start_date`
- Chỉ có thể active khi có đủ câu hỏi và cấu hình hợp lệ
- Không xóa được nếu đã có người tham gia

### 3. EVENT_CONFIGS
**Mô tả**: Cấu hình chi tiết cho từng sự kiện

**Thuộc tính chính**:
- `min_score`: Điểm tối thiểu để nhận mã quay (0-100)
- `prize_min`, `prize_max`: Khoảng tiền thưởng
- `question_count`: Số câu hỏi trong 1 bài

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE (event_id)

**Business Rules**:
- `min_score`: 0 <= min_score <= 100
- `prize_min` < `prize_max`
- `question_count` >= 5

### 4. EVENT_BUDGETS
**Mô tả**: Quản lý ngân sách sự kiện

**Thuộc tính chính**:
- `total_budget`: Tổng ngân sách
- `used_budget`: Đã sử dụng (tính từ SPIN_RESULTS)
- `remaining_budget`: Còn lại (computed: total - used)

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE (event_id)

**Business Rules**:
- `remaining_budget` = `total_budget` - `used_budget`
- Cảnh báo khi remaining < total * alert_threshold
- Không cho quay khi remaining < prize_max

### 5. QUESTIONS
**Mô tả**: Ngân hàng câu hỏi

**Thuộc tính chính**:
- `content`: Nội dung câu hỏi
- `type`: Loại câu hỏi (single_choice, multiple_choice, true_false)
- `media_url`: Link hình ảnh/video nếu có

**Indexes**:
- PRIMARY KEY (id)
- INDEX (type)
- INDEX (created_by)
- FULLTEXT INDEX (content) - để search

**Business Rules**:
- Phải có ít nhất 2 đáp án
- Phải có ít nhất 1 đáp án đúng
- Không xóa được nếu đang được sử dụng trong sự kiện active

### 6. ANSWERS
**Mô tả**: Đáp án của câu hỏi

**Thuộc tính chính**:
- `is_correct`: Đánh dấu đáp án đúng
- `order_index`: Thứ tự hiển thị ban đầu

**Indexes**:
- PRIMARY KEY (id)
- INDEX (question_id)
- INDEX (question_id, is_correct)

**Business Rules**:
- Mỗi question phải có đúng 1 đáp án đúng (type=single_choice)
- order_index unique trong phạm vi 1 question

### 7. EVENT_QUESTIONS
**Mô tả**: Mapping nhiều-nhiều giữa Events và Questions

**Thuộc tính chính**:
- `event_id`, `question_id`: Composite relationship
- `order_index`: Thứ tự trong pool câu hỏi

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE (event_id, question_id)
- INDEX (event_id)
- INDEX (question_id)

### 8. QUIZ_SESSIONS
**Mô tả**: Phiên làm bài của nhân viên

**Thuộc tính chính**:
- `status`: Trạng thái (in_progress, submitted, expired, cancelled)
- `questions_data`: JSON snapshot câu hỏi đã shuffle (immutable)
- `expires_at`: Thời gian hết hạn (nếu có time limit)

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id, event_id)
- INDEX (status)
- INDEX (started_at)

**Business Rules**:
- Một user có thể có nhiều sessions cho cùng 1 event
- Session tự động expire sau time_limit
- questions_data lưu snapshot để đảm bảo tính công bằng

### 9. SESSION_ANSWERS
**Mô tả**: Câu trả lời của nhân viên trong từng phiên

**Thuộc tính chính**:
- `session_id`: Phiên làm bài
- `question_id`, `answer_id`: Câu hỏi và đáp án được chọn
- `question_order`: Thứ tự câu trong bài

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE (session_id, question_id)
- INDEX (session_id)

**Business Rules**:
- Mỗi question trong session chỉ có 1 answer
- answer_id phải thuộc về question_id tương ứng

### 10. QUIZ_RESULTS
**Mô tả**: Kết quả sau khi chấm điểm

**Thuộc tính chính**:
- `score`: Điểm số (0-100)
- `passed_threshold`: Boolean - có đạt điểm tối thiểu không
- `detailed_results`: JSON chi tiết từng câu (để review)

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE (session_id)
- INDEX (user_id, event_id)
- INDEX (passed_threshold)
- INDEX (completed_at)

**Business Rules**:
- score = (correct_answers / total_questions) * 100
- passed_threshold = score >= event_config.min_score
- Immutable sau khi tạo

### 11. SPIN_CODES
**Mô tả**: Mã quay thưởng

**Thuộc tính chính**:
- `code`: Mã unique (VD: "SPIN-ABC123-XYZ")
- `status`: Trạng thái (available, used, expired, cancelled)
- `quiz_result_id`: Link đến kết quả quiz tạo ra mã này

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE (code)
- INDEX (user_id, status)
- INDEX (event_id, status)
- INDEX (quiz_result_id)

**Business Rules**:
- Tự động tạo khi quiz_result.passed_threshold = true
- Chỉ sử dụng được 1 lần
- Có thể expire nếu event kết thúc
- code generation: timestamp + random + hash

### 12. SPIN_RESULTS
**Mô tả**: Kết quả quay thưởng

**Thuộc tính chính**:
- `amount`: Số tiền thưởng random (prize_min ~ prize_max)
- `transaction_id`: ID để tích hợp với hệ thống payroll
- `payment_status`: Trạng thái thanh toán

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE (spin_code_id)
- INDEX (user_id)
- INDEX (event_id)
- INDEX (spun_at)
- INDEX (payment_status)

**Business Rules**:
- amount = RANDOM(prize_min, prize_max) với uniform distribution
- Tự động cập nhật event_budgets.used_budget
- Immutable sau khi tạo
- Trigger cảnh báo nếu budget gần hết

## Mối quan hệ (Relationships)

### One-to-Many Relationships

1. **USERS → QUIZ_SESSIONS**: Một user có nhiều phiên làm bài
2. **USERS → QUIZ_RESULTS**: Một user có nhiều kết quả
3. **USERS → SPIN_CODES**: Một user có nhiều mã quay
4. **USERS → SPIN_RESULTS**: Một user có nhiều lượt quay
5. **EVENTS → QUIZ_SESSIONS**: Một event có nhiều phiên làm bài
6. **EVENTS → QUIZ_RESULTS**: Một event có nhiều kết quả
7. **EVENTS → SPIN_CODES**: Một event phát hành nhiều mã quay
8. **EVENTS → SPIN_RESULTS**: Một event có nhiều lượt quay
9. **QUESTIONS → ANSWERS**: Một question có nhiều answers
10. **QUIZ_SESSIONS → SESSION_ANSWERS**: Một session có nhiều câu trả lời

### One-to-One Relationships

1. **EVENTS → EVENT_CONFIGS**: Một event có một config
2. **EVENTS → EVENT_BUDGETS**: Một event có một budget
3. **QUIZ_SESSIONS → QUIZ_RESULTS**: Một session tạo ra một result
4. **QUIZ_RESULTS → SPIN_CODES**: Một result tạo ra tối đa một spin code
5. **SPIN_CODES → SPIN_RESULTS**: Một code tạo ra tối đa một spin result

### Many-to-Many Relationships

1. **EVENTS ↔ QUESTIONS** (through EVENT_QUESTIONS): 
   - Một event có nhiều questions
   - Một question có thể dùng cho nhiều events

## Views hỗ trợ

### View 1: user_event_stats
Thống kê tham gia của user cho mỗi event

```sql
CREATE VIEW user_event_stats AS
SELECT 
    u.id as user_id,
    e.id as event_id,
    COUNT(DISTINCT qs.id) as total_attempts,
    COUNT(DISTINCT qr.id) as completed_attempts,
    AVG(qr.score) as average_score,
    MAX(qr.score) as best_score,
    COUNT(DISTINCT sc.id) as total_spin_codes,
    COUNT(DISTINCT sr.id) as total_spins,
    COALESCE(SUM(sr.amount), 0) as total_winnings
FROM users u
CROSS JOIN events e
LEFT JOIN quiz_sessions qs ON qs.user_id = u.id AND qs.event_id = e.id
LEFT JOIN quiz_results qr ON qr.session_id = qs.id
LEFT JOIN spin_codes sc ON sc.quiz_result_id = qr.id
LEFT JOIN spin_results sr ON sr.spin_code_id = sc.id
GROUP BY u.id, e.id;
```

### View 2: event_dashboard
Dashboard cho HR xem tổng quan sự kiện

```sql
CREATE VIEW event_dashboard AS
SELECT 
    e.id as event_id,
    e.name,
    e.status,
    COUNT(DISTINCT qs.user_id) as total_participants,
    COUNT(DISTINCT qs.id) as total_attempts,
    COUNT(DISTINCT qr.id) as completed_quizzes,
    AVG(qr.score) as average_score,
    COUNT(DISTINCT sc.id) as total_codes_issued,
    COUNT(DISTINCT sr.id) as total_spins,
    COALESCE(SUM(sr.amount), 0) as total_paid,
    eb.total_budget,
    eb.remaining_budget,
    (eb.remaining_budget / NULLIF(eb.total_budget, 0) * 100) as budget_remaining_percent
FROM events e
LEFT JOIN event_budgets eb ON eb.event_id = e.id
LEFT JOIN quiz_sessions qs ON qs.event_id = e.id
LEFT JOIN quiz_results qr ON qr.event_id = e.id
LEFT JOIN spin_codes sc ON sc.event_id = e.id
LEFT JOIN spin_results sr ON sr.event_id = e.id
GROUP BY e.id, eb.total_budget, eb.remaining_budget;
```

### View 3: available_spin_codes
Danh sách mã quay available của user

```sql
CREATE VIEW available_spin_codes AS
SELECT 
    sc.*,
    e.name as event_name,
    qr.score as quiz_score,
    qr.completed_at
FROM spin_codes sc
JOIN events e ON e.id = sc.event_id
JOIN quiz_results qr ON qr.id = sc.quiz_result_id
WHERE sc.status = 'available'
    AND e.status = 'active'
    AND (sc.expires_at IS NULL OR sc.expires_at > NOW());
```

## Triggers và Constraints

### Trigger 1: auto_create_spin_code
Tự động tạo mã quay khi quiz result đạt điểm

```sql
CREATE TRIGGER after_quiz_result_insert
AFTER INSERT ON quiz_results
FOR EACH ROW
WHEN (NEW.passed_threshold = TRUE)
BEGIN
    INSERT INTO spin_codes (id, code, user_id, event_id, quiz_result_id, status, created_at)
    VALUES (
        uuid_generate_v4(),
        'SPIN-' || UPPER(SUBSTR(MD5(RANDOM()::text), 1, 8)) || '-' || NEW.user_id,
        NEW.user_id,
        NEW.event_id,
        NEW.id,
        'available',
        NOW()
    );
END;
```

### Trigger 2: update_budget_on_spin
Cập nhật ngân sách khi có lượt quay

```sql
CREATE TRIGGER after_spin_result_insert
AFTER INSERT ON spin_results
FOR EACH ROW
BEGIN
    UPDATE event_budgets
    SET used_budget = used_budget + NEW.amount,
        remaining_budget = total_budget - (used_budget + NEW.amount),
        total_spins = total_spins + 1,
        last_updated = NOW()
    WHERE event_id = NEW.event_id;
    
    UPDATE spin_codes
    SET status = 'used',
        used_at = NEW.spun_at
    WHERE id = NEW.spin_code_id;
END;
```

### Constraint Examples

```sql
ALTER TABLE event_configs
ADD CONSTRAINT check_score_range CHECK (min_score >= 0 AND min_score <= 100),
ADD CONSTRAINT check_prize_range CHECK (prize_min < prize_max AND prize_min >= 0),
ADD CONSTRAINT check_question_count CHECK (question_count >= 5);

ALTER TABLE event_budgets
ADD CONSTRAINT check_budget_positive CHECK (total_budget > 0),
ADD CONSTRAINT check_used_budget CHECK (used_budget >= 0 AND used_budget <= total_budget);

ALTER TABLE events
ADD CONSTRAINT check_date_range CHECK (end_date > start_date);

ALTER TABLE quiz_results
ADD CONSTRAINT check_score_range CHECK (score >= 0 AND score <= 100),
ADD CONSTRAINT check_answer_counts CHECK (correct_answers >= 0 AND correct_answers <= total_questions);
```

## Indexes tối ưu

```sql
CREATE INDEX idx_quiz_sessions_user_event ON quiz_sessions(user_id, event_id, started_at DESC);
CREATE INDEX idx_quiz_results_event_score ON quiz_results(event_id, score DESC);
CREATE INDEX idx_spin_codes_user_status ON spin_codes(user_id, status) WHERE status = 'available';
CREATE INDEX idx_spin_results_event_date ON spin_results(event_id, spun_at DESC);
CREATE INDEX idx_events_active ON events(status, start_date, end_date) WHERE status = 'active';

CREATE INDEX idx_session_answers_session ON session_answers(session_id) INCLUDE (question_id, answer_id);

CREATE INDEX idx_event_questions_event ON event_questions(event_id) INCLUDE (question_id);
```

## Data Retention Policy

### Archive Strategy
- Archive completed events sau 2 năm
- Archive quiz_sessions/results sau 1 năm (nếu event đã completed)
- Giữ spin_results vĩnh viễn (cho audit)

### Backup Strategy
- Full backup hàng ngày
- Incremental backup mỗi 6 giờ
- Point-in-time recovery enabled
- Retention: 30 ngày

## Security Considerations

### Row-Level Security (RLS)
```sql
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_own_results ON quiz_results
    FOR SELECT
    USING (user_id = current_user_id() OR current_user_role() = 'hr_manager');

CREATE POLICY user_own_spin_codes ON spin_codes
    FOR SELECT
    USING (user_id = current_user_id() OR current_user_role() = 'hr_manager');
```

### Audit Logging
Tất cả các bảng có các trường:
- `created_at`: Timestamp tạo
- `updated_at`: Timestamp cập nhật cuối
- `created_by`: User tạo (nếu áp dụng)

Bổ sung audit table:
```sql
CREATE TABLE audit_logs (
    id uuid PRIMARY KEY,
    table_name varchar(100),
    record_id uuid,
    action varchar(20), -- INSERT, UPDATE, DELETE
    old_data jsonb,
    new_data jsonb,
    user_id uuid,
    ip_address inet,
    timestamp timestamp DEFAULT NOW()
);
```
