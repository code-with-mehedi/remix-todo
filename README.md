# Remix Todo App

## Overview

This is a simple Todo App built using **Remix** and **Prisma** for managing tasks. It allows users to:

- View a list of todos.
- Add new todos.
- Edit existing todos.
- Delete todos.

The app is designed with a responsive layout and includes basic features for managing a todo list.
<img width="695" alt="image" src="https://github.com/user-attachments/assets/546e61a9-49b2-428d-ab80-3b47313cccf6" />


## GitHub Repository

You can access the source code for this project here:  
[Remix Todo App Repository](https://github.com/code-with-mehedi/remix-todo)

## Requirements

Before running the app, you will need to set up the following:

- **Node.js**: Ensure you have [Node.js](https://nodejs.org/) installed (version 16.0.0 or higher is recommended).
- **Prisma**: Prisma ORM is used for database management.
- **MySQL Database**: You need a running MySQL database to store todos.

## Installation

Follow the steps below to install and set up the Remix Todo App:

### 1. Clone the repository

```bash
git clone https://github.com/code-with-mehedi/remix-todo.git
cd remix-todo
```
2. Install dependencies

```bash
npm install
```
3. Set up environment variables
Create a .env file in the root directory and configure your database connection. If you're using MySQL, the .env file should look like this:

DATABASE_URL="mysql://root@127.0.0.1:3330/remix-todo"
Ensure that the MySQL server is running on 127.0.0.1:3330, and the remix-todo database exists or can be created automatically.

4. Run database migrations
Run the following Prisma commands to set up your database schema:

```bash
npx prisma migrate dev --name init
This will apply the migration and generate the necessary files to connect to your database.
```
5. Generate Prisma Client
After applying migrations, generate the Prisma client:

```bash
npx prisma generate
```
6. Start the development server
Now, run the development server:

```bash
npm run dev
```
The app should now be accessible at http://localhost:3000.


1. Set up Prisma Client
Install the necessary Prisma dependencies:

```bash
npm install @prisma/client
npm install prisma --save-dev
```
2. Define Your Database Schema
In the prisma/schema.prisma file, define your database schema. The Todo model should look like this:
```bash
datasource db {
  provider = "mysql" // Use "mysql" for MySQL database
  url      = env("DATABASE_URL") // The URL is taken from the .env file
}

generator client {
  provider = "prisma-client-js"
}

model Todo {
  id        Int     @id @default(autoincrement())
  title     String
  completed Boolean @default(false)
}
```
3. Run Prisma Migrations
To apply the schema changes to the database, run the following command:

```bash
npx prisma migrate dev --name init
```
This will generate the migration file and apply it to your remix-todo database.

4. Generate Prisma Client
After running migrations, generate Prisma Client:

```bash
npx prisma generate
```
5. Connecting to the Database
In the app, the Prisma Client is initialized like this:

```bash

const prisma = new PrismaClient();
```
This client allows you to interact with the database by performing queries, updates, and deletions, as seen in the app’s loader and action functions.

6. Verifying the Setup
After completing the setup, you should be able to run the app, interact with the todos, and have them persist in your MySQL database.

License
This app is open-source and available under the MIT License.
