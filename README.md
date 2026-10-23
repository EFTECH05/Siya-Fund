# Siya-Fund — Stokvel Savings & Loan Management Platform

Siya-Fund is a mobile and web-based financial management application being developed as part of a five-month Work Integrated Learning (WIL) project. The platform aims to help South African stokvel groups manage members, savings contributions, transactions, and loan requests through a simple and user-friendly interface.

The project focuses on digitising stokvel management, improving the organisation of financial records, and providing convenient access to group management features.

**Project status:** In Development  
**Project type:** Work Integrated Learning 3 (WIL 3)  
**Repository:** [EFTECH05/Siya-Fund](https://github.com/EFTECH05/Siya-Fund)  
**Demo video — Tasks 1 & 2:** [Watch on YouTube](https://youtu.be/_7wb0Phdr5s)
<img width="558" height="362" alt="image" src="https://github.com/user-attachments/assets/8f7e12e2-61bf-4123-a677-6d5e850cf646" />

---
<img width="1280" height="960" alt="WhatsApp Image 2026-10-23 at 02 40 40" src="https://github.com/user-attachments/assets/63319a62-b0fb-4e65-bfb4-1ab426706b0c" />

## Table of Contents

- [Project Overview](#project-overview)
- [Screenshots](#screenshots)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Application Architecture](#application-architecture)
- [Project Structure](#project-structure)
- [Team Members and Contributions](#team-members-and-contributions)
- [Getting Started](#getting-started)
- [Running the Web Application](#running-the-web-application)
- [Running on Android](#running-on-android)
- [My Roles and Contributions](#my-roles-and-contributions)
- [Demo Video](#demo-video)
- [Project Status](#project-status)
- [Learning Outcomes](#learning-outcomes)

---

## Project Overview

Siya-Fund aims to provide a central platform for managing stokvel savings groups and their financial activities.

Through the application, members can create and join groups, manage contributions, view transactions, and submit loan requests. Group administrators can manage membership, while authorised administrators can access additional management functionality.

The application is being developed for mobile and web platforms using React Native and Expo, with Firebase services supporting authentication and data management.
<img width="684" height="364" alt="image" src="https://github.com/user-attachments/assets/03ac7d7a-5ce9-4ca8-96ea-0d8cb6ea621a" />

<img width="687" height="375" alt="image" src="https://github.com/user-attachments/assets/51a946da-15d4-43c4-8a22-32843fe2c4b1" />
<img width="700" height="539" alt="image" src="https://github.com/user-attachments/assets/bb9bbac9-e56e-417e-a2be-bfc34ecc13c4" />

<img width="673" height="448" alt="image" src="https://github.com/user-attachments/assets/6776b0da-b187-4937-8bb8-e573d2ade43d" />

## Key Features
<img width="682" height="320" alt="image" src="https://github.com/user-attachments/assets/19561770-8390-4a45-9658-d554d8ddda8b" />

Test Case: Creating a Loan Request 
<img width="719" height="526" alt="image" src="https://github.com/user-attachments/assets/6b224435-a6a1-43f2-9a93-33f1a82c8bab" />
Test Case: Remove Member
<img width="689" height="502" alt="image" src="https://github.com/user-attachments/assets/6ef74350-ebfc-47aa-bc1b-c7944ce56ae4" />
<img width="710" height="514" alt="image" src="https://github.com/user-attachments/assets/34140908-02f5-428d-afc5-997c36458a06" />

### 1. User Authentication
- User registration and login.
- Email and password authentication.
- Email verification using a one-time password (OTP).
- Password reset functionality.

### 2. Savings Group Management
- Create new savings groups.
- Join existing groups using unique joining codes.
- View group information.
- Manage group membership.

### 3. Contribution Management
- Record savings contributions.
- View contribution records.
- Keep group savings information organised.

### 4. Transaction Management
- View transaction history.
- Access recorded financial transactions.
- Improve the organisation of group financial records.

### 5. Loan Management
- Submit loan requests.
- Access loan-related information.
- Support organised loan management workflows.

### 6. Administrative Features
- Add and remove group members according to permissions.
- Apply role-based access control.
- Provide super-administrator functionality for platform-wide management.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile application development |
| Expo | Application development and platform tooling |
| Expo Router | File-based application navigation |
| JavaScript / JSX | Frontend application development |
| Firebase Authentication | User authentication |
| Cloud Firestore | Cloud database and data management |
| Node.js | Backend runtime |
| Express.js | Backend services and API endpoints |
| Firebase Admin SDK | Server-side Firebase operations |

---

## Application Architecture

The application follows a layered architecture that separates interface components, application logic, data models, and services.

### 1. Presentation Layer
Contains application screens and reusable UI components that users interact with.

### 2. Controller Layer
Coordinates application logic and handles actions related to authentication, groups, contributions, transactions, and loans.

### 3. Model Layer
Defines the data structures used by the application, including users, groups, contributions, transactions, and loans.

### 4. Service Layer
Handles communication with Firebase and other application services.

### 5. Utility Layer
Contains shared validation logic and application constants.

This structure promotes separation of responsibilities, maintainability, and code reuse.

---

## Project Structure

The following structure documents the planned organisation of the main application. The actual repository may evolve during development.

### Main Application — Group Management

```text
Siya-Fund/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── _layout.jsx
│   │   │   ├── index.jsx
│   │   │   ├── login.jsx
│   │   │   ├── register.jsx
│   │   │   ├── dashboard.jsx
│   │   │   ├── groups/
│   │   │   │   ├── index.jsx
│   │   │   │   ├── create.jsx
│   │   │   │   └── [id].jsx
│   │   │   ├── contributions/
│   │   │   │   ├── index.jsx
│   │   │   │   └── create.jsx
│   │   │   ├── transactions/
│   │   │   │   ├── index.jsx
│   │   │   │   └── [id].jsx
│   │   │   └── loans/
│   │   │       ├── index.jsx
│   │   │       ├── request.jsx
│   │   │       └── [id].jsx
│   │   ├── views/
│   │   │   ├── screens/
│   │   │   └── components/
│   │   ├── controllers/
│   │   │   ├── AuthController.js
│   │   │   ├── GroupController.js
│   │   │   ├── ContributionController.js
│   │   │   ├── TransactionController.js
│   │   │   └── LoanController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Group.js
│   │   │   ├── Contribution.js
│   │   │   ├── Transaction.js
│   │   │   └── Loan.js
│   │   ├── services/
│   │   │   ├── firebase.js
│   │   │   ├── AuthService.js
│   │   │   ├── GroupService.js
│   │   │   ├── ContributionService.js
│   │   │   ├── TransactionService.js
│   │   │   └── LoanService.js
│   │   ├── utils/
│   │   │   ├── validation.js
│   │   │   └── constants.js
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   ├── package.json
│   │   └── app.json
│   └── README.md
├── backend/
├── docs/
│   ├── requirements/
│   ├── architecture/
│   ├── database/
│   ├── testing/
│   ├── user-manual/
│   └── screenshots/
├── README.md
└── .gitignore
```

### UI/UX Design Structure

The design structure organises reusable interface components, visual styles, and image assets.

```text
design/
├── app/
│   ├── _layout.jsx
│   └── index.jsx
├── components/
│   ├── Header.jsx
│   ├── Logo.jsx
│   ├── TopImage.jsx
│   ├── Button.jsx
│   └── ...
├── styles/
│   ├── colors.js
│   ├── typography.js
│   └── globalStyles.js
├── assets/
│   └── images/
│       ├── siya3.png
│       └── siya-logo.png
├── controllers/
├── models/
├── services/
└── utils/
```

The design assets and components can be reused in the main application where appropriate.

> **Note:** These folder structures are documentation examples based on the supplied project layout. Check the current repository before assuming every listed file or directory exists. The `design/` structure may be maintained separately from `frontend/`.

---

## Team Members and Contributions

Siya-Fund is a collaborative project involving six team members. Each member has an assigned role and contributes to different areas of the software development lifecycle.

| Team Member | Assigned Role | Contributions |
|---|---|---|
| **Franklin Ngangu Simbi** | Lead Developer | Contributes to application development and technical implementation. Previously contributed to UI/UX design and is taking on Project Management and Quality Assurance responsibilities during the final sprint. |
| **David Ayowa** | Lead Developer / Developer | Contributes to application development and implementation of project functionality. |
| **Ishka Sewshanker** | Business Analyst / Developer | Contributes to business requirements analysis and software development. |
| **Khodai Wanga Chantel Mafunise** | Tester / Developer | Contributes to application testing, quality assurance activities, and software development. |
| **Mororiseng Jesicca Legodi** | Project Manager / Developer | Contributes to project coordination, project management activities, and software development. |
| **Xolisile Princess Mnyandu** | Database Designer / Developer | Contributes to database design and software development. |

### Shared Team Contributions

All team members collaborate to support the development and delivery of Siya-Fund.

Shared activities include:

- Requirements analysis and project documentation.
- Application development and integration.
- Collaboration between frontend, backend, and data-related components.
- Testing, defect identification, and improvements.
- Progress updates and coordination of project tasks.
- Preparation of project documentation and user guidance.

Individual responsibilities may overlap when team collaboration is required.

---

## Getting Started

Follow the instructions below to set up the project locally.

### Prerequisites

Ensure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- [Expo](https://expo.dev/)
- [Android Studio](https://developer.android.com/studio) for local Android development
- A Firebase project configured for the application

### 1. Clone the Repository

```bash
git clone https://github.com/EFTECH05/Siya-Fund.git
cd Siya-Fund
```

### 2. Install Dependencies

Install dependencies in the backend and frontend directories separately. Follow the commands below according to your local project structure.

---

## Running the Web Application

The following commands use the local development path currently provided for the project.

### Terminal 1 — Backend Server

```bash
cd ~/OneDrive/Documents/GitHub/Siya-Fund/Siya-Fund-feature-group-membership/backend
npm install
npm run dev
```

Keep the backend terminal running.

### Terminal 2 — Frontend Web Application

```bash
cd ~/OneDrive/Documents/GitHub/Siya-Fund/Siya-Fund-feature-group-membership/frontend
npm install
npx expo start --web
```

The Expo web application should open in your browser if the project is configured for web and the required dependencies are installed.

**Important:** If you cloned the repository to a different location, replace the example absolute path with your own project path. The backend must also define a `dev` script in its `package.json` for `npm run dev` to work.

---

## Running on Android

To run Siya-Fund on an Android emulator or connected Android device, start the backend first.

### Terminal 1 — Backend Server

```bash
cd ~/OneDrive/Documents/GitHub/Siya-Fund/Siya-Fund-feature-group-membership/backend
npm install
npm run dev
```

### Terminal 2 — Android Application

```bash
cd ~/OneDrive/Documents/GitHub/Siya-Fund/Siya-Fund-feature-group-membership/frontend
npm install
npx expo run:android
```

### Android Requirements

Before running the application:

1. Install Android Studio and the Android SDK.
2. Start an Android emulator or connect an Android device with USB debugging enabled.
3. Ensure the frontend can communicate with the backend.
4. Configure the correct backend URL for your emulator or physical device.
5. Configure the required Firebase settings and native dependencies.

`npx expo run:android` builds and launches the native Android application. The first build may take longer because native dependencies must be compiled.

### Environment Configuration

Configure the Firebase and backend settings required by the source code.

- Use the environment variable names expected by the application.
- Keep private credentials and service-account keys out of Git.
- Do not commit `.env` files containing secrets.
- Ensure the frontend uses the correct API base URL for the platform on which it runs.

---

## My Roles and Contributions

My responsibilities in Siya-Fund have covered different stages of the software development lifecycle.

### UI/UX Designer
Previously contributed to designing the user interface and supporting a simple, user-friendly application experience.

### Lead Developer
Contribute to application development and technical implementation as part of the development team.

### Project Manager — Final Sprint
Taking on project management responsibilities during the final sprint, including coordinating activities, monitoring progress, and supporting the delivery of project tasks.

### Quality Assurance — Final Sprint
Taking on QA responsibilities during the final sprint, including testing application functionality, identifying defects, and verifying fixes.

These responsibilities provide practical experience across UI/UX design, application development, project coordination, and software quality assurance.

---

## Demo Video

Watch the demonstration of Siya-Fund covering Tasks 1 and 2.

[**▶ Watch the Siya-Fund Demo on YouTube**](https://youtu.be/_7wb0Phdr5s)

---

## Project Status

Siya-Fund is being developed as part of a five-month Work Integrated Learning project.

The application and its documentation may evolve as the team continues implementation, testing, and final-sprint activities.

## Learning Outcomes

The project provides practical experience in:

- Cross-platform mobile and web application development.
- UI/UX design and reusable interface components.
- Firebase authentication and data management.
- Savings group and financial-record management.
- Backend service integration.
- Software testing and quality assurance.
- Team collaboration and project management.
- Technical documentation and application setup.

---

Developed collaboratively as part of **Work Integrated Learning 3 (WIL 3)**.

