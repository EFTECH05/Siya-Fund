# Siya-Fund 💰

A mobile savings group management application built with React Native (Expo) and Firebase. Siya-Fund digitalises the traditional South African stokvel system, allowing users to create and manage savings groups, make contributions, request loans, and track transactions — all from their phone.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Firebase Database Structure](#firebase-database-structure)
- [Installation and Setup](#installation-and-setup)
- [Running the App](#running-the-app)
- [User Roles](#user-roles)
- [Group Membership](#group-membership)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## Project Overview

Siya-Fund replaces manual, cash-based stokvel management with a secure digital platform. Members can join savings groups using a unique join code, track their contributions and loans, and group administrators can manage membership — all in real time via Firebase Firestore.

---

## Features

- ✅ User registration and login (email/password)
- ✅ Google Sign-In support (requires custom dev build)
- ✅ Create savings groups with auto-generated join codes
- ✅ Join groups using a 6-character join code
- ✅ Admin can add and remove group members
- ✅ Duplicate membership prevention
- ✅ Make and track contributions
- ✅ Request and manage loans
- ✅ Transaction history
- ✅ Super admin dashboard with platform-wide stats
- ✅ Role-based access control (user vs super_admin)
- ✅ OTP verification via backend email service

---

## System Architecture

| Layer | Technology |
|---|---|
| Frontend | React Native (Expo SDK 57) |
| Navigation | Expo Router (file-based) |
| Language | TypeScript |
| Authentication | Firebase Authentication |
| Database | Firebase Firestore |
| Backend | Node.js + Express (OTP service) |
| Admin Scripts | Firebase Admin SDK |

### Architecture Pattern

The frontend follows a layered architecture:

```
Screen (app/)
  → Controller (controllers/)
    → Service (services/)
      → Firebase (Firestore / Auth)
```

- **Screens** handle UI and user interaction only
- **Controllers** contain business logic and authorization checks
- **Services** handle all Firebase read/write operations
- **Models** define TypeScript interfaces for all data structures

---

## Firebase Database Structure

### `users` collection
```
{
  uid:         string      // Firebase Auth UID
  email:       string
  displayName: string
  firstName:   string
  lastName:    string
  role:        "user" | "super_admin"
  createdAt:   timestamp
  updatedAt:   timestamp
}
```

### `groups` collection
```
{
  name:        string
  description: string
  creatorId:   string      // UID of the group admin
  members:     string[]    // array of member UIDs
  joinCode:    string      // 6-character alphanumeric code
  createdAt:   timestamp
  updatedAt:   timestamp
}
```

### `contributions` collection
```
{
  userId:      string
  amount:      number
  currency:    "ZAR"
  title:       string
  description: string
  status:      "pending"
  createdAt:   timestamp
}
```

### `loans` collection
```
{
  userId:      string
  amount:      number
  currency:    "ZAR"
  purpose:     string
  termMonths:  number
  status:      "pending"
  createdAt:   timestamp
  updatedAt:   timestamp
}
```

### `transactions` collection
```
{
  userId:        string
  amount:        number
  currency:      "ZAR"
  type:          "contribution"
  status:        "pending"
  referenceId:   string
  referenceType: "contribution"
  createdAt:     timestamp
}
```

---

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Expo Go](https://expo.dev/go) app installed on your phone
- A Firebase project (already configured in `src/services/firebase.ts`)

### Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/EFTECH05/Siya-Fund.git

# 2. Navigate to the frontend
cd Siya-Fund/frontend

# 3. Install dependencies
npm install
npx expo run:android
# 4. Start the development server
npx expo start
```

npx expo run:android
### Backend Setup (OTP Service)

```bash
# In a separate terminal
cd Siya-Fund/backend
npm install
npm run dev
```
npx expo run:android


---
npx expo start --web
## Running the App

After running `npx expo start`:

| Platform | Command |
|---|---|
| Android (Expo Go) | Scan QR code with Expo Go app |
| Android emulator | Press `a` in terminal |
| iOS simulator | Press `i` in terminal (Mac only) |
| Web | Press `w` in terminal |

> **Note:** Google Sign-In requires a custom dev build (`npx expo run:android`) and does not work in Expo Go.

---

## User Roles

| Role | Permissions |
|---|---|
| `user` | Register, login, create groups, join groups, make contributions, request loans |
| `super_admin` | All user permissions + view all groups, contributions, loans, and transactions across the platform |

---

## Group Membership

Group membership is managed through the following flow:

1. **Create a group** — the creator becomes the group admin and a unique 6-character join code is auto-generated
2. **Share the code** — visible on the group details screen, share it with anyone you want to invite
3. **Join a group** — tap "Join with Code" on the Groups screen and enter the code
4. **Add a member** — admins can add a member directly by their UID
5. **Remove a member** — admins can remove any non-creator member
6. **Duplicate prevention** — the system prevents a user from joining a group they are already in

---

## Testing

### Running Unit Tests

```bash
cd frontend
npm install --save-dev jest jest-expo @types/jest
npm test
```

### Test Coverage

| Test File | What is Tested |
|---|---|
| `GroupService.test.ts` | `generateJoinCode` — length, format, uniqueness |
| `GroupController.test.ts` | `handleCreateGroup`, `handleAddMember`, `handleRemoveMember`, `handleJoinGroup` — success cases, error cases, auth guards, duplicate prevention |

### Manual Test Results

| Test Case | Expected Result | Pass/Fail |
|---|---|---|
| Register new user | Account created in Firebase | ✅ Pass |
| Login with valid credentials | Dashboard loads | ✅ Pass |
| Create a savings group | Group appears in list with join code | ✅ Pass |
| Join group with valid code | User added to group members | ✅ Pass |
| Join group with invalid code | Error: "No group found with that join code" | ✅ Pass |
| Join group already a member | Error: "You are already a member" | ✅ Pass |
| Add member as admin | Member appears in list | ✅ Pass |
| Add duplicate member | Error: "This user is already a member" | ✅ Pass |
| Remove member as admin | Member removed from list | ✅ Pass |
| Non-admin tries admin action | Action blocked, error shown | ✅ Pass |
| View member list with profiles | Names and emails displayed | ✅ Pass |

---

## Project Structure

```
Siya-Fund/
├── frontend/
│   ├── src/
│   │   ├── app/               # Screens (Expo Router file-based routes)
│   │   │   ├── groups/        # Group screens ([id].tsx, index.tsx, create.tsx)
│   │   │   ├── contributions/ # Contribution screens
│   │   │   ├── loans/         # Loan screens
│   │   │   ├── transactions/  # Transaction screens
│   │   │   └── super-admin/   # Super admin screens
│   │   ├── controllers/       # Business logic layer
│   │   ├── services/          # Firebase service layer
│   │   ├── models/            # TypeScript interfaces
│   │   ├── components/        # Reusable UI components
│   │   └── views/             # Screen layout components
│   ├── assets/                # Images and icons
│   └── package.json
├── backend/
│   └── src/
│       ├── controllers/       # OTP controller
│       ├── routes/            # API routes
│       └── services/          # Email and Firebase Admin services
└── admin/
    └── create-super-admin.ts  # Script to create super admin account
```

---

## Built With

- [Expo](https://expo.dev) — React Native framework
- [Firebase](https://firebase.google.com) — Authentication and Firestore database
- [Expo Router](https://expo.github.io/router) — File-based navigation
- [TypeScript](https://www.typescriptlang.org) — Type safety
- [React Native](https://reactnative.dev) — Mobile UI framework
