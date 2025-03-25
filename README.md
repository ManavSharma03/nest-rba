# Project Documentation

## Overview

This project is a **NestJS-based backend system** that provides authentication, user management, and document management functionalities. The system is structured using **TypeScript**, **PostgreSQL**, and follows a **microservices architecture**.

## Key Features

- **Authentication APIs**: User registration, login, logout, and refresh token functionality.
- **User Management APIs**: CRUD operations for managing users (admin-only access).
- **Document Management APIs**: Upload, retrieve, list, and delete documents.
- **JWT Authentication & Role-Based Access Control (RBAC)**: Ensures secure access to APIs.

## Modules & APIs

### 1. Authentication Module

**Controller:** `AuthController`

| Endpoint              | Method | Description                       | Access              |
| --------------------- | ------ | --------------------------------- | ------------------- |
| `/auth/register`      | POST   | Register a new user               | Public              |
| `/auth/login`         | POST   | Authenticate and return JWT token | Public              |
| `/auth/refresh-token` | POST   | Refresh access token              | Public              |
| `/auth/logout`        | POST   | Logout and invalidate token       | Authenticated Users |

### 2. User Management Module

**Controller:** `UsersController`

| Endpoint     | Method | Description           | Access |
| ------------ | ------ | --------------------- | ------ |
| `/users`     | POST   | Create a new user     | Admin  |
| `/users`     | GET    | List all users        | Admin  |
| `/users/:id` | GET    | Get details of a user | Admin  |
| `/users/:id` | PUT    | Update user details   | Admin  |
| `/users/:id` | DELETE | Remove a user         | Admin  |

### 3. Document Management Module

**Controller:** `DocumentsController`

| Endpoint                  | Method | Description                | Access              |
| ------------------------- | ------ | -------------------------- | ------------------- |
| `/documents/upload`       | POST   | Upload a document          | Authenticated Users |
| `/documents/:id`          | GET    | Retrieve document metadata | Authenticated Users |
| `/documents/:id/download` | GET    | Download document file     | Authenticated Users |
| `/documents`              | GET    | List all documents         | Authenticated Users |
| `/documents/:id`          | DELETE | Delete a document          | Admin               |

## Permissions Management

The permissions system in this project allows fine-grained control over user access to different modules.

### 🔹 Table Structure

Each permission entry is linked to a specific user and defines access control for a specific module (feature).

- **User-Specific Permissions**: Each user can have custom permissions set by an admin.
- **Default Role-Based Permissions (Future Scope)**: Users will inherit permissions from their role, but these can be overridden by admins.

## Authentication & Authorization

- **JWT Authentication** is used for secure API access.
- Users are assigned roles: `admin`, `user`, `editor`, `viewer`.
- **Admin-only APIs**: User management and document deletion.

# Database Seeding Script (`seed.ts`)

## Purpose

The `seed.ts` script is designed to **populate the database with dummy data** for testing and development purposes. It creates sample users and documents, ensuring a consistent dataset for debugging and validation.

## What It Does

- **Connects to PostgreSQL** using TypeORM.
- **Generates 1000 dummy users** with random emails, hashed passwords, and different roles (`admin`, `user`, `editor`, `viewer`).
- **Creates 200 random documents** with different file types and stores them in the `uploads/` directory.
- **Stores document metadata** (filename, path, MIME type) in the database.
- **Ensures the required directories exist** before saving files.

## How to Run

To execute the seeding script, use:

````sh
npm run seed


## Tech Stack

- **Backend Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL (TypeORM for ORM)
- **Authentication**: JWT-based authentication
- **File Uploads**: Multer for handling document uploads

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <project-directory>
````
