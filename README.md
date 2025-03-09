# Airlink Panel

## Description
This is a **Airlink Panel** built using **Next.js**. The app is designed to efficiently manage game servers, providing an intuitive and user-friendly interface.

**Please note that Airlink Panel is still under development.**

## Contributing
We welcome contributions from the community! If you'd like to contribute, please follow the steps below:
1. Fork this repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature/YourFeature`).
6. Create a Pull Request.

## How to Use
To get started with the app, follow these steps:

### Installation
1. Clone the repository: `git clone https://github.com/airlinklabs/panel-next-js`
2. Navigate to the project directory: `cd panel-next-js`
3. Install dependencies: `npm install`

### Running the App
1. Start the development server: `npm run dev`
2. Open your browser and navigate to `http://localhost:3000` to view the app.

### Building for Production
1. Build the project: `npm run build`
2. Start the production server: `npm start`
3. Your app will be running on `http://localhost:3000`.

## Database Setup

### First-Time Database Initialization

To set up the database for the first time, follow these steps:

1. Make sure you have all dependencies installed:
```bash
# Using npm
npm install

# Using Bun
bun install
```

2. Initialize the database by running:
```bash
# Using npm
npm run db:init

# Using Bun
bun run db:init
```

This script will automatically detect whether you're using npm or Bun and:
- Generate the Prisma client
- Create and apply database migrations
- Seed the database with initial data

### Default Credentials

After initialization, you can log in with these default credentials:
- Email: admin@airlink.local
- Username: admin
- Password: admin123

**Important:** Please change these credentials after your first login!

### Manual Database Reset

If you need to reset the database manually, you can run these commands:

```bash
# Using npm
npx prisma generate
npx prisma migrate reset
npx prisma migrate dev
npx prisma db seed

# Using Bun
bunx prisma generate
bunx prisma migrate reset
bunx prisma migrate dev
bunx prisma db seed
```

### Troubleshooting

If you encounter any database-related issues:

1. Check if your database file exists in `prisma/dev.db`
2. Ensure you have proper write permissions in the prisma directory
3. Try deleting the `prisma/dev.db` file and running `npm run db:init` again
4. Check the Prisma logs in `prisma/migrations`

### Database Models

The application uses the following main models:

- `Users`: Application users with authentication details
- `Server`: Server instances managed by users
- `Node`: Server nodes for deployment
- `Images`: Docker images for server deployment
- `Settings`: Application-wide settings

For more details about the database schema, check `prisma/schema.prisma`.
