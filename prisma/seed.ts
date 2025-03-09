import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

console.log("🌱 Starting database seeding...")

async function main() {
    try {
        // Create default admin user
        const hashedPassword = await hash('admin123', 12)
        const adminUser = await prisma.users.upsert({
            where: { email: 'admin@airlink.local' },
            update: {},
            create: {
                email: 'admin@airlink.local',
                username: 'admin',
                password: hashedPassword,
                isAdmin: true,
                description: 'System Administrator'
            },
        })

        // Create default settings
        const defaultSettings = await prisma.settings.upsert({
            where: { id: 1 },
            update: {},
            create: {
                title: 'AirLink',
                description: 'AirLink is a free and open source project by AirlinkLabs',
                logo: '../assets/logo.png',
                theme: 'default',
                language: 'en'
            },
        })

        // Create a default node
        const defaultNode = await prisma.node.upsert({
            where: { id: 1 },
            update: {},
            create: {
                name: 'Default Node',
                ram: 8192,
                cpu: 4,
                disk: 50000,
                address: '127.0.0.1',
                port: 3001,
                key: 'default-key',
            },
        })

        // Create a default image
        const defaultImage = await prisma.images.upsert({
            where: { id: 1 },
            update: {},
            create: {
                UUID: 'default-image',
                name: 'Default Image',
                description: 'Default server image',
                author: 'system',
                authorName: 'System',
                dockerImages: 'nginx:latest',
                startup: 'nginx -g "daemon off;"',
            },
        })

        console.log("✅ Seeded database with:", { 
            adminUser, 
            defaultSettings,
            defaultNode,
            defaultImage
        })
    } catch (error) {
        console.error("❌ Error seeding database:", error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main() 