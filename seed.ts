// Node script to handle adding dummy data in the db

import { DataSource } from 'typeorm';
import { User } from './src/modules/users/entity/user.entity';
import { Document } from './src/modules/documents/entity/document.entity';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as mime from 'mime-types';
import 'dotenv/config';
import { UserRoles } from './src/common/types';
import { Permission } from './src/modules/permissions/entity/permission.entity';

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Document, Permission],
    synchronize: false,
});

console.debug({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})


async function seedDatabase() {
    console.debug({ action: "init" })
    await dataSource.initialize();
    console.debug({ action: "initialized" })

    const userRepository = dataSource.getRepository(User);
    const documentRepository = dataSource.getRepository(Document);
    console.debug({ action: "entity loaded" })


    const users: User[] = [];
    // for (let i = 0; i < 1000; i++) {
    //     const email = faker.internet.email();
    //     const password = faker.internet.password();
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     const user = userRepository.create({
    //         email,
    //         password: hashedPassword,
    //         role: faker.helpers.arrayElement([
    //             UserRoles.user,
    //             UserRoles.admin,
    //             UserRoles.editor,
    //             UserRoles.viewer,
    //         ]),
    //     });
    //     console.debug({ action: `Adding ${i}th user`, email, password })
    //     users.push(await userRepository.save(user));
    // }

    console.debug({ action: "user saved" })

    const uploadDir = path.join(__dirname, './uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (let i = 0; i < 200; i++) {
        const fileExtensions = ['txt', 'pdf', 'docx', 'csv', 'json', 'xml', 'html'];
        const randomExt = faker.helpers.arrayElement(fileExtensions);
        
        const filename = `doc_${i + 1}.${randomExt}`;
        const filePath = path.join("uploads/", filename);

        console.debug({ action: "storing file path as" })
        fs.writeFileSync(filePath, faker.lorem.paragraphs(5));

        const document = documentRepository.create({
            filename,
            path: filePath,
            mimetype: mime.lookup(filePath) || 'text/plain',
        });
        await documentRepository.save(document);
    }

    console.debug({ action: "document saved" })


    process.exit();
}

seedDatabase().catch((err) => {
    console.error('Seeding Failed:', err);  // Log full error
    console.error('Error Stack:', err.stack);
    process.exit(1);
});
