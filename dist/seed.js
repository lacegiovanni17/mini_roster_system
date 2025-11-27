"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'roster_system',
    entities: ['src/**/*.entity.ts'],
    synchronize: false,
});
async function seed() {
    await AppDataSource.initialize();
    const userRepo = AppDataSource.getRepository('User');
    const admin = await userRepo.save({
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
    });
    const user1 = await userRepo.save({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
    });
    const user2 = await userRepo.save({
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
    });
    console.log('Users created');
    const shiftRepo = AppDataSource.getRepository('Shift');
    const shift1 = await shiftRepo.save({
        startTime: new Date('2025-11-26T06:00:00'),
        endTime: new Date('2025-11-26T14:00:00'),
        timeSlot: 'morning',
        isOpen: true,
    });
    const shift2 = await shiftRepo.save({
        startTime: new Date('2025-11-26T14:00:00'),
        endTime: new Date('2025-11-26T22:00:00'),
        timeSlot: 'afternoon',
        isOpen: true,
    });
    const shift3 = await shiftRepo.save({
        startTime: new Date('2025-11-27T22:00:00'),
        endTime: new Date('2025-11-28T06:00:00'),
        timeSlot: 'night',
        isOpen: false,
    });
    console.log('Shifts created');
    const assignmentRepo = AppDataSource.getRepository('Assignment');
    await assignmentRepo.save({
        userId: user1.id,
        shiftId: shift3.id,
    });
    await assignmentRepo.save({
        userId: user2.id,
        shiftId: shift3.id,
    });
    console.log('Assignments created');
    console.log('Seed data completed successfully!');
    await AppDataSource.destroy();
}
seed().catch((error) => {
    console.error('Error seeding data:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map