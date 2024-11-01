# Library Management System

A simple Library Management System built with NestJS, designed to manage book borrowing and inventory tracking. This project includes a MySQL database for persistence, migrations to manage database schema, and a seeder to populate initial data.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** and **npm** - [Node.js Download](https://nodejs.org)
- **NestJS CLI** - `npm install -g @nestjs/cli`
- **Docker** - [Docker Download](https://www.docker.com/products/docker-desktop)

## Setup Instructions

Follow these steps to set up and run the Library Management System:

### Step 1: Clone the Repository

Clone this repository to your local machine:

```bash
$ git clone https://github.com/eslamelansary/library-managment-system.git
$ cd library-management-system

### Step 2: Install Project Dependencies

Install the required npm packages:

$ npm install

### Step 3: Set Up the MySQL Database

Pull the MySQL Docker image:

$ docker pull mysql:latest

Run a MySQL container with the necessary credentials:

$ docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3010:3306 -d mysql:latest -e "CREATE DATABASE library_management_system;"

In your Database IDE Run => 'CREATE DATABASE library_management_system';

### Step 4: Generate Database Migrations

Run the following command to generate database migration files:

$ npm run migration:generate -- src/database/migrations/init

### Step 5: Run Database Migrations

Apply the migrations to set up the database schema:

$ npm run migration:run

### Step 6: Seed the Database

Seed the database with initial data:
$ npm run seeder

#### Step 7: Start the Application

Finally, run the application:

$ npm run start:dev

The application will be available at http://localhost:3000.

Usage
After starting the application, you can use the API to manage books, borrowers, and track due dates.
