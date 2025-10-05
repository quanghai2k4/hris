import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const hrManager = await prisma.user.create({
        data: {
            employeeId: 'HR001',
            fullName: 'Jane Smith',
            email: 'hr@company.com',
            password: hashedPassword,
            role: 'HR_MANAGER',
        },
    });
    const employees = await Promise.all([
        prisma.user.create({
            data: {
                employeeId: 'EMP001',
                fullName: 'John Doe',
                email: 'john.doe@company.com',
                password: hashedPassword,
                role: 'EMPLOYEE',
            },
        }),
        prisma.user.create({
            data: {
                employeeId: 'EMP002',
                fullName: 'Sarah Johnson',
                email: 'sarah.johnson@company.com',
                password: hashedPassword,
                role: 'EMPLOYEE',
            },
        }),
        prisma.user.create({
            data: {
                employeeId: 'EMP003',
                fullName: 'Michael Brown',
                email: 'michael.brown@company.com',
                password: hashedPassword,
                role: 'EMPLOYEE',
            },
        }),
    ]);
    console.log(`✅ Created ${employees.length + 1} users`);
    const event = await prisma.event.create({
        data: {
            name: 'Q1 2025 Company Quiz Event',
            description: 'First quarter quiz event with exciting prizes!',
            status: 'ACTIVE',
            startDate: new Date('2025-01-01'),
            endDate: new Date('2025-03-31'),
            config: {
                create: {
                    minScore: 70,
                    questionCount: 10,
                    prizeMin: 50,
                    prizeMax: 500,
                    shuffleQuestions: true,
                    shuffleAnswers: true,
                },
            },
            budget: {
                create: {
                    totalBudget: 10000,
                    usedBudget: 0,
                    remainingBudget: 10000,
                    totalSpins: 0,
                },
            },
        },
    });
    console.log(`✅ Created event: ${event.name}`);
    const questionsData = [
        {
            content: 'What is the primary programming language used in our backend services?',
            type: 'SINGLE_CHOICE',
            answers: [
                { content: 'TypeScript', isCorrect: true, orderIndex: 0 },
                { content: 'Python', isCorrect: false, orderIndex: 1 },
                { content: 'Java', isCorrect: false, orderIndex: 2 },
                { content: 'Go', isCorrect: false, orderIndex: 3 },
            ],
        },
        {
            content: 'Which database system do we use for our main application?',
            type: 'SINGLE_CHOICE',
            answers: [
                { content: 'PostgreSQL', isCorrect: true, orderIndex: 0 },
                { content: 'MySQL', isCorrect: false, orderIndex: 1 },
                { content: 'MongoDB', isCorrect: false, orderIndex: 2 },
                { content: 'SQLite', isCorrect: false, orderIndex: 3 },
            ],
        },
        {
            content: 'What is our company core value?',
            type: 'SINGLE_CHOICE',
            answers: [
                { content: 'Innovation and Integrity', isCorrect: true, orderIndex: 0 },
                { content: 'Profit First', isCorrect: false, orderIndex: 1 },
                { content: 'Work Hard, Play Hard', isCorrect: false, orderIndex: 2 },
                { content: 'Maximum Efficiency', isCorrect: false, orderIndex: 3 },
            ],
        },
        {
            content: 'When was the company founded?',
            type: 'SINGLE_CHOICE',
            answers: [
                { content: '2015', isCorrect: true, orderIndex: 0 },
                { content: '2010', isCorrect: false, orderIndex: 1 },
                { content: '2018', isCorrect: false, orderIndex: 2 },
                { content: '2020', isCorrect: false, orderIndex: 3 },
            ],
        },
        {
            content: 'Our company follows Agile methodology.',
            type: 'TRUE_FALSE',
            answers: [
                { content: 'True', isCorrect: true, orderIndex: 0 },
                { content: 'False', isCorrect: false, orderIndex: 1 },
            ],
        },
        {
            content: 'What is the maximum number of vacation days per year?',
            type: 'SINGLE_CHOICE',
            answers: [
                { content: '20 days', isCorrect: true, orderIndex: 0 },
                { content: '15 days', isCorrect: false, orderIndex: 1 },
                { content: '25 days', isCorrect: false, orderIndex: 2 },
                { content: '10 days', isCorrect: false, orderIndex: 3 },
            ],
        },
        {
            content: 'Which of these are company benefits? (Select all that apply)',
            type: 'MULTIPLE_CHOICE',
            answers: [
                { content: 'Health Insurance', isCorrect: true, orderIndex: 0 },
                { content: '401k Matching', isCorrect: true, orderIndex: 1 },
                { content: 'Gym Membership', isCorrect: true, orderIndex: 2 },
                { content: 'Company Car', isCorrect: false, orderIndex: 3 },
            ],
        },
        {
            content: 'What time does the office officially open?',
            type: 'SINGLE_CHOICE',
            answers: [
                { content: '9:00 AM', isCorrect: true, orderIndex: 0 },
                { content: '8:00 AM', isCorrect: false, orderIndex: 1 },
                { content: '10:00 AM', isCorrect: false, orderIndex: 2 },
                { content: '7:00 AM', isCorrect: false, orderIndex: 3 },
            ],
        },
        {
            content: 'We have a remote work policy.',
            type: 'TRUE_FALSE',
            answers: [
                { content: 'True', isCorrect: true, orderIndex: 0 },
                { content: 'False', isCorrect: false, orderIndex: 1 },
            ],
        },
        {
            content: 'What is our main product?',
            type: 'SINGLE_CHOICE',
            answers: [
                { content: 'HRIS Platform', isCorrect: true, orderIndex: 0 },
                { content: 'CRM Software', isCorrect: false, orderIndex: 1 },
                { content: 'ERP System', isCorrect: false, orderIndex: 2 },
                { content: 'Project Management Tool', isCorrect: false, orderIndex: 3 },
            ],
        },
    ];
    console.log('📝 Creating questions and answers...');
    for (let i = 0; i < questionsData.length; i++) {
        const questionData = questionsData[i];
        const question = await prisma.question.create({
            data: {
                content: questionData.content,
                type: questionData.type,
                answers: {
                    create: questionData.answers,
                },
            },
        });
        await prisma.eventQuestion.create({
            data: {
                eventId: event.id,
                questionId: question.id,
                orderIndex: i,
            },
        });
    }
    console.log(`✅ Created ${questionsData.length} questions with answers`);
    console.log('✅ Linked all questions to the event');
    console.log('\n🎉 Seed completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   - Users: ${employees.length + 1} (1 HR Manager, ${employees.length} Employees)`);
    console.log(`   - Events: 1`);
    console.log(`   - Questions: ${questionsData.length}`);
    console.log('\n🔑 Login credentials (all users):');
    console.log('   - Password: password123');
    console.log(`   - HR Manager: hr@company.com`);
    console.log(`   - Employees: john.doe@company.com, sarah.johnson@company.com, michael.brown@company.com`);
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map